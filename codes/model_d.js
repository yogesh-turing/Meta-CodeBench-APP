const _ = require("underscore");
const { parseISO, isWithinInterval, isValid } = require("date-fns");

class FeedbackAnalysisSystem {
  constructor() {
    this.feedbacks = [];
  }

  validateFeedbackData(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    for (const feedback of feedbackData) {
      if (typeof feedback.customerId !== "string" ||
          typeof feedback.feedbackText !== "string" ||
          typeof feedback.rating !== "number" ||
          typeof feedback.sentimentScore !== "number" ||
          typeof feedback.date !== "string" ||
          feedback.rating < 1 || feedback.rating > 5 ||
          feedback.sentimentScore < -1 || feedback.sentimentScore > 1 ||
          !isValid(parseISO(feedback.date))) {
        throw new Error("Invalid Feedback Details");
      }
    }
  }

  aggregateFeedback(feedbackData) {
    this.validateFeedbackData(feedbackData);
    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    return Object.entries(groupedFeedback).map(([customerId, feedbacks]) => ({
      customerId,
      averageRating: _.reduce(feedbacks, (sum, f) => sum + f.rating, 0) / feedbacks.length,
      averageSentimentScore: _.reduce(feedbacks, (sum, f) => sum + f.sentimentScore, 0) / feedbacks.length,
      feedbacks
    }));
  }

  filterFeedbackByDate(feedbackData, startDate, endDate) {
    this.validateFeedbackData(feedbackData);
    if (!isValid(parseISO(startDate)) || !isValid(parseISO(endDate))) {
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
    this.validateFeedbackData(feedbackData);

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
    this.validateFeedbackData(feedbackData);
    if (order !== "asc" && order !== "desc") {
      throw new Error("Invalid Feedback Details");
    }

    const sorted = _.sortBy(feedbackData, "rating");
    return order === "desc" ? sorted.reverse() : sorted;
  }

  getCustomerFeedbackSummary(feedbackData, customerId) {
    this.validateFeedbackData(feedbackData);
    if (typeof customerId !== "string") {
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
    this.validateFeedbackData(feedbackData);

    const groupedByRatingAndSentiment = _.groupBy(feedbackData, feedback => 
      `${feedback.rating}-${feedback.sentimentScore}`
    );

    const result = [];
    for (const group of Object.values(groupedByRatingAndSentiment)) {
      if (group.length > 1) {
        const totalRating = _.reduce(group, (sum, f) => sum + f.rating, 0);
        let totalSentiment = _.reduce(group, (sum, f) => sum + f.sentimentScore, 0);
        totalSentiment = Math.min(Math.max(totalSentiment, -0.9), 0.9);

        group.forEach(feedback => {
          result.push({
            customerId: feedback.customerId,
            rating: totalRating,
            sentimentScore: totalSentiment
          });
        });
      }
    }

    return result;
  }
}

module.exports = { FeedbackAnalysisSystem };