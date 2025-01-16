class VideoTranscoder {
    constructor() {
        this.jobs = new Map();
        this.presets = new Map();
        this.resources = {
            cpu: 100,
            memory: 100,
            gpu: 100
        };
        this.activeJobs = 0;
    }

    createPreset({ name, format, resolution, bitrate, codec, filters }) {
        if (!bitrate || typeof bitrate !== 'number') {
            throw new Error('Invalid bitrate value');
        }

        if (!name || !format || !resolution || !codec) {
            throw new Error('Missing required preset settings');
        }

        if (!this.isValidResolution(resolution)) {
            throw new Error('Invalid resolution format');
        }

        if (!this.isValidBitrate(bitrate)) {
            throw new Error('Invalid bitrate value');
        }

        const presetId = `P${Date.now()}${Math.floor(Math.random() * 1000)}`;
        this.presets.set(presetId, {
            name,
            format,
            resolution,
            bitrate,
            codec,
            filters: filters || [],
            resourceProfile: this.calculateResourceProfile({ resolution, bitrate, codec, filters })
        });

        return presetId;
    }

    submitJob({ inputPath, presetId, priority = 'normal', metadata = {} }) {
        if (!inputPath) {
            throw new Error('Invalid input file');
        }
        if (!presetId) {
            throw new Error('Missing required job parameters');
        }

        const preset = this.presets.get(presetId);
        if (!preset) {
            throw new Error('Invalid preset ID');
        }

        if (!this.validateVideoFile(inputPath)) {
            throw new Error('Invalid input file');
        }

        const resourceRequirements = this.calculateResourceRequirements(preset, metadata);
        const jobId = `J${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        this.jobs.set(jobId, {
            inputPath,
            presetId,
            priority,
            metadata,
            status: 'queued',
            progress: 0,
            resourceRequirements,
            stats: {
                startTime: null,
                endTime: null,
                framesProcessed: 0,
                averageFps: 0,
                peakMemoryUsage: 0,
                currentMemoryUsage: 0,
                duration: 0
            },
            errors: []
        });

        this.scheduleJob(jobId);
        const job = this.jobs.get(jobId);
        return { jobId, status: job.status };
    }

    updateProgress(jobId, metrics) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        const { progress, fps, memoryUsage, error } = metrics;

        if (error) {
            job.errors.push({
                timestamp: new Date(),
                message: error
            });
            job.status = 'error';
            this.releaseResources(job.resourceRequirements);
            this.activeJobs--;
            return;
        }

        if (progress < 0 || progress > 100) {
            throw new Error('Invalid progress value');
        }

        job.progress = progress;
        job.stats.framesProcessed += fps || 0;
        job.stats.currentMemoryUsage = memoryUsage || 0;
        job.stats.peakMemoryUsage = Math.max(job.stats.peakMemoryUsage, memoryUsage || 0);

        if (progress === 100) {
            job.status = 'completed';
            job.stats.endTime = new Date();
            job.stats.duration = (job.stats.endTime - job.stats.startTime) / 1000;
            this.releaseResources(job.resourceRequirements);
            this.activeJobs--;
        }
    }

    getJobStatus(jobId) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error('an error occurred');
        }

        const preset = this.presets.get(job.presetId);
        return {
            status: job.status,
            progress: job.progress,
            preset: preset.name,
            stats: job.stats,
            errors: job.errors,
            estimatedTimeRemaining: this.calculateEstimatedTime(job)
        };
    }

    cancelJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error('an error occurred');
        }

        if (job.status === 'completed' || job.status === 'cancelled') {
            throw new Error('an error occurred');
        }

        job.status = 'cancelled';
        job.stats.endTime = new Date();
        job.stats.duration = (job.stats.endTime - job.stats.startTime) / 1000;
        
        if (job.status === 'processing') {
            this.releaseResources(job.resourceRequirements);
            this.activeJobs--;
        }

        return {
            status: job.status,
            progress: job.progress,
            duration: job.stats.duration
        };
    }

    scheduleJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job || job.status !== 'queued') {
            throw new Error('an error occurred');
        }

        if (this.hasAvailableResources(job.resourceRequirements)) {
            job.status = 'processing';
            job.stats.startTime = new Date();
            this.allocateResources(job.resourceRequirements);
            this.activeJobs++;
        }
    }

    calculateResourceProfile({ resolution, bitrate, codec, filters }) {
        const [width, height] = resolution.split('x').map(Number);
        const pixels = width * height;
        
        let profile = {
            cpu: 20 + (pixels / (1920 * 1080)) * 30,
            memory: 15 + (pixels / (1920 * 1080)) * 25,
            gpu: codec.includes('264') || codec.includes('265') ? 40 : 0
        };

        if (filters && filters.length > 0) {
            filters.forEach(filter => {
                profile.cpu += 5;
                profile.memory += 3;
            });
        }

        return profile;
    }

    calculateResourceRequirements(preset, metadata) {
        const baseProfile = preset.resourceProfile;
        const duration = metadata.duration || 0;
        
        return {
            cpu: Math.min(baseProfile.cpu, 100),
            memory: Math.min(baseProfile.memory + (duration > 3600 ? 10 : 0), 100),
            gpu: Math.min(baseProfile.gpu, 100)
        };
    }

    hasAvailableResources(requirements) {
        return this.resources.cpu >= requirements.cpu &&
               this.resources.memory >= requirements.memory &&
               this.resources.gpu >= requirements.gpu;
    }

    allocateResources(requirements) {
        this.resources.cpu -= requirements.cpu;
        this.resources.memory -= requirements.memory;
        this.resources.gpu -= requirements.gpu;
    }

    releaseResources(requirements) {
        this.resources.cpu += requirements.cpu;
        this.resources.memory += requirements.memory;
        this.resources.gpu += requirements.gpu;
    }

    calculateEstimatedTime(job) {
        if (job.progress === 0 || !job.stats.startTime) return null;
        
        const elapsedTime = (Date.now() - job.stats.startTime) / 1000;
        const estimatedTotalTime = (elapsedTime / job.progress) * 100;
        return Math.max(0, estimatedTotalTime - elapsedTime);
    }

    isValidResolution(resolution) {
        const pattern = /^\d+x\d+$/;
        if (!pattern.test(resolution)) return false;
        
        const [width, height] = resolution.split('x').map(Number);
        return width > 0 && height > 0 && width <= 7680 && height <= 4320;
    }

    isValidBitrate(bitrate) {
        return typeof bitrate === 'number' && bitrate > 0 && bitrate <= 200000;
    }

    validateVideoFile(path) {
        return typeof path === 'string' && path.length > 0;
    }
}

module.exports = { VideoTranscoder };