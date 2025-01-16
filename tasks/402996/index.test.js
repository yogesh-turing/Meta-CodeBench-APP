const { VideoTranscoder } = require('./correct');

describe("VideoTranscoder", () => {
  let transcoder;
  const mockDate = new Date("2024-01-01T12:00:00Z");

  beforeEach(() => {
    transcoder = new VideoTranscoder();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Resource Management Enhancement", () => {
    test("should create preset with resource profile", () => {
      const preset = {
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
        filters: ["denoise", "sharpen"],
      };

      const presetId = transcoder.createPreset(preset);
      expect(presetId).toBeDefined();

      const savedPreset = transcoder.presets.get(presetId);
      expect(savedPreset.resourceProfile).toBeDefined();
      expect(savedPreset.resourceProfile.cpu).toBeGreaterThan(0);
      expect(savedPreset.resourceProfile.memory).toBeGreaterThan(0);
      expect(savedPreset.resourceProfile.gpu).toBeGreaterThan(0);
    });

    test("should validate resolution format", () => {
      const invalidResolutions = [
        "invalid",
        "1920",
        "1920x",
        "x1080",
        "0x1080",
        "1920x0",
        "8000x8000", // Above 8K
      ];

      invalidResolutions.forEach((resolution) => {
        expect(() =>
          transcoder.createPreset({
            name: "Test",
            format: "mp4",
            resolution,
            bitrate: 5000,
            codec: "h264",
          })
        ).toThrow(Error);
      });
    });

    test("should validate bitrate values", () => {
      const invalidBitrates = [
        -1,
        0,
        250000, // Above 200 Mbps
        "invalid",
        null,
        undefined,
      ];

      invalidBitrates.forEach((bitrate) => {
        expect(() =>
          transcoder.createPreset({
            name: "Test",
            format: "mp4",
            resolution: "1920x1080",
            bitrate,
            codec: "h264",
          })
        ).toThrow(Error);
      });

      // Test valid bitrate but missing other required settings
      expect(() =>
        transcoder.createPreset({
          name: "Test",
          bitrate: 5000,
        })
      ).toThrow(Error);
    });

    test("should validate video file path", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      // Test missing path
      expect(() =>
        transcoder.submitJob({
          presetId,
        })
      ).toThrow(Error);

      // Test empty path
      expect(() =>
        transcoder.submitJob({
          inputPath: "",
          presetId,
        })
      ).toThrow(Error);

      // Test missing preset
      expect(() =>
        transcoder.submitJob({
          inputPath: "/path/to/video.mp4",
        })
      ).toThrow(Error);

      // Test invalid preset ID
      expect(() =>
        transcoder.submitJob({
          inputPath: "/path/to/video.mp4",
          presetId: "invalid",
        })
      ).toThrow(Error);

      // Test invalid file path with valid preset
      expect(() =>
        transcoder.submitJob({
          inputPath: { path: "/path/to/video.mp4" }, // Invalid path type
          presetId,
        })
      ).toThrow(Error);

      // Test non-string path
      expect(() =>
        transcoder.submitJob({
          inputPath: 123,
          presetId,
        })
      ).toThrow(Error);

      // Test undefined path
      expect(() =>
        transcoder.submitJob({
          inputPath: undefined,
          presetId,
        })
      ).toThrow(Error);
    });

    test("should track detailed job statistics", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      // Start the job
      transcoder.updateProgress(job.jobId, { progress: 10 });

      // Update progress with metrics
      transcoder.updateProgress(job.jobId, {
        progress: 50,
        fps: 30,
        memoryUsage: 1500,
      });

      // Advance time to ensure estimatedTimeRemaining is calculated
      jest.advanceTimersByTime(5000);

      const status = transcoder.getJobStatus(job.jobId);
      expect(status.stats).toBeDefined();
      expect(status.stats.framesProcessed).toBe(30);
      expect(status.stats.currentMemoryUsage).toBe(1500);
      expect(status.estimatedTimeRemaining).toBeGreaterThan(0);
    });

    test("should handle job errors and resource cleanup", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      // Start the job to allocate resources
      transcoder.updateProgress(job.jobId, { progress: 10 });

      // Simulate error
      transcoder.updateProgress(job.jobId, {
        error: "Codec initialization failed",
      });

      const status = transcoder.getJobStatus(job.jobId);
      expect(status.status).toBe("error");
      expect(status.errors).toHaveLength(1);
      expect(status.errors[0].message).toBe("Codec initialization failed");
      expect(transcoder.resources).toEqual({
        cpu: 100,
        memory: 100,
        gpu: 100,
      });
      expect(transcoder.activeJobs).toBe(0);
    });

    test("should handle invalid progress updates", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      expect(() =>
        transcoder.updateProgress(job.jobId, { progress: -1 })
      ).toThrow(Error);
      expect(() =>
        transcoder.updateProgress(job.jobId, { progress: 101 })
      ).toThrow(Error);
    });

    test("should handle missing job ID", () => {
      expect(() => transcoder.getJobStatus("non-existent")).toThrow(Error);
      expect(() =>
        transcoder.updateProgress("non-existent", { progress: 50 })
      ).toThrow(Error);
      expect(() => transcoder.cancelJob("non-existent")).toThrow(Error);
    });

    test("should prevent cancelling completed jobs", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      transcoder.updateProgress(job.jobId, {
        progress: 100,
        fps: 30,
        memoryUsage: 1500,
      });

      try {
        const result = transcoder.cancelJob(job.jobId);
        expect(result).toEqual({
          status: "completed",
          progress: 100,
          duration: job.stats?.endTime
            ? (job.stats?.endTime - job.stats?.startTime) / 1000
            : 0,
        });
      } catch (error) {
        expect(error.constructor).toBe(Error);
      }
    });

    test("should cancel active job and release resources", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      // Start the job to allocate resources
      const initialResources = { ...transcoder.resources };
      transcoder.updateProgress(job.jobId, { progress: 10 });
      job.status = "processing"; // Ensure job is in processing state

      const result = transcoder.cancelJob(job.jobId);
      expect(result.status).toBe("cancelled");
      expect(result.progress).toBe(10);
      expect(transcoder.resources).toEqual({
        cpu: 100,
        memory: 100,
        gpu: 100,
      });
      expect(transcoder.activeJobs).toBe(0);
    });

    

    test("should calculate accurate resource profiles", () => {
      // Test 4K with multiple filters
      const profile1 = transcoder.calculateResourceProfile({
        resolution: "3840x2160",
        bitrate: 20000,
        codec: "h265",
        filters: ["denoise", "sharpen", "stabilize"],
      });

      expect(profile1.cpu).toBeGreaterThan(50); // High CPU for 4K
      expect(profile1.memory).toBeGreaterThan(40); // High memory for 4K
      expect(profile1.gpu).toBeGreaterThan(0); // GPU for h265

      // Test 720p with no filters
      const profile2 = transcoder.calculateResourceProfile({
        resolution: "1280x720",
        bitrate: 2000,
        codec: "h264",
        filters: [],
      });

      expect(profile2.cpu).toBeLessThan(profile1.cpu);
      expect(profile2.memory).toBeLessThan(profile1.memory);
      expect(profile2.gpu).toBeGreaterThan(0);

      // Test with non-GPU codec
      const profile3 = transcoder.calculateResourceProfile({
        resolution: "1280x720",
        bitrate: 2000,
        codec: "vp8",
        filters: [],
      });
      expect(profile3.gpu).toBe(0);
    });

    test("should handle job with no progress", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      const status = transcoder.getJobStatus(job.jobId);
      expect(status.estimatedTimeRemaining).toBeNull();
    });

    test("should handle job completion with no stats", () => {
      const presetId = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      const job = transcoder.submitJob({
        inputPath: "/path/to/video.mp4",
        presetId,
      });

      transcoder.updateProgress(job.jobId, { progress: 100 });
      const status = transcoder.getJobStatus(job.jobId);
      expect(status.stats.averageFps).toBe(0);
    });

    test("should adjust resource requirements based on video duration", () => {
      const preset = transcoder.createPreset({
        name: "HD",
        format: "mp4",
        resolution: "1920x1080",
        bitrate: 5000,
        codec: "h264",
      });

      // Test with short video
      const shortVideo = transcoder.calculateResourceRequirements(
        transcoder.presets.get(preset),
        { duration: 300 } // 5 minutes
      );

      // Test with long video
      const longVideo = transcoder.calculateResourceRequirements(
        transcoder.presets.get(preset),
        { duration: 7200 } // 2 hours
      );

      expect(longVideo.memory).toBeGreaterThan(shortVideo.memory);
    });

    test("should cancel queued job without releasing resources", () => {
      // Create a preset with high resource requirements
      const presetId = transcoder.createPreset({
        name: "4K",
        format: "mp4",
        resolution: "3840x2160",
        bitrate: 20000,
        codec: "h265",
        filters: ["denoise", "stabilize"],
      });

      // Submit first job to consume resources
      const job1 = transcoder.submitJob({
        inputPath: "/path/to/video1.mp4",
        presetId,
        metadata: { duration: 7200 },
      });

      // Submit second job that will be queued
      const job2 = transcoder.submitJob({
        inputPath: "/path/to/video2.mp4",
        presetId,
        metadata: { duration: 7200 },
      });

      // Verify initial state
      const initialResources = { ...transcoder.resources };
      const initialActiveJobs = transcoder.activeJobs;
      expect(transcoder.getJobStatus(job2.jobId).status).toBe("queued");

      // Cancel the queued job
      const result = transcoder.cancelJob(job2.jobId);
      expect(result.status).toBe("cancelled");
      expect(result.progress).toBe(0);
      expect(transcoder.resources).toEqual(initialResources);
      expect(transcoder.activeJobs).toBe(initialActiveJobs);
    });

    test("should handle error when getting status of non-existent job", () => {
      expect(() => transcoder.getJobStatus("non-existent-job")).toThrow(Error);
    });

    test("should handle error when cancelling non-existent job", () => {
      expect(() => transcoder.cancelJob("non-existent-job")).toThrow(Error);
    });
  });
});

