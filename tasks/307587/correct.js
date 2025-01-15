class URLShortener {
    constructor() {
        this.urlDatabase = new Map();
        this.aliasToUrl = new Map();
        this.clickStats = new Map();
        this.customDomains = new Set(["short.ly", "tiny.url"]); // Default domains
    }

    shortenURL(originalURL, options = {}) {
        const {
            customAlias = null,
            expiresIn = null,
            customDomain = "short.ly",
        } = options;

        if (!originalURL || typeof originalURL !== 'string') {
            throw new Error("Invalid URL format");
        }

        if (!this.isValidURL(originalURL)) {
            throw new Error("Invalid URL format");
        }

        if (!this.customDomains.has(customDomain)) {
            throw new Error("Invalid custom domain");
        }

        if (expiresIn !== null && (
            typeof expiresIn !== 'number' || 
            expiresIn <= 0 || 
            !Number.isFinite(expiresIn))) {
            throw new Error("Invalid expiration time");
        }

        // Validate custom alias if provided
        if ('customAlias' in options && !this.isValidAlias(options.customAlias)) {
            throw new Error("Invalid alias format");
        }

        let identifier = customAlias || this.generateHash();

        // Check for collisions in both databases
        if (customAlias && (this.urlDatabase.has(customAlias) || this.aliasToUrl.has(customAlias))) {
            throw new Error("Alias already in use");
        }

        const urlData = {
            originalURL,
            createdAt: Date.now(),
            expiresAt: expiresIn ? Date.now() + expiresIn * 60 * 60 * 1000 : null,
            customDomain,
            clicks: 0,
        };

        if (customAlias) {
            this.aliasToUrl.set(customAlias, urlData);
        } else {
            // Handle hash collisions
            while (this.urlDatabase.has(identifier) || this.aliasToUrl.has(identifier)) {
                identifier = this.generateHash();
            }
            this.urlDatabase.set(identifier, urlData);
        }

        this.clickStats.set(identifier, []);
        return this.getFullShortURL(identifier, customDomain);
    }

    getOriginalUrl(identifier, trackClicks = true) {
        // Determine which database contains the URL
        const database = this.urlDatabase.has(identifier) ? this.urlDatabase : this.aliasToUrl;
        const urlData = database.get(identifier);

        if (!urlData) {
            throw new Error("URL not found");
        }

        if (urlData.expiresAt && urlData.expiresAt < Date.now()) {
            throw new Error("URL has expired");
        }

        if (trackClicks) {
            urlData.clicks++;
            const userAgent = typeof window !== 'undefined' && 
                window && 
                typeof window.navigator === 'object' &&
                window.navigator !== null &&
                window.navigator.userAgent && 
                typeof window.navigator.userAgent === 'string' ? 
                window.navigator.userAgent || 'Unknown' : 
                'Unknown';
            
            // Initialize click history if it doesn't exist
            if (!this.clickStats.has(identifier)) {
                this.clickStats.set(identifier, []);
            }

            this.clickStats.get(identifier).push({
                timestamp: Date.now(),
                userAgent
            });

            database.set(identifier, urlData);
        }

        return urlData.originalURL;
    }

    getUrlStats(identifier) {
        // Determine which database contains the URL
        const database = this.urlDatabase.has(identifier) ? this.urlDatabase : this.aliasToUrl;
        const urlData = database.get(identifier);

        if (!urlData) {
            throw new Error("URL not found");
        }

        if (urlData.expiresAt && urlData.expiresAt < Date.now()) {
            throw new Error("URL has expired");
        }

        const now = Date.now();
        return {
            totalClicks: urlData.clicks,
            clickHistory: this.clickStats.get(identifier) || [],
            createdAt: new Date(urlData.createdAt).toISOString(),
            expiresAt: urlData.expiresAt ? new Date(urlData.expiresAt).toISOString() : null,
            timeElapsed: Math.floor((now - urlData.createdAt) / (60 * 60 * 1000)), // hours
            timeRemaining: urlData.expiresAt ? Math.floor((urlData.expiresAt - now) / (60 * 60 * 1000)) : null,
            customDomain: urlData.customDomain,
        };
    }

    cleanExpiredUrls() {
        const now = Date.now();
        
        // Clean both databases in a single loop
        [this.urlDatabase, this.aliasToUrl].forEach(database => {
            for (const [id, urlData] of database.entries()) {
                if (urlData.expiresAt && urlData.expiresAt < now) {
                    database.delete(id);
                    this.clickStats.delete(id);
                }
            }
        });
    }

    addCustomDomain(domain) {
        if (!this.isValidDomain(domain)) {
            throw new Error("Invalid domain format");
        }
        this.customDomains.add(domain);
    }

    isValidURL(url) {
        try {
            const parsedUrl = new URL(url);
            return ['http:', 'https:'].includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    }

    isValidAlias(alias) {
        if (!alias || typeof alias !== 'string') return false;
        const aliasRegex = /^[a-zA-Z0-9]{4,10}$/;
        return aliasRegex.test(alias);
    }

    isValidDomain(domain) {
        if (!domain || typeof domain !== 'string') return false;
        
        // Check for invalid characters and patterns
        if (domain.includes(' ') || 
            domain.includes('..') || 
            domain.includes('@') || 
            domain.includes('/') || 
            domain.includes(':') || 
            domain.includes('?') || 
            domain.includes('#')) {
            return false;
        }

        // Split into labels
        const labels = domain.split('.');
        if (labels.length < 2) return false;

        // Check each label
        for (const label of labels) {
            // Empty label or too long
            if (!label || label.length > 63 || label.length < 1) return false;
            
            // Check start/end hyphens and invalid characters
            if (label.startsWith('-') || 
                label.endsWith('-') || 
                !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(label)) {
                return false;
            }
        }

        return true;
    }

    generateHash() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let hash = '';
        for (let i = 0; i < 6; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    }

    getFullShortURL(identifier, domain) {
        return `https://${domain}/${identifier}`;
    }
}

module.exports = { URLShortener };