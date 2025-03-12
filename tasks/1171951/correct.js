const _ = require("underscore");
const { parseISO, isWithinInterval, isValid } = require("date-fns");

class FeedbackAnalysisSystem {
  constructor() {
    this.feedbacks = [];
  }

  validateFeedback(feedback) {
    return (
      typeof feedback.customerId === "string" &&
      typeof feedback.rating === "number" &&
      feedback.rating >= 1 &&
      feedback.rating <= 5 &&
      typeof feedback.sentimentScore === "number" &&
      feedback.sentimentScore >= -1 &&
      feedback.sentimentScore <= 1 &&
      isValid(parseISO(feedback.date))
    );
  }

  aggregateFeedback(feedbackData) {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    return Object.entries(groupedFeedback).map(([customerId, feedbacks]) => ({
      customerId,
      averageRating: _.reduce(feedbacks, (sum, f) => sum + f.rating, 0) / feedbacks.length,
      averageSentimentScore: _.reduce(feedbacks, (sum, f) => sum + f.sentimentScore, 0) / feedbacks.length,
      feedbacks
    }));
  }

  filterFeedbackByDate(feedbackData, startDate, endDate) {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) {
      throw new Error("Invalid Feedback Details");
    }

    return feedbackData.filter(feedback => {
      const feedbackDate = parseISO(feedback.date);
      return isWithinInterval(feedbackDate, { start, end });
    });
  }

  generateSentimentReport(feedbackData) {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    const sentimentGroups = _.groupBy(feedbackData, feedback => {
      if (feedback.sentimentScore > 0) return "positive";
      if (feedback.sentimentScore < 0) return "negative";
      return "neutral";
    });

    return {
      positive: sentimentGroups.positive?.length || 0,
      neutral: sentimentGroups.neutral?.length || 0,
      negative: sentimentGroups.negative?.length || 0
    };
  }

  sortFeedbackByRating(feedbackData, order = "desc") {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback) || 
        !["asc", "desc"].includes(order)) {
      throw new Error("Invalid Feedback Details");
    }

    const sorted = _.sortBy(feedbackData, "rating");
    return order === "desc" ? sorted.reverse() : sorted;
  }

  getCustomerFeedbackSummary(feedbackData, customerId) {
    if (!Array.isArray(feedbackData) || typeof customerId !== "string" || 
        !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    const customerFeedbacks = feedbackData.filter(f => f.customerId === customerId);
    if (customerFeedbacks.length === 0) {
      throw new Error("No customer found");
    }

    return {
      customerId,
      totalFeedbacks: customerFeedbacks.length,
      averageRating: _.reduce(customerFeedbacks, (sum, f) => sum + f.rating, 0) / customerFeedbacks.length,
      averageSentimentScore: _.reduce(customerFeedbacks, (sum, f) => sum + f.sentimentScore, 0) / customerFeedbacks.length
    };
  }

  getSameReportOfCustomer(feedbackData) {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    const groupedByRatingAndSentiment = _.groupBy(feedbackData, feedback => 
      `${feedback.rating}_${feedback.sentimentScore}`
    );

    return Object.values(groupedByRatingAndSentiment)
      .filter(group => group.length > 1)
      .flatMap(group => {
        const totalRating = _.reduce(group, (sum, f) => sum + f.rating, 0);
        let totalSentiment = _.reduce(group, (sum, f) => sum + f.sentimentScore, 0);
        totalSentiment = Math.min(Math.max(totalSentiment, -0.9), 0.9);

        return group.map(feedback => ({
          customerId: feedback.customerId,
          rating: totalRating,
          sentimentScore: totalSentiment
        }));
      });
  }
}

module.exports = { FeedbackAnalysisSystem };