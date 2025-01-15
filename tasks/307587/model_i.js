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
        trackingEnabled = true,
      } = options;
  
      if (!this.isValidURL(originalURL)) {
        throw new Error("Invalid URL format");
      }
  
      if (!this.customDomains.has(customDomain)) {
        throw new Error("Invalid custom domain");
      }
  
      const identifier = customAlias || this.generateHash();
      const urlData = {
        originalURL,
        createdAt: Date.now(),
        expiresAt: expiresIn ? Date.now() + expiresIn * 60 * 60 * 1000 : null,
        customDomain,
        clicks: 0,
      };
  
      if (customAlias) {
        if (!this.isValidAlias(customAlias)) {
          throw new Error(
            "Invalid alias format. Use alphanumeric characters only, length 4-10"
          );
        }
        if (
          this.aliasToUrl.has(customAlias) ||
          this.urlDatabase.has(customAlias)
        ) {
          throw new Error("Alias already in use");
        }
        this.aliasToUrl.set(customAlias, urlData);
      } else {
        while (
          this.urlDatabase.has(identifier) ||
          this.aliasToUrl.has(identifier)
        ) {
          identifier = this.generateHash();
        }
        this.urlDatabase.set(identifier, urlData);
      }
  
      if (trackingEnabled) {
        this.clickStats.set(identifier, []);
      }
      return this.getFullShortURL(identifier, customDomain);
    }
  
    getOriginalUrl(identifier) {
      if (this.aliasToUrl.has(identifier)) {
        const urlData = this.aliasToUrl.get(identifier);
        if (urlData.expiresAt && Date.now() > urlData.expiresAt) {
          throw new Error("URL has expired");
        }
        return urlData.originalURL;
      } else if (this.urlDatabase.has(identifier)) {
        const urlData = this.urlDatabase.get(identifier);
        if (urlData.expiresAt && Date.now() > urlData.expiresAt) {
          throw new Error("URL has expired");
        }
        return urlData.originalURL;
      } else {
        throw new Error("URL not found");
      }
    }
  
    getUrlStats(identifier) {
      if (this.aliasToUrl.has(identifier)) {
        const urlData = this.aliasToUrl.get(identifier);
        if (urlData.expiresAt && Date.now() > urlData.expiresAt) {
          throw new Error("URL has expired");
        }
        return this.generateStats(identifier, urlData);
      } else if (this.urlDatabase.has(identifier)) {
        const urlData = this.urlDatabase.get(identifier);
        if (urlData.expiresAt && Date.now() > urlData.expiresAt) {
          throw new Error("URL has expired");
        }
        return this.generateStats(identifier, urlData);
      } else {
        throw new Error("URL not found");
      }
    }
  
    generateStats(identifier, urlData) {
      const clickHistory = this.clickStats.get(identifier) || [];
      const totalClicks = clickHistory.length;
      const timeElapsed = Math.floor((Date.now() - urlData.createdAt) / 3600000);
      const timeRemaining =
        urlData.expiresAt && urlData.expiresAt - Date.now() > 0
          ? Math.floor((urlData.expiresAt - Date.now()) / 3600000)
          : null;
  
      return {
        totalClicks,
        clickHistory,
        createdAt: new Date(urlData.createdAt).toISOString(),
        expiresAt: urlData.expiresAt ? new Date(urlData.expiresAt).toISOString() : null,
        timeElapsed,
        timeRemaining,
        customDomain: urlData.customDomain,
      };
    }
  
    trackClick(identifier, userAgent) {
      if (this.clickStats.has(identifier)) {
        const clickHistory = this.clickStats.get(identifier);
        clickHistory.push({
          timestamp: Date.now(),
          userAgent,
        });
        this.clickStats.set(identifier, clickHistory);
      }
    }
  
    addCustomDomain(domain) {
      if (!this.isValidDomain(domain)) {
        throw new Error("Invalid domain format");
      }
      this.customDomains.add(domain);
    }
  
    removeUrl(identifier) {
      this.urlDatabase.delete(identifier);
      this.aliasToUrl.delete(identifier);
      this.clickStats.delete(identifier);
    }
  
    isValidURL(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  
    isValidAlias(alias) {
      const aliasRegex = /^[a-zA-Z0-9]{4,10}$/;
      return aliasRegex.test(alias);
    }
  
    isValidDomain(domain) {
      const domainRegex =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return domainRegex.test(domain);
    }
  
    generateHash() {
      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let hash = "";
      for (let i = 0; i < 6; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return hash;
    }
  
    getFullShortURL(identifier, domain) {
      return `https://${domain}/${identifier}`;
    }
  }
  
  module.exports = { URLShortener };
  