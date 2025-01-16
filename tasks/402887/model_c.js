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

    calculatePriceScore(product, userBudget) {
        if (!product || typeof product.price !== 'number' || !userBudget || userBudget <= 0) {
            return 0;
        }
        
        if (product.price > userBudget) {
            return 0;
        }
    
        // Calculate how much of the budget is used (0 to 1)
        const budgetUtilization = product.price / userBudget;
        
        // Use logarithmic scale to favor prices that use a good portion of the budget
        // without being too close to the maximum
        const score = 0.3 * (1 + Math.log10(budgetUtilization)) / 1.5;
        
        // Ensure score is between 0 and 0.3
        return Math.max(0, Math.min(0.3, score));
    }
    
    getRecommendations(currentSeason, maxPrice, numRecommendations = 5) {
        // Validate inputs
        if (!this.validateInput(maxPrice)) {
            return [];
        }
    
        // Filter valid products and calculate scores
        const recommendedProducts = this.products
            .filter(product => this.isValidProduct(product, maxPrice))
            .map(product => ({
                ...product,
                recommendationScore: this.calculateRecommendationScore(
                    product,
                    currentSeason,
                    maxPrice
                )
            }))
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, numRecommendations);
    
        return recommendedProducts;
    }
}

module.exports = ProductRecommender;