/**
 * Product Recommendation System with personalized scoring and contextual recommendations
 */

class ProductRecommender {
    constructor(products, userPreferences) {
        this.products = products;
        this.userPreferences = userPreferences;
        this.seasonalBoosts = {
            'SUMMER': ['sunscreen', 'swimwear', 'sunglasses'],
            'WINTER': ['jacket', 'boots', 'scarf'],
            'SPRING': ['umbrella', 'raincoat', 'sneakers'],
            'FALL': ['sweater', 'jeans', 'coat']
        };
    }

    calculateSeasonalScore(product, currentSeason) {
        if (!product || !product.category || !product.name) {
            return 0;
        }
        const seasonalItems = this.seasonalBoosts[currentSeason] || [];
        const isSeasonalItem = seasonalItems.some(item => 
            product.category.toLowerCase().includes(item) || 
            product.name.toLowerCase().includes(item)
        );
        return isSeasonalItem ? 0.2 : 0;
    }

    calculatePriceScore(product, userBudget) {
        if (!product || typeof product.price !== 'number' || typeof userBudget !== 'number' || userBudget <= 0) {
            return 0;
        }
        
        if (product.price > userBudget) {
            return 0;
        }
    
        // Calculate price ratio (how close to budget)
        const priceRatio = product.price / userBudget;
        
        // Optimal price range is considered between 75% and 95% of budget
        if (priceRatio >= 0.75 && priceRatio <= 0.95) {
            return 0.3;
        } else if (priceRatio < 0.75) {
            // Lower scores for much cheaper items
            return 0.3 * (priceRatio / 0.75);
        } else {
            // Lower scores for items very close to budget
            return 0.3 * (1 - ((priceRatio - 0.95) / 0.05));
        }
    }

    calculatePreferenceScore(product, preferences) {
        if (!product || !preferences) {
            return 0;
        }
        let score = 0;
        if (preferences.favoriteCategories?.includes(product.category)) {
            score += 0.15;
        }
        if (preferences.preferredBrands?.includes(product.brand)) {
            score += 0.15;
        }
        if (preferences.stylePreferences?.length > 0 && Array.isArray(product.style)) {
            const styleMatch = preferences.stylePreferences.filter(style => 
                product.style.includes(style)
            ).length;
            score += (styleMatch / preferences.stylePreferences.length) * 0.2;
        }
        return score;
    }

    calculatePopularityScore(product) {
        if (!product || typeof product.rating !== 'number' || typeof product.reviewCount !== 'number') {
            return 0;
        }
        const normalizedRating = (product.rating - 1) / 4; // Assuming rating is 1-5
        const normalizedReviews = Math.min(product.reviewCount / 1000, 1);
        return (normalizedRating * 0.1) + (normalizedReviews * 0.1);
    }

    calculateRecommendationScore(product, currentSeason, maxPrice) {
        const seasonalScore = this.calculateSeasonalScore(product, currentSeason);
        const priceScore = this.calculatePriceScore(product, maxPrice);
        const preferenceScore = this.calculatePreferenceScore(product, this.userPreferences);
        const popularityScore = this.calculatePopularityScore(product);

        return seasonalScore + priceScore + preferenceScore + popularityScore;
    }

    isValidProduct(product, maxPrice) {
        if (!product) {
            return false;
        }
        if (typeof product.price !== 'number') {
            return false;
        }
        if (product.price > maxPrice) {
            return false;
        }
        if (product.inStock !== true) {
            return false;
        }
        return true;
    }

    validateInput(maxPrice) {
        if (!Array.isArray(this.products)) {
            throw new Error('Products must be an array');
        }
        if (this.products.length === 0) {
            return false;
        }
        return typeof maxPrice === 'number' && maxPrice >= 0;
    }

    getRecommendations(currentSeason, maxPrice, numRecommendations = 5) {
        // Validate inputs
        if (!this.validateInput(maxPrice)) {
            return [];
        }
    
        // Filter valid products and calculate scores
        const recommendedProducts = this.products
            .filter(product => this.isValidProduct(product, maxPrice))
            .map(product => {
                const recommendationScore = this.calculateRecommendationScore(
                    product,
                    currentSeason,
                    maxPrice
                );
                return {
                    ...product,
                    recommendationScore
                };
            })
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, numRecommendations);
    
        return recommendedProducts;
    }
}

module.exports = ProductRecommender;




