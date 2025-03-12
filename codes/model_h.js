const _ = require("lodash");
const { parseISO, isWithinInterval, isValid } = require("date-fns");

class FeedbackAnalysisSystem {
  constructor() {
    this.feedbacks = [];
  }

  validateFeedback(feedback) {
    if (
      typeof feedback.customerId !== "string" ||
      typeof feedback.feedbackText !== "string" ||
      typeof feedback.rating !== "number" ||
      feedback.rating < 1 ||
      feedback.rating > 5 ||
      typeof feedback.sentimentScore !== "number" ||
      feedback.sentimentScore < -1 ||
      feedback.sentimentScore > 1 ||
      typeof feedback.date !== "string" ||
      !isValid(parseISO(feedback.date))
    ) {
      throw new Error("Invalid Feedback Details");
    }
  }

  aggregateFeedback(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    feedbackData.forEach(this.validateFeedback);

    const groupedFeedback = _.groupBy(feedbackData, "customerId");
    const aggregatedResults = _.map(groupedFeedback, (feedbacks, customerId) => {
      const averageRating = _.meanBy(feedbacks, "rating");
      const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");

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
      typeof endDate !== "string" ||
      !isValid(parseISO(startDate)) ||
      !isValid(parseISO(endDate))
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

    feedbackData.forEach(this.validateFeedback);

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

    feedbackData.forEach(this.validateFeedback);

    const sortedFeedback = _.sortBy(feedbackData, "rating");
    return order === "desc" ? sortedFeedback.reverse() : sortedFeedback;
  }

  getCustomerFeedbackSummary(feedbackData, customerId) {
    if (!Array.isArray(feedbackData) || typeof customerId !== "string") {
      throw new Error("Invalid Feedback Details");
    }

    feedbackData.forEach(this.validateFeedback);

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

  getSameReportOfCustomer(feedbackData) {
    if (!Array.isArray(feedbackData)) {
      throw new Error("Invalid Feedback Details");
    }

    feedbackData.forEach(this.validateFeedback);

    const grouped = _.groupBy(feedbackData, (feedback) =>
      `${feedback.rating}-${feedback.sentimentScore}`
    );

    return _.map(grouped, (group) => {
      const customerId = group.map((f) => f.customerId).join(", ");
      const rating = _.sumBy(group, "rating");
      let sentimentScore = _.sumBy(group, "sentimentScore");

      if (sentimentScore > 1) sentimentScore = 0.9;
      if (sentimentScore < -1) sentimentScore = -0.9;

      return {
        customerId,
        rating,
        sentimentScore,
      };
    });
  }
}

module.exports = { FeedbackAnalysisSystem };