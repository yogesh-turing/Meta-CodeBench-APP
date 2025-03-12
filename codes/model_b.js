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
      typeof feedback.date === "string" &&
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
    if (!Array.isArray(feedbackData) || 
        typeof startDate !== "string" || 
        typeof endDate !== "string" ||
        !isValid(parseISO(startDate)) ||
        !isValid(parseISO(endDate))) {
      throw new Error("Invalid Feedback Details");
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return feedbackData.filter(feedback => {
      const feedbackDate = parseISO(feedback.date);
      return isWithinInterval(feedbackDate, { start, end });
    });
  }

  generateSentimentReport(feedbackData) {
    if (!Array.isArray(feedbackData) || !feedbackData.every(this.validateFeedback)) {
      throw new Error("Invalid Feedback Details");
    }

    return feedbackData.reduce((report, feedback) => {
      if (feedback.sentimentScore > 0) report.positive++;
      else if (feedback.sentimentScore < 0) report.negative++;
      else report.neutral++;
      return report;
    }, { positive: 0, neutral: 0, negative: 0 });
  }

  sortFeedbackByRating(feedbackData, order = "desc") {
    if (!Array.isArray(feedbackData) || !["asc", "desc"].includes(order)) {
      throw new Error("Invalid Feedback Details");
    }

    const sorted = _.sortBy(feedbackData, "rating");
    return order === "desc" ? sorted.reverse() : sorted;
  }

  getCustomerFeedbackSummary(feedbackData, customerId) {
    if (!Array.isArray(feedbackData) || typeof customerId !== "string") {
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

    const groupedCustomers = _.groupBy(feedbackData, feedback => 
      `${feedback.rating}_${feedback.sentimentScore}`
    );

    return Object.values(groupedCustomers)
      .filter(group => group.length > 0)
      .map(group => {
        const totalRating = _.reduce(group, (sum, f) => sum + f.rating, 0);
        let totalSentiment = _.reduce(group, (sum, f) => sum + f.sentimentScore, 0);
        
        totalSentiment = Math.min(Math.max(totalSentiment, -0.9), 0.9);

        return {
          customerId: group[0].customerId,
          rating: totalRating,
          sentimentScore: totalSentiment
        };
      });
  }
}

module.exports = { FeedbackAnalysisSystem };