const _ = require("underscore");
const { parseISO, isWithinInterval, isValid } = require("date-fns");

class FeedbackAnalysisSystem {
  constructor() {
    this.feedbacks = [];
  }

  aggregateFeedback(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    feedbackData.forEach(feedback => {
      if (typeof feedback.customerId !== 'string' || 
          typeof feedback.feedbackText !== 'string' || 
          typeof feedback.rating !== 'number' || 
          feedback.rating < 1 || feedback.rating > 5 || 
          typeof feedback.sentimentScore !== 'number' || 
          feedback.sentimentScore < -1 || feedback.sentimentScore > 1 || 
          !isValid(parseISO(feedback.date))) {
        throw new Error("Invalid Feedback Details");
      }
    });

    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    const aggregatedResults = _.map(
      groupedFeedback,
      (feedbacks, customerId) => {
        const averageRating = _.reduce(feedbacks, (sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;
        const averageSentimentScore = _.reduce(feedbacks, (sum, feedback) => sum + feedback.sentimentScore, 0) / feedbacks.length;

        return {
          customerId,
          averageRating,
          averageSentimentScore,
          feedbacks,
        };
      }
    );

    return aggregatedResults;
  }

  filterFeedbackByDate(feedbackData, startDate, endDate) {
    if (
      !Array.isArray(feedbackData) || 
      typeof startDate !== "string" || 
      typeof endDate !== "string"
    ) {
      throw new Error("Invalid Feedback Details");
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) {
      throw new Error("Invalid Feedback Details");
    }

    return _.filter(feedbackData, (feedback) => {
      const feedbackDate = parseISO(feedback.date);
      return isWithinInterval(feedbackDate, { start, end });
    });
  }

  generateSentimentReport(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    feedbackData.forEach(feedback => {
      if (typeof feedback.sentimentScore !== 'number' || feedback.sentimentScore < -1 || feedback.sentimentScore > 1) {
        throw new Error("Invalid Feedback Details");
      }
    });

    const sentimentGroups = _.groupBy(feedbackData, (feedback) => {
      if (feedback.sentimentScore > 0) return "positive";
      if (feedback.sentimentScore < 0) return "negative";
      return "neutral";
    });

    return {
      positive: sentimentGroups.positive ? sentimentGroups.positive.length : 0,
      neutral: sentimentGroups.neutral ? sentimentGroups.neutral.length : 0,
      negative: sentimentGroups.negative ? sentimentGroups.negative.length : 0,
    };
  }

  sortFeedbackByRating(feedbackData, order = "desc") {
    if (!Array.isArray(feedbackData) || (order !== "asc" && order !== "desc")) {
      throw new Error("Invalid Feedback Details");
    }

    const sorted = _.sortBy(feedbackData, "rating");
    return order === "desc" ? sorted.reverse() : sorted;
  }

  getCustomerFeedbackSummary(feedbackData, customerId) {
    if (!Array.isArray(feedbackData) || typeof customerId !== "string") {
      throw new Error("Invalid Feedback Details");
    }

    const customerFeedbacks = _.filter(
      feedbackData,
      (feedback) => feedback.customerId === customerId
    );

    if (customerFeedbacks.length === 0) {
      throw new Error("No customer found");
    }

    const totalFeedbacks = customerFeedbacks.length;
    const averageRating = _.reduce(customerFeedbacks, (sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks;
    const averageSentimentScore = _.reduce(customerFeedbacks, (sum, feedback) => sum + feedback.sentimentScore, 0) / totalFeedbacks;

    return {
      customerId,
      totalFeedbacks,
      averageRating,
      averageSentimentScore,
    };
  }

  getSameReportOfCustomer(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    const groupedFeedback = _.groupBy(feedbackData, feedback => `${feedback.rating}:${feedback.sentimentScore}`);

    return _.map(groupedFeedback, (feedbacks, key) => {
      const [rating, sentimentScore] = key.split(':').map(Number);
      const totalRating = _.sumBy(feedbacks, 'rating');
      let totalSentimentScore = _.sumBy(feedbacks, 'sentimentScore');
      totalSentimentScore = Math.max(Math.min(totalSentimentScore, 0.9), -0.9);

      return {
        customerId: feedbacks.map(f => f.customerId).join(', '),
        rating: totalRating,
        sentimentScore: totalSentimentScore,
      };
    });
  }
}

module.exports = { FeedbackAnalysisSystem };