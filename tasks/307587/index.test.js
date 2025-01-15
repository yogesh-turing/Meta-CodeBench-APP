const assert = require('assert');
const { URLShortener } = require('./incorrect');

describe('URLShortener', () => {
    let shortener;
    const testUrl = 'https://www.example.com';

    beforeEach(() => {
        shortener = new URLShortener();
    });

     describe("Click Tracking", () => {
       beforeEach(() => {
         shortener = new URLShortener();
         delete global.window;
       });

       afterEach(() => {
         delete global.window;
       });

       it("should track clicks and provide statistics", () => {
         const shortUrl = shortener.shortenURL(testUrl);
         const identifier = shortUrl.split("/").pop();

         // Access URL multiple times
         shortener.getOriginalUrl(identifier);
         shortener.getOriginalUrl(identifier);
         shortener.getOriginalUrl(identifier);

         const stats = shortener.getUrlStats(identifier);
         assert.strictEqual(stats.totalClicks, 3);
         assert.strictEqual(stats.clickHistory.length, 3);
         assert(stats.createdAt);
         assert.strictEqual(stats.customDomain, "short.ly");
       });

       it("should not track clicks when tracking is disabled", () => {
         const shortUrl = shortener.shortenURL(testUrl);
         const identifier = shortUrl.split("/").pop();

         shortener.getOriginalUrl(identifier, false); // trackClick = false
         const stats = shortener.getUrlStats(identifier);
         assert.strictEqual(stats.totalClicks, 0);
         assert.strictEqual(stats.clickHistory.length, 0);
       });

       it("should handle stats for URLs without expiration", () => {
         const shortUrl = shortener.shortenURL(testUrl);
         const identifier = shortUrl.split("/").pop();

         const stats = shortener.getUrlStats(identifier);
         assert.strictEqual(stats.expiresAt, null);
         assert.strictEqual(stats.timeRemaining, null);
         assert.strictEqual(typeof stats.timeElapsed, "number");
       });

       it("should track clicks with different user agents", () => {
         const shortUrl = shortener.shortenURL(testUrl);
         const identifier = shortUrl.split("/").pop();

         // Test with window.navigator.userAgent
         global.window = { navigator: { userAgent: "Test Browser" } };
         shortener.getOriginalUrl(identifier);

         // Test with window but no navigator
         global.window = {};
         shortener.getOriginalUrl(identifier);

         // Test with window.navigator but no userAgent
         global.window = { navigator: {} };
         shortener.getOriginalUrl(identifier);

         // Test with no window object
         delete global.window;
         shortener.getOriginalUrl(identifier);

         const stats = shortener.getUrlStats(identifier);
         assert.strictEqual(stats.clickHistory[0].userAgent, "Test Browser");
         assert.strictEqual(stats.clickHistory[1].userAgent, "Unknown");
         assert.strictEqual(stats.clickHistory[2].userAgent, "Unknown");
         assert.strictEqual(stats.clickHistory[3].userAgent, "Unknown");
       });

       it("should track clicks for both databases", () => {
         // Create URLs in both databases
         const shortUrl1 = shortener.shortenURL(testUrl);
         const id1 = shortUrl1.split("/").pop();
         const alias = "clicktest";
         shortener.shortenURL("https://another.com", { customAlias: alias });

         // Track clicks for both
         shortener.getOriginalUrl(id1);
         shortener.getOriginalUrl(alias);

         // Verify clicks were tracked
         const stats1 = shortener.getUrlStats(id1);
         const stats2 = shortener.getUrlStats(alias);
         assert.strictEqual(stats1.totalClicks, 1);
         assert.strictEqual(stats2.totalClicks, 1);
       });

       it("should handle database selection correctly", () => {
         // Create a URL in the alias database
         const alias = "dbtest";
         shortener.shortenURL(testUrl, { customAlias: alias });

         // Create a URL in the main database
         const shortUrl = shortener.shortenURL("https://another.com");
         const id = shortUrl.split("/").pop();

         // Track clicks and verify database selection
         shortener.getOriginalUrl(alias);
         shortener.getOriginalUrl(id);

         // Get stats and verify they were stored in correct databases
         const aliasStats = shortener.getUrlStats(alias);
         const urlStats = shortener.getUrlStats(id);

         assert.strictEqual(aliasStats.totalClicks, 1);
         assert.strictEqual(urlStats.totalClicks, 1);
         assert.strictEqual(aliasStats.clickHistory.length, 1);
         assert.strictEqual(urlStats.clickHistory.length, 1);
       });

       it("should handle click tracking edge cases", () => {
         const shortUrl = shortener.shortenURL(testUrl);
         const identifier = shortUrl.split("/").pop();

         // Delete click stats
         shortener.clickStats.delete(identifier);

         const stats = shortener.getUrlStats(identifier);
         assert.deepStrictEqual(stats.clickHistory, []);
         assert.strictEqual(stats.totalClicks, 0);
         assert.strictEqual(typeof stats.createdAt, "string");
         assert.strictEqual(stats.expiresAt, null);
         assert.strictEqual(typeof stats.timeElapsed, "number");
         assert.strictEqual(stats.timeRemaining, null);
         assert.strictEqual(stats.customDomain, "short.ly");

         // Test with missing click stats
         shortener.clickStats.delete(identifier);
         shortener.getOriginalUrl(identifier);
         const statsAfterClick = shortener.getUrlStats(identifier);
         assert.strictEqual(statsAfterClick.clickHistory.length, 1);
         assert.strictEqual(statsAfterClick.totalClicks, 1);

         // Test with existing click history
         shortener.clickStats.set(identifier, [
           {
             timestamp: Date.now(),
             userAgent: "Test Agent",
           },
         ]);
         shortener.getOriginalUrl(identifier);
         const statsAfterSecondClick = shortener.getUrlStats(identifier);
         assert.strictEqual(statsAfterSecondClick.clickHistory.length, 2);
         assert.strictEqual(statsAfterSecondClick.totalClicks, 2);
       });
     });

    describe('Basic URL Shortening', () => {
        beforeEach(() => {
            shortener = new URLShortener();
        });

        it('should shorten valid URLs', () => {
            const shortUrl = shortener.shortenURL(testUrl);
            assert(shortUrl.startsWith('https://short.ly/'));
            assert.strictEqual(shortUrl.length, 'https://short.ly/'.length + 6);
        });

        it('should shorten valid URLs with various protocols', () => {
            // Test different URL formats
            const urls = [
                'https://example.com',
                'http://example.com',
                'https://example.com/path?query=1',
                'http://sub.example.com:8080'
            ];
            
            urls.forEach(url => {
                const shortUrl = shortener.shortenURL(url);
                assert(shortUrl.startsWith('https://short.ly/'));
                const identifier = shortUrl.split('/').pop();
                assert.strictEqual(shortener.getOriginalUrl(identifier), url);
            });
        });

        it('should handle hash collisions', () => {
            // Mock generateHash to always return the same value first
            const originalGenerateHash = shortener.generateHash;
            let hashCallCount = 0;
            shortener.generateHash = () => {
                hashCallCount++;
                return hashCallCount === 1 ? 'abc123' : originalGenerateHash.call(shortener);
            };

            // Create first URL
            const firstUrl = shortener.shortenURL(testUrl);
            assert(firstUrl.includes('abc123'));

            // Create second URL - should handle collision
            const secondUrl = shortener.shortenURL('https://another.com');
            assert(!secondUrl.includes('abc123'));

            // Restore original function
            shortener.generateHash = originalGenerateHash;
        });

        it('should handle multiple hash collisions', () => {
            // Mock generateHash to return same value multiple times
            const originalGenerateHash = shortener.generateHash;
            let hashCallCount = 0;
            shortener.generateHash = () => {
                hashCallCount++;
                return hashCallCount <= 2 ? 'abc123' : originalGenerateHash.call(shortener);
            };

            // Create multiple URLs
            const url1 = shortener.shortenURL(testUrl);
            const url2 = shortener.shortenURL('https://another.com');
            const url3 = shortener.shortenURL('https://third.com');

            assert(url1.includes('abc123'));
            assert(!url2.includes('abc123'));
            assert(!url3.includes('abc123'));

            // Restore original function
            shortener.generateHash = originalGenerateHash;
        });

        it('should handle multiple hash collisions exhaustively', () => {
            // Mock generateHash to return collisions
            const originalGenerateHash = shortener.generateHash;
            let callCount = 0;
            shortener.generateHash = jest.fn(() => {
                callCount++;
                return `hash${callCount}`; // Each call returns a unique hash
            });

            // Create first URL
            const url1 = shortener.shortenURL(testUrl);
            const id1 = url1.split('/').pop();
            assert.strictEqual(id1, 'hash1');

            // Create second URL
            const url2 = shortener.shortenURL('https://another.com');
            const id2 = url2.split('/').pop();
            assert.strictEqual(id2, 'hash2');
            assert(url1 !== url2);

            // Verify generateHash was called exactly twice
            assert.strictEqual(shortener.generateHash.mock.calls.length, 2);

            // Now test collision handling
            shortener.generateHash = jest.fn(() => 'collision');
            const url3 = shortener.shortenURL('https://third.com');
            assert(url3.includes('collision'));

            // Restore original function
            shortener.generateHash = originalGenerateHash;
        });

        it('should handle hash collisions with both databases', () => {
            // First, create a URL with a known hash in urlDatabase
            const originalGenerateHash = shortener.generateHash;
            shortener.generateHash = jest.fn(() => 'collision');
            
            const url1 = shortener.shortenURL(testUrl);
            
            // Then, try to create a custom alias with the same hash
            assert.throws(() => {
                shortener.shortenURL('https://example.com', { customAlias: 'collision' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Restore original function
            shortener.generateHash = originalGenerateHash;
        });

        it('should handle hash collisions with database checks', () => {
            // First, create a URL with a known hash in urlDatabase
            const originalGenerateHash = shortener.generateHash;
            shortener.generateHash = jest.fn(() => 'custom123');
            
            const url1 = shortener.shortenURL(testUrl);
            
            // Then, try to create a custom alias with the same hash
            assert.throws(() => {
                shortener.shortenURL('https://example.com', { customAlias: 'custom123' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Now create an alias that collides with the hash
            shortener.generateHash = jest.fn(() => 'custom123');
            assert.throws(() => {
                shortener.shortenURL('https://example.com', { customAlias: 'custom123' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Restore original function
            shortener.generateHash = originalGenerateHash;
        });

        it('should reject invalid URLs', () => {
            const invalidUrls = [
                '',
                'not-a-url',
                'http://',
                'https://',
                'ftp://invalid',
                null,
                undefined
            ];

            invalidUrls.forEach(url => {
                assert.throws(() => {
                    shortener.shortenURL(url);
                }, error => error instanceof Error && typeof error.message === 'string');
            });
        });

        it('should throw error for invalid URLs', () => {
            assert.throws(() => {
                shortener.shortenURL('not-a-url');
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should throw error for non-existent hash', () => {
            assert.throws(() => {
                shortener.getOriginalUrl('abc123');
            }, error => error instanceof Error && typeof error.message === 'string');
        });
    });

    describe('Custom Alias Support', () => {
        beforeEach(() => {
            shortener = new URLShortener();
        });

        it('should allow custom aliases', () => {
            const alias = 'myblog123';
            const shortUrl = shortener.shortenURL(testUrl, { customAlias: alias });
            assert.strictEqual(shortUrl, `https://short.ly/${alias}`);
            assert.strictEqual(shortener.getOriginalUrl(alias), testUrl);
        });

        it('should reject invalid aliases', () => {
            // Test invalid alias types
            [
                undefined,
                null,
                123,
                true,
                {},
                [],
                () => {},
                Symbol('test'),
                BigInt(123),
                new Date(),
                /regex/,
                new Error(),
                new Map(),
                new Set(),
                new WeakMap(),
                new WeakSet(),
                new ArrayBuffer(8),
                new Int8Array(8),
                new Uint8Array(8),
                new Int16Array(8),
                new Uint16Array(8),
                new Int32Array(8),
                new Uint32Array(8),
                new Float32Array(8),
                new Float64Array(8),
                new BigInt64Array(8),
                new BigUint64Array(8)
            ].forEach(alias => {
                assert.strictEqual(shortener.isValidAlias(alias), false, `Alias ${String(alias)} should be invalid`);
            });

            // Test invalid alias strings
            [
                '',
                ' ',
                'abc',
                'abcdefghijk',
                'custom!',
                'custom@',
                'custom#',
                'custom$',
                'custom%',
                'custom^',
                'custom&',
                'custom*',
                'custom(',
                'custom)',
                'custom-',
                'custom_',
                'custom+',
                'custom=',
                'custom{',
                'custom}',
                'custom[',
                'custom]',
                'custom|',
                'custom\\',
                'custom:',
                'custom;',
                'custom"',
                "custom'",
                'custom<',
                'custom>',
                'custom,',
                'custom.',
                'custom/',
                'custom?',
                'custom~',
                'custom`',
                'custom ',
                ' custom',
                'custom\t',
                '\tcustom',
                'custom\n',
                '\ncustom',
                'custom\r',
                '\rcustom',
                'custom\f',
                '\fcustom',
                'custom\v',
                '\vcustom',
                'custom\u00A0',
                '\u00A0custom',
                'custom\u2028',
                '\u2028custom',
                'custom\u2029',
                '\u2029custom',
                'custom\uFEFF',
                '\uFEFFcustom'
            ].forEach(alias => {
                assert.strictEqual(shortener.isValidAlias(alias), false, `Alias ${alias} should be invalid`);
            });

            // Test valid aliases
            [
                'abcd',
                'abcde',
                'abcdef',
                'abcdefg',
                'abcdefgh',
                'abcdefghi',
                'abcdefghij',
                'ABCD',
                'ABCDE',
                'ABCDEF',
                'ABCDEFG',
                'ABCDEFGH',
                'ABCDEFGHI',
                'ABCDEFGHIJ',
                'aBcD',
                'aBcDe',
                'aBcDeF',
                'aBcDeFg',
                'aBcDeFgH',
                'aBcDeFgHi',
                'aBcDeFgHiJ',
                'a1b2',
                'a1b2c',
                'a1b2c3',
                'a1b2c3d',
                'a1b2c3d4',
                'a1b2c3d4e',
                'a1b2c3d4e5'
            ].forEach(alias => {
                assert.strictEqual(shortener.isValidAlias(alias), true, `Alias ${alias} should be valid`);
            });
        });

        it('should prevent duplicate aliases', () => {
            const alias = 'myblog123';
            shortener.shortenURL(testUrl, { customAlias: alias });
            assert.throws(() => {
                shortener.shortenURL('https://another.com', { customAlias: alias });
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should prevent alias collision with generated hash', () => {
            // First create a URL with generated hash
            const originalGenerateHash = shortener.generateHash;
            shortener.generateHash = () => 'abc123';
            
            const url1 = shortener.shortenURL(testUrl);
            assert(url1.includes('abc123'));

            // Try to create alias with same name
            assert.throws(() => {
                shortener.shortenURL('https://another.com', { customAlias: 'abc123' });
            }, error => error instanceof Error && typeof error.message === 'string');

            shortener.generateHash = originalGenerateHash;
        });

        it('should throw error for invalid custom aliases', () => {
            // Test with invalid custom alias
            assert.throws(() => {
                shortener.shortenURL(testUrl, { customAlias: '!@#' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with too short custom alias
            assert.throws(() => {
                shortener.shortenURL(testUrl, { customAlias: 'abc' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with too long custom alias
            assert.throws(() => {
                shortener.shortenURL(testUrl, { customAlias: 'abcdefghijk' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with non-alphanumeric custom alias
            assert.throws(() => {
                shortener.shortenURL(testUrl, { customAlias: 'test-alias' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with invalid alias types
            [
                undefined,
                null,
                123,
                true,
                {},
                [],
                () => {},
                Symbol('test'),
                BigInt(123),
                new Date(),
                /regex/,
                new Error(),
                new Map(),
                new Set(),
                new WeakMap(),
                new WeakSet(),
                new ArrayBuffer(8),
                new Int8Array(8),
                new Uint8Array(8),
                new Int16Array(8),
                new Uint16Array(8),
                new Int32Array(8),
                new Uint32Array(8),
                new Float32Array(8),
                new Float64Array(8),
                new BigInt64Array(8),
                new BigUint64Array(8)
            ].forEach(alias => {
                assert.throws(() => {
                    shortener.shortenURL(testUrl, { customAlias: alias });
                }, error => error instanceof Error && typeof error.message === 'string');
            });

            // Test with special characters and spaces
            [
                'test!',
                'test@',
                'test#',
                'test$',
                'test%',
                'test^',
                'test&',
                'test*',
                'test(',
                'test)',
                'test-',
                'test_',
                'test+',
                'test=',
                'test{',
                'test}',
                'test[',
                'test]',
                'test|',
                'test\\',
                'test:',
                'test;',
                'test"',
                "test'",
                'test<',
                'test>',
                'test,',
                'test.',
                'test/',
                'test?',
                'test~',
                'test`',
                'test ',
                ' test',
                'test\t',
                '\ttest',
                'test\n',
                '\ntest',
                'test\r',
                '\rtest',
                'test\f',
                '\ftest',
                'test\v',
                '\vtest',
                'test\u00A0',
                '\u00A0test',
                'test\u2028',
                '\u2028test',
                'test\u2029',
                '\u2029test',
                'test\uFEFF',
                '\uFEFFtest'
            ].forEach(alias => {
                assert.throws(() => {
                    shortener.shortenURL(testUrl, { customAlias: alias });
                }, error => error instanceof Error && typeof error.message === 'string');
            });
        });
    });

    describe('URL Expiration', () => {
        beforeEach(() => {
            shortener = new URLShortener();
            // Reset time between tests
            jest.useRealTimers();
        });

        it('should handle URL expiration', async () => {
            const shortUrl = shortener.shortenURL(testUrl, { expiresIn: 0.0001 }); // expires in 0.36 seconds
            const identifier = shortUrl.split('/').pop();
            
            // URL should work initially
            assert.strictEqual(shortener.getOriginalUrl(identifier), testUrl);
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // URL should be expired
            assert.throws(() => {
                shortener.getOriginalUrl(identifier);
            }, error => error instanceof Error && typeof error.message === 'string');

            // Stats should also throw for expired URL
            assert.throws(() => {
                shortener.getUrlStats(identifier);
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should handle stats for expired URLs', async () => {
            const shortUrl = shortener.shortenURL(testUrl, { expiresIn: 0.0001 });
            const identifier = shortUrl.split('/').pop();
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));
            
            assert.throws(() => {
                shortener.getUrlStats(identifier);
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should handle non-existent URLs in stats', () => {
            assert.throws(() => {
                shortener.getUrlStats('nonexistent');
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should clean up expired URLs', async () => {
            const shortUrl1 = shortener.shortenURL(testUrl, { expiresIn: 0.0001 });
            const shortUrl2 = shortener.shortenURL('https://another.com', { expiresIn: 0.0001 });
            const id1 = shortUrl1.split('/').pop();
            const id2 = shortUrl2.split('/').pop();

            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));

            // Force cleanup
            shortener.cleanExpiredUrls();

            // Both URLs should be removed
            assert.throws(() => shortener.getOriginalUrl(id1), error => error instanceof Error && typeof error.message === 'string');
            assert.throws(() => shortener.getOriginalUrl(id2), error => error instanceof Error && typeof error.message === 'string');
        });

        it('should keep non-expired URLs after cleanup', () => {
            const shortUrl1 = shortener.shortenURL(testUrl, { expiresIn: 24 }); // 24 hours
            const shortUrl2 = shortener.shortenURL('https://another.com'); // no expiration
            const id1 = shortUrl1.split('/').pop();
            const id2 = shortUrl2.split('/').pop();

            shortener.cleanExpiredUrls();

            // Both URLs should still work
            assert.strictEqual(shortener.getOriginalUrl(id1), testUrl);
            assert.strictEqual(shortener.getOriginalUrl(id2), 'https://another.com');
        });

        it('should handle expiration for aliased URLs', async () => {
            const alias = 'exptest1';
            shortener.shortenURL(testUrl, { customAlias: alias, expiresIn: 0.0001 });
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));
            
            assert.throws(() => {
                shortener.getOriginalUrl(alias);
            }, error => error instanceof Error && typeof error.message === 'string');
        });

        it('should clean up mixed expired URLs', async () => {
            // Create URLs in both databases
            const alias = 'exptest2';
            const shortUrl1 = shortener.shortenURL(testUrl, { expiresIn: 0.0001 });
            const shortUrl2 = shortener.shortenURL('https://another.com', { customAlias: alias, expiresIn: 0.0001 });
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));
            
            shortener.cleanExpiredUrls();
            
            // Both should be cleaned up
            assert.throws(() => shortener.getOriginalUrl(shortUrl1.split('/').pop()), error => error instanceof Error && typeof error.message === 'string');
            assert.throws(() => shortener.getOriginalUrl(alias), error => error instanceof Error && typeof error.message === 'string');
        });

        it('should handle all expiration scenarios', async () => {
            // Test with null expiration (should work)
            const shortUrl1 = shortener.shortenURL(testUrl, { expiresIn: null });
            assert(shortUrl1.startsWith('https://short.ly/'));

            // Test with undefined expiration (should work)
            const shortUrl2 = shortener.shortenURL(testUrl, {});
            assert(shortUrl2.startsWith('https://short.ly/'));

            // Test with 0 expiration
            assert.throws(() => {
                shortener.shortenURL(testUrl, { expiresIn: 0 });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with negative expiration
            assert.throws(() => {
                shortener.shortenURL(testUrl, { expiresIn: -1 });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with non-number expiration
            assert.throws(() => {
                shortener.shortenURL(testUrl, { expiresIn: '1' });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with NaN expiration
            assert.throws(() => {
                shortener.shortenURL(testUrl, { expiresIn: NaN });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with Infinity expiration
            assert.throws(() => {
                shortener.shortenURL(testUrl, { expiresIn: Infinity });
            }, error => error instanceof Error && typeof error.message === 'string');

            // Test with very short expiration
            const shortUrl = shortener.shortenURL(testUrl, { expiresIn: 0.0001 });
            const identifier = shortUrl.split('/').pop();
            
            // Should work immediately
            assert.strictEqual(shortener.getOriginalUrl(identifier), testUrl);
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Should fail after expiration
            assert.throws(() => {
                shortener.getOriginalUrl(identifier);
            }, error => error instanceof Error && typeof error.message === 'string');
        });
    });

   
    describe('Custom Domains', () => {
        beforeEach(() => {
            shortener = new URLShortener();
        });

        it('should validate domains comprehensively', () => {
            const validDomains = [
                'example.com',
                'sub.example.com',
                'sub-domain.example.com',
                'example-domain.com',
                'example.co.uk',
                'example.io',
                'example.app',
                'short.ly',
                'tiny.url',
                'domain--test.com',
                'domain-test.com',
                'sub.sub.domain.com',
                'a-b-c-d.com',
                'test-1-2-3.com',
                'xn--test.com',
                '123domain.com',
                'domain123.com',
                'do1ma2in3.com'
            ];

            validDomains.forEach(domain => {
                assert.strictEqual(shortener.isValidDomain(domain), true, `Domain ${domain} should be valid`);
                assert.doesNotThrow(() => {
                    shortener.addCustomDomain(domain);
                });
            });
        });

        it('should handle domain validation edge cases', () => {
            // Test with invalid domain patterns
            const invalidPatterns = [
                // Non-string values
                null,
                undefined,
                42,
                true,
                {},
                [],
                () => {},
                Symbol('test'),
                BigInt(123),
                new Date(),
                /domain/,
                new Error(),
                new Map(),
                new Set(),
                () => {},
                Promise.resolve(),
                
                // Invalid string formats
                '',
                ' ',
                '..',
                'a',
                'a.',
                '.a',
                'a.b',
                'a..b',
                '.domain.com',
                'domain.com.',
                '-domain.com',
                'domain-.com',
                'domain.com-',
                'domain.-com',
                'domain.com/path',
                'domain.com:8080',
                'domain.com?query',
                'domain.com#hash',
                'domain.com@email',
                'domain.com space',
                'space domain.com',
                'dom ain.com',
                'domain.c',
                'a'.repeat(64) + '.com',
                'domain.a'.repeat(64),
                '*.domain.com',    // Wildcard
                'sub_domain.com',          // Underscore
                'sub domain.com',          // Space
                'sub\u0000domain.com',     // Null character
                'sub\u200Bdomain.com',     // Zero-width space
                'sub\u3000domain.com',     // Ideographic space
                'sub\u0009domain.com',     // Tab
                'sub\u000Adomain.com',     // Line feed
                'sub\u000Ddomain.com',     // Carriage return
                'sub\u0085domain.com',     // Next line
                'sub\u2028domain.com',     // Line separator
                'sub\u2029domain.com',     // Paragraph separator
                'sub\uFEFFdomain.com',     // Byte order mark
                'sub\u0020domain.com',     // Space
                'sub\u00A0domain.com',     // Non-breaking space
                'sub\u1680domain.com',     // Ogham space mark
                'sub\u180Edomain.com',     // Mongolian vowel separator
                'sub\u2000domain.com',     // En quad
                'sub\u2001domain.com',     // Em quad
                'sub\u2002domain.com',     // En space
                'sub\u2003domain.com',     // Em space
                'sub\u2004domain.com',     // Three-per-em space
                'sub\u2005domain.com',     // Four-per-em space
                'sub\u2006domain.com',     // Six-per-em space
                'sub\u2007domain.com',     // Figure space
                'sub\u2008domain.com',     // Punctuation space
                'sub\u2009domain.com',     // Thin space
                'sub\u202Fdomain.com',     // Narrow no-break space
                'sub\u205Fdomain.com',     // Medium mathematical space
                'sub\u3000domain.com'      // Ideographic space
            ];

            invalidPatterns.forEach(domain => {
                assert.strictEqual(shortener.isValidDomain(domain), false, `Domain ${String(domain)} should be invalid`);
                assert.throws(() => {
                    shortener.addCustomDomain(domain);
                }, error => error instanceof Error && typeof error.message === 'string');
            });
        });

        it('should allow using custom domains', () => {
            const shortUrl = shortener.shortenURL(testUrl, { customDomain: 'tiny.url' });
            assert(shortUrl.startsWith('https://tiny.url/'));
        });

        it('should allow adding new custom domains', () => {
            shortener.addCustomDomain('example.com');
            const shortUrl = shortener.shortenURL(testUrl, { customDomain: 'example.com' });
            assert(shortUrl.startsWith('https://example.com/'));
        });

        it('should reject invalid domains', () => {
            assert.throws(() => {
                shortener.shortenURL(testUrl, { customDomain: 'invalid domain' });
            }, error => error instanceof Error && typeof error.message === 'string');
        });
    });

    describe('URL Validation', () => {
        beforeEach(() => {
            shortener = new URLShortener();
        });

        it('should validate URLs exhaustively', () => {
            // Test invalid URL types
            [
                undefined,
                null,
                123,
                true,
                {},
                [],
                () => {},
                Symbol('test'),
                BigInt(123),
                new Date(),
                /regex/,
                new Error(),
                new Map(),
                new Set(),
                new WeakMap(),
                new WeakSet(),
                new ArrayBuffer(8),
                new Int8Array(8),
                new Uint8Array(8),
                new Int16Array(8),
                new Uint16Array(8),
                new Int32Array(8),
                new Uint32Array(8),
                new Float32Array(8),
                new Float64Array(8),
                new BigInt64Array(8),
                new BigUint64Array(8)
            ].forEach(url => {
                assert.strictEqual(shortener.isValidURL(url), false, `URL ${String(url)} should be invalid`);
            });

            // Test invalid URL strings
            [
                '',
                ' ',
                'not a url',
                'ftp://example.com',
                'gopher://example.com',
                'ws://example.com',
                'wss://example.com',
                'file://example.com',
                'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
                'mailto:test@example.com',
                'tel:+1234567890',
                'sms:+1234567890',
                'geo:37.786971,-122.399677',
                'market://details?id=com.example.app',
                'intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end',
                'whatsapp://send?text=Hello',
                'fb://profile/33138223345',
                'twitter://user?screen_name=example',
                'skype:echo123?call',
                'spotify:track:2TpxZ7JUBn3uw46aR7qd6V',
                'slack://channel?team=T123456&id=C123456',
                'discord://invite/abcdef',
                'steam://rungame/440',
                'git://github.com/user/repo.git',
                'svn://example.com/repo',
                'magnet:?xt=urn:btih:123456',
                'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
                'ethereum:0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
                'ipfs:/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
                'dat://example.com',
                'ssb://@FCX/tsDLpubCPKKfIrw4gc+SQkHcaD17s7GI6i/ziWY=.ed25519',
                'irc://irc.example.com/channel',
                'feed://example.com/feed.xml',
                'webcal://example.com/calendar.ics',
                'news:comp.infosystems.www.servers.unix',
                'nntp://news.example.com/comp.infosystems.www.servers.unix',
                'ldap://ldap.example.com/dc=example,dc=com',
                'telnet://example.com',
                'ssh://user@example.com',
                'sftp://example.com',
                'rtsp://example.com/stream',
                'rtmp://example.com/live/stream',
                'udp://example.com:1234',
                'tcp://example.com:1234',
                'dns://example.com',
                'chrome://settings',
                'about:blank',
                'javascript:alert(1)',
                'vbscript:alert(1)',
                'data:,Hello%2C%20World!',
                'view-source:http://example.com',
                'jar:file:///path/to/jar!/path/inside/jar',
                'resource://path/to/resource',
                'chrome-extension://extension-id',
                'moz-extension://extension-id',
                'ms-settings:windows-update',
                'ms-word:ofe|u|http://example.com/doc.docx'
            ].forEach(url => {
                assert.strictEqual(shortener.isValidURL(url), false, `URL ${url} should be invalid`);
            });

            // Test valid URLs
            [
                'http://example.com',
                'https://example.com',
                'http://sub.example.com',
                'https://sub.example.com',
                'http://example.com/path',
                'https://example.com/path',
                'http://example.com/path?query=value',
                'https://example.com/path?query=value',
                'http://example.com/path#fragment',
                'https://example.com/path#fragment',
                'http://example.com:8080',
                'https://example.com:8443',
                'http://user:pass@example.com',
                'https://user:pass@example.com',
                'http://127.0.0.1',
                'https://127.0.0.1',
                'http://localhost',
                'https://localhost',
                'http://[::1]',
                'https://[::1]',
                'http://example.com/path/to/resource.html',
                'https://example.com/path/to/resource.html',
                'http://example.com/path/to/resource.html?query=value&another=value',
                'https://example.com/path/to/resource.html?query=value&another=value',
                'http://example.com/path/to/resource.html#section',
                'https://example.com/path/to/resource.html#section',
                'http://example.com/path/to/resource.html?query=value#section',
                'https://example.com/path/to/resource.html?query=value#section'
            ].forEach(url => {
                assert.strictEqual(shortener.isValidURL(url), true, `URL ${url} should be valid`);
            });
        });
    });

    describe('URL Stats', () => {
        beforeEach(() => {
            shortener = new URLShortener();
        });

        it('should handle click stats with missing data', () => {
            const shortUrl = shortener.shortenURL(testUrl);
            const identifier = shortUrl.split('/').pop();

            // Delete click stats
            shortener.clickStats.delete(identifier);

            // Get stats should still work
            const stats = shortener.getUrlStats(identifier);
            assert.deepStrictEqual(stats.clickHistory, []);
            assert.strictEqual(stats.totalClicks, 0);
            assert.strictEqual(typeof stats.createdAt, 'string');
            assert.strictEqual(stats.expiresAt, null);
            assert.strictEqual(typeof stats.timeElapsed, 'number');
            assert.strictEqual(stats.timeRemaining, null);
            assert.strictEqual(stats.customDomain, 'short.ly');
        });

        it('should handle all stats fields correctly', () => {
            const expiresIn = 1; // 1 hour
            const shortUrl = shortener.shortenURL(testUrl, { expiresIn });
            const identifier = shortUrl.split('/').pop();

            // Get stats immediately
            const stats = shortener.getUrlStats(identifier);
            
            // Verify all fields
            assert.strictEqual(stats.totalClicks, 0);
            assert.deepStrictEqual(stats.clickHistory, []);
            assert(stats.createdAt.endsWith('Z')); // ISO string ends with Z
            assert(stats.expiresAt.endsWith('Z')); // ISO string ends with Z
            assert.strictEqual(stats.timeElapsed, 0);
            assert(stats.timeRemaining >= 0 && stats.timeRemaining <= 1, 'Time remaining should be between 0 and 1 hour');
            assert.strictEqual(stats.customDomain, 'short.ly');
        });
    });
});