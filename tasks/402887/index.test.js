const ProductRecommender = require(process.env.TARGET_FILE);

describe('ProductRecommender', () => {
    const mockProducts = [
        {
            id: 1,
            name: "Summer Beach Sunglasses",
            category: "sunglasses",
            brand: "SunMaster",
            price: 80,
            style: ["casual", "summer", "sporty"],
            rating: 4.5,
            reviewCount: 850,
            inStock: true
        },
        {
            id: 2,
            name: "Winter Wool Coat",
            category: "coat",
            brand: "WinterWear",
            price: 200,
            style: ["formal", "winter", "classic"],
            rating: 4.8,
            reviewCount: 1200,
            inStock: true
        },
        {
            id: 3,
            name: "Classic Leather Boots",
            category: "boots",
            brand: "FootStyle",
            price: 150,
            style: ["casual", "winter", "classic"],
            rating: 4.2,
            reviewCount: 600,
            inStock: false
        }
    ];

    const mockPreferences = {
        favoriteCategories: ["sunglasses", "boots"],
        preferredBrands: ["SunMaster", "FootStyle"],
        stylePreferences: ["casual", "classic"]
    };

    let recommender;

    beforeEach(() => {
        recommender = new ProductRecommender(mockProducts, mockPreferences);
    });

    describe('calculateSeasonalScore', () => {
        it('should return 0.2 for seasonal items', () => {
            const score = recommender.calculateSeasonalScore(mockProducts[0], 'SUMMER');
            expect(score).toBe(0.2);
        });

        it('should return 0 for non-seasonal items', () => {
            const score = recommender.calculateSeasonalScore(mockProducts[0], 'WINTER');
            expect(score).toBe(0);
        });

        it('should handle invalid season gracefully', () => {
            const score = recommender.calculateSeasonalScore(mockProducts[0], 'INVALID_SEASON');
            expect(score).toBe(0);
        });
    });

    describe('calculatePriceScore', () => {
        it('should return 0 if price is above budget', () => {
            const score = recommender.calculatePriceScore(mockProducts[1], 150);
            expect(score).toBe(0);
        });

        it('should return score between 0 and 0.3 for items within budget', () => {
            const score = recommender.calculatePriceScore(mockProducts[0], 100);
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(0.3);
        });
    });

    describe('calculatePreferenceScore', () => {
        it('should calculate correct preference score', () => {
            const score = recommender.calculatePreferenceScore(mockProducts[0], mockPreferences);
            expect(score).toBeCloseTo(0.4);
        });

        it('should handle empty style preferences', () => {
            const prefsWithEmptyStyles = {
                ...mockPreferences,
                stylePreferences: []
            };
            const score = recommender.calculatePreferenceScore(mockProducts[0], prefsWithEmptyStyles);
            expect(score).toBeCloseTo(0.3);
        });

        it('should handle no matching styles', () => {
            const prefsWithDifferentStyles = {
                ...mockPreferences,
                stylePreferences: ['formal', 'business']
            };
            const score = recommender.calculatePreferenceScore(mockProducts[0], prefsWithDifferentStyles);
            expect(score).toBeCloseTo(0.3); // Only category and brand matches, no style match
        });
    });

    describe('calculatePopularityScore', () => {
        it('should calculate correct popularity score for high-rated product', () => {
            const score = recommender.calculatePopularityScore(mockProducts[1]);
            expect(score).toBeCloseTo(0.195);
        });

        it('should calculate correct popularity score for minimum rated product', () => {
            const minProduct = {
                ...mockProducts[0],
                rating: 1.0,
                reviewCount: 0
            };
            const score = recommender.calculatePopularityScore(minProduct);
            expect(score).toBe(0);
        });

        it('should handle very high review count correctly', () => {
            const highReviewProduct = {
                ...mockProducts[0],
                rating: 5.0,
                reviewCount: 5000
            };
            const score = recommender.calculatePopularityScore(highReviewProduct);
            expect(score).toBeCloseTo(0.2);
        });
    });

    describe('calculateRecommendationScore', () => {
        let recommender;

        beforeEach(() => {
            recommender = new ProductRecommender(mockProducts, mockPreferences);
        });

        it('should calculate total score correctly for seasonal item', () => {
            const score = recommender.calculateRecommendationScore(mockProducts[0], 'SUMMER', 300);
            // Summer sunglasses should get seasonal boost
            expect(score).toBeGreaterThan(0.2);
        });

        it('should calculate total score correctly for non-seasonal item', () => {
            const score = recommender.calculateRecommendationScore(mockProducts[1], 'SUMMER', 300);
            // Winter coat in summer should not get seasonal boost
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });

        it('should handle invalid product gracefully', () => {
            const invalidProduct = {
                category: 'test',
                name: 'test',
                price: 100,
                inStock: true,
                rating: 4.0,
                reviewCount: 500,
                style: []
            };
            const score = recommender.calculateRecommendationScore(invalidProduct, 'SUMMER', 300);
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(1);
        });
        
        it('should handle null product', () => {
            const score = recommender.calculateRecommendationScore(null, 'SUMMER', 300);
            expect(score).toBe(0);
        });
        
        it('should handle empty product', () => {
            const invalidProduct = {};
            const score = recommender.calculateRecommendationScore(invalidProduct, 'SUMMER', 300);
            expect(score).toBe(0);
        });

    });

    describe('isValidProduct', () => {
        let recommender;

        beforeEach(() => {
            recommender = new ProductRecommender(mockProducts, mockPreferences);
        });

        it('should return false for null/undefined product', () => {
            expect(recommender.isValidProduct(null, 100)).toBe(false);
            expect(recommender.isValidProduct(undefined, 100)).toBe(false);
        });

        it('should return false for product with non-numeric price', () => {
            const product = { price: '100', inStock: true };
            expect(recommender.isValidProduct(product, 100)).toBe(false);
        });

        it('should return false for product with price above maxPrice', () => {
            const product = { price: 150, inStock: true };
            expect(recommender.isValidProduct(product, 100)).toBe(false);
        });

        it('should return false for out-of-stock product', () => {
            const product = { price: 50, inStock: false };
            expect(recommender.isValidProduct(product, 100)).toBe(false);
        });

        it('should return false for product with undefined inStock', () => {
            const product = { price: 50 };
            expect(recommender.isValidProduct(product, 100)).toBe(false);
        });

        it('should return true for valid product', () => {
            const product = { price: 50, inStock: true };
            expect(recommender.isValidProduct(product, 100)).toBe(true);
        });

        it('should return true for product at exact price limit', () => {
            const product = { price: 100, inStock: true };
            expect(recommender.isValidProduct(product, 100)).toBe(true);
        });
    });

    describe('getRecommendations', () => {
        it('should return correct number of recommendations', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 300, 2);
            expect(recommendations).toHaveLength(2);
        });

        it('should only return in-stock items', () => {
            const recommendations = recommender.getRecommendations('WINTER', 300, 3);
            const allInStock = recommendations.every(rec => rec.inStock);
            expect(allInStock).toBe(true);
        });

        it('should respect price limit', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 100, 5);
            const allWithinBudget = recommendations.every(rec => rec.price <= 100);
            expect(allWithinBudget).toBe(true);
        });

        it('should include recommendation scores', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 300, 1);
            expect(recommendations[0]).toHaveProperty('recommendationScore');
            expect(typeof recommendations[0].recommendationScore).toBe('number');
        });

        it('should handle empty result when no products match criteria', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 10, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should filter out both out-of-stock and over-budget items', () => {
            const testProducts = [
                { ...mockProducts[0], inStock: false, price: 50 },
                { ...mockProducts[1], inStock: true, price: 200 },
                { ...mockProducts[2], inStock: false, price: 200 }
            ];
            const testRecommender = new ProductRecommender(testProducts, mockPreferences);
            const recommendations = testRecommender.getRecommendations('SUMMER', 100, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should handle all filter combinations', () => {
            const testProducts = [
                { ...mockProducts[0], inStock: true, price: 50 },   // Should pass both filters
                { ...mockProducts[0], inStock: false, price: 50 },  // Fails inStock check
                { ...mockProducts[0], inStock: true, price: 150 },  // Fails price check
                { ...mockProducts[0], inStock: false, price: 150 }  // Fails both checks
            ];
            const testRecommender = new ProductRecommender(testProducts, mockPreferences);
            const recommendations = testRecommender.getRecommendations('SUMMER', 100, 5);
            expect(recommendations).toHaveLength(1);
            expect(recommendations[0].price).toBe(50);
            expect(recommendations[0].inStock).toBe(true);
        });

        it('should handle empty products array', () => {
            const testRecommender = new ProductRecommender([], mockPreferences);
            const recommendations = testRecommender.getRecommendations('SUMMER', 100, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should include products exactly at price limit', () => {
            const productAtPriceLimit = {
                id: 5,
                name: "Product at Limit",
                category: "accessories",
                price: 300,
                inStock: true,
                rating: 4.5,
                reviewCount: 100,
                style: ['casual']
            };
            const recommenderWithLimitProduct = new ProductRecommender([...mockProducts, productAtPriceLimit], mockPreferences);
            const recommendations = recommenderWithLimitProduct.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).toContainEqual(expect.objectContaining({ id: 5 }));
        });

        it('should handle price being undefined', () => {
            const productWithoutPrice = {
                id: 6,
                name: "No Price Product",
                category: "accessories",
                inStock: true,
                rating: 4.5,
                reviewCount: 100,
                style: ['casual']
            };
            const recommenderWithNoPriceProduct = new ProductRecommender([...mockProducts, productWithoutPrice], mockPreferences);
            const recommendations = recommenderWithNoPriceProduct.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).not.toContainEqual(expect.objectContaining({ id: 6 }));
        });

        it('should handle undefined inStock field', () => {
            const testProducts = [
                { ...mockProducts[0], inStock: undefined }  // inStock field is undefined
            ];
            const testRecommender = new ProductRecommender(testProducts, mockPreferences);
            const recommendations = testRecommender.getRecommendations('SUMMER', 100, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should filter out products that are both out of stock and over budget', () => {
            const expensiveOutOfStockProduct = {
                id: 4,
                name: "Luxury Watch",
                category: "accessories",
                price: 1000,
                inStock: false,
                rating: 4.5,
                reviewCount: 100,
                style: ['luxury', 'formal']
            };
            const recommenderWithExpensiveItem = new ProductRecommender([...mockProducts, expensiveOutOfStockProduct], mockPreferences);
            const recommendations = recommenderWithExpensiveItem.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).not.toContainEqual(expect.objectContaining({ id: 4 }));
        });

        it('should handle price being not a number', () => {
            const productWithInvalidPrice = {
                id: 7,
                name: "Invalid Price Product",
                category: "accessories",
                price: "100",  // price as string
                inStock: true,
                rating: 4.5,
                reviewCount: 100,
                style: ['casual']
            };
            const recommenderWithInvalidPriceProduct = new ProductRecommender([...mockProducts, productWithInvalidPrice], mockPreferences);
            const recommendations = recommenderWithInvalidPriceProduct.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).not.toContainEqual(expect.objectContaining({ id: 7 }));
        });

        it('should handle undefined product', () => {
            const invalidRecommendation = { score: 1.0 }; // missing product field
            const recommenderWithInvalidProduct = new ProductRecommender([...mockProducts], mockPreferences);
            // Manually inject an invalid recommendation
            const recommendations = recommenderWithInvalidProduct.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).not.toContainEqual(expect.objectContaining({ score: 1.0 }));
        });

        it('should handle invalid maxPrice', () => {
            const recommender = new ProductRecommender(mockProducts, mockPreferences);
            let recommendations = recommender.getRecommendations('SUMMER', "300", 5);
            expect(recommendations).toHaveLength(0);

            recommendations = recommender.getRecommendations('SUMMER', -1, 5);
            expect(recommendations).toHaveLength(0);

            recommendations = recommender.getRecommendations('SUMMER', undefined, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should handle null products array', () => {
            const recommenderWithNullProducts = new ProductRecommender(null, mockPreferences);
            expect(() => recommenderWithNullProducts.getRecommendations('SUMMER', 300, 5)).toThrow();
        });

        it('should handle undefined products array', () => {
            const recommenderWithUndefinedProducts = new ProductRecommender(undefined, mockPreferences);
            expect(() => recommenderWithUndefinedProducts.getRecommendations('SUMMER', 300, 5)).toThrow();
        });

        it('should handle empty products array', () => {
            const emptyRecommender = new ProductRecommender([], mockPreferences);
            const recommendations = emptyRecommender.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should handle empty recommendations after filtering', () => {
            const invalidProducts = [
                { price: 400, inStock: true },
                { price: 200, inStock: false }
            ];
            const recommender = new ProductRecommender(invalidProducts, mockPreferences);
            const recommendations = recommender.getRecommendations('SUMMER', 300, 5);
            expect(recommendations).toHaveLength(0);
        });

        it('should handle undefined numRecommendations', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 300, undefined);
            expect(recommendations.length).toBeLessThanOrEqual(5); // default value
        });

        it('should handle NaN numRecommendations', () => {
            const recommendations = recommender.getRecommendations('SUMMER', 300, NaN);
            expect(recommendations.length).toBeLessThanOrEqual(5); // default value
        });
    });

    describe('validateInput', () => {
        let recommender;

        beforeEach(() => {
            recommender = new ProductRecommender(mockProducts, mockPreferences);
        });

        it('should throw error for null products', () => {
            const recommenderWithNull = new ProductRecommender(null, mockPreferences);
            expect(() => recommenderWithNull.validateInput(100)).toThrow('Products must be an array');
        });

        it('should throw error for undefined products', () => {
            const recommenderWithUndefined = new ProductRecommender(undefined, mockPreferences);
            expect(() => recommenderWithUndefined.validateInput(100)).toThrow('Products must be an array');
        });

        it('should throw error for non-array products', () => {
            const recommenderWithObject = new ProductRecommender({}, mockPreferences);
            expect(() => recommenderWithObject.validateInput(100)).toThrow('Products must be an array');
        });

        it('should return false for negative maxPrice', () => {
            expect(recommender.validateInput(-1)).toBe(false);
        });

        it('should return false for non-numeric maxPrice', () => {
            expect(recommender.validateInput('100')).toBe(false);
            expect(recommender.validateInput(null)).toBe(false);
            expect(recommender.validateInput(undefined)).toBe(false);
        });

        it('should return true for valid inputs', () => {
            expect(recommender.validateInput(100)).toBe(true);
            expect(recommender.validateInput(0)).toBe(true);
        });
    });
});