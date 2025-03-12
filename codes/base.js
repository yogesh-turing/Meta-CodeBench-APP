const _ = require("underscore");
const { parseISO, isWithinInterval } = require("date-fns");

class FeedbackAnalysisSystem {
  constructor() {
    this.feedbacks = [];
  }

  aggregateFeedback(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    const aggregatedResults = _.map(
      groupedFeedback,
      (feedbacks, customerId) => {
        const averageRating = _.meanBy(feedbacks, "rating");
        const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");

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

    return _.sortBy(feedbackData, "rating");
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
    const averageRating = _.meanBy(customerFeedbacks, "rating");
    const averageSentimentScore = _.meanBy(customerFeedbacks, "sentimentScore");

    return {
      customerId,
      totalFeedbacks,
      averageRating,
      averageSentimentScore,
    };
  }

  getSameReportOfCustomer(feedbackdata) {
    return {};
  }
}

module.exports = { FeedbackAnalysisSystem };
