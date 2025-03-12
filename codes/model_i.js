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

    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    const aggregatedResults = _.map(groupedFeedback, (feedbacks, customerId) => {
      // Calculate average using native JavaScript
      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        feedbacks.length;
      const averageSentimentScore =
        feedbacks.reduce((sum, feedback) => sum + feedback.sentimentScore, 0) /
        feedbacks.length;

      return {
        customerId,
        averageRating,
        averageSentimentScore,
        feedbacks,
      };
    });

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
    const averageRating =
      customerFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
      totalFeedbacks;
    const averageSentimentScore =
      customerFeedbacks.reduce(
        (sum, feedback) => sum + feedback.sentimentScore,
        0
      ) / totalFeedbacks;

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

    const groupedFeedback = _.groupBy(feedbackData, (feedback) => {
      return `${feedback.rating}_${feedback.sentimentScore}`;
    });

    return _.map(groupedFeedback, (feedbacks) => {
      const customerId = feedbacks[0].customerId;
      const totalRating = _.reduce(
        feedbacks,
        (sum, feedback) => sum + feedback.rating,
        0
      );
      let totalSentimentScore = _.reduce(
        feedbacks,
        (sum, feedback) => sum + feedback.sentimentScore,
        0
      );

      // Adjust sentiment score if it exceeds the range
      if (totalSentimentScore > 1) totalSentimentScore = 0.9;
      if (totalSentimentScore < -1) totalSentimentScore = -0.9;

      return {
        customerId,
        rating: totalRating,
        sentimentScore: totalSentimentScore,
      };
    });
  }
}

module.exports = { FeedbackAnalysisSystem };