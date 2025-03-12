const { FeedbackAnalysisSystem } = require(process.env.TARGET_FILE);
// const { FeedbackAnalysisSystem } = require('./model_e');

describe("FeedbackAnalysisSystem", () => {
  let system;

  beforeEach(() => {
    system = new FeedbackAnalysisSystem();
  });

  describe("aggregateFeedback", () => {
    it("should correctly aggregate feedback by customer", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Good service",
          rating: 4,
          sentimentScore: 0.6,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.aggregateFeedback(feedbackData);

      expect(result).toEqual([
        {
          customerId: "123",
          averageRating: 4.5,
          averageSentimentScore: 0.75,
          feedbacks: feedbackData.filter((f) => f.customerId === "123"),
        },
        {
          customerId: "124",
          averageRating: 1,
          averageSentimentScore: -0.8,
          feedbacks: feedbackData.filter((f) => f.customerId === "124"),
        },
      ]);
    });

    it("should throw error if feedbackData is not an array", () => {
      expect(() => system.aggregateFeedback("invalid data")).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData has customerId not as string", () => {
      const feedbackData = [
        {
          customerId: 123,
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: 123,
          feedbackText: "Good service",
          rating: 4,
          sentimentScore: 0.6,
          date: "2025-03-11",
        },
        {
          customerId: 124,
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.aggregateFeedback(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData has rating not in range of 1 to 5", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5.7,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Good service",
          rating: 4,
          sentimentScore: 0.6,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.aggregateFeedback(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData has sentiment not in range of -1 to 1", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5.7,
          sentimentScore: 1.1,
          date: "2025-03-10",
        },
      ];
      expect(() => system.aggregateFeedback(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData has date not in correct format", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5.7,
          sentimentScore: 1.1,
          date: "03-10-2025",
        },
      ];
      expect(() => system.aggregateFeedback(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });
  });

  describe("filterFeedbackByDate", () => {
    it("should filter feedback within the specified date range", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Good service",
          rating: 4,
          sentimentScore: 0.6,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.filterFeedbackByDate(
        feedbackData,
        "2025-03-10",
        "2025-03-11"
      );

      expect(result).toEqual([
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Good service",
          rating: 4,
          sentimentScore: 0.6,
          date: "2025-03-11",
        },
      ]);
    });

    it("should return empty array if no feedback in the date range", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];

      const result = system.filterFeedbackByDate(
        feedbackData,
        "2025-03-11",
        "2025-03-12"
      );
      expect(result).toEqual([]);
    });

    it("should throw error if feedbackData is not an array", () => {
      expect(() =>
        system.filterFeedbackByDate("invalid data", "2025-03-10", "2025-03-11")
      ).toThrow("Invalid Feedback Details");
    });

    it("should throw error when start date is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];
      expect(() =>
        system.filterFeedbackByDate(feedbackData, "03-11-2025", "2025-03-12")
      ).toThrow("Invalid Feedback Details");
    });

    it("should throw error when end date is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];
      expect(() =>
        system.filterFeedbackByDate(feedbackData, "2025-03-12", "03-12-2025")
      ).toThrow("Invalid Feedback Details");
    });

    it("should throw error when end date is not a valid date", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];
      expect(() =>
        system.filterFeedbackByDate(feedbackData, "2025-03-12", "2025-13-12")
      ).toThrow("Invalid Feedback Details");
    });
  });

  describe("generateSentimentReport", () => {
    it("should generate a sentiment report categorizing feedback as positive, neutral, or negative", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.generateSentimentReport(feedbackData);

      expect(result).toEqual({
        positive: 1,
        neutral: 1,
        negative: 1,
      });
    });

    it("should throw error if feedbackData is not an array", () => {
      expect(() => system.generateSentimentReport("invalid data")).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.generateSentimentReport(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.generateSentimentReport(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 12,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.generateSentimentReport(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 12,
          sentimentScore: -1.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.generateSentimentReport(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });
  });

  describe("sortFeedbackByRating", () => {
    it("should sort feedback by rating in descending order by default", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.sortFeedbackByRating(feedbackData);

      expect(result).toEqual([
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ]);
    });

    it("should sort feedback by rating in ascending order if specified", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.sortFeedbackByRating(feedbackData, "asc");

      expect(result).toEqual([
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ]);
    });

    it("should throw error if feedbackData is not an array", () => {
      expect(() => system.sortFeedbackByRating("invalid data")).toThrow(
        "Invalid Feedback Details"
      );
    });
  });

  describe("getCustomerFeedbackSummary", () => {
    it("should return a customer feedback summary", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "123",
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
      ];

      const result = system.getCustomerFeedbackSummary(feedbackData, "123");

      expect(result).toEqual({
        customerId: "123",
        totalFeedbacks: 2,
        averageRating: 4,
        averageSentimentScore: 0.45,
      });
    });

    it("should return summary feebdback object for the customer", () => {
      const feedbackData = [
        {
          customerId: "999",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];

      const result = system.getCustomerFeedbackSummary(feedbackData, "999");

      expect(result).toEqual({
        customerId: "999",
        totalFeedbacks: 1,
        averageRating: 5,
        averageSentimentScore: 0.9,
      });
    });

    it("should throw error if no customer found", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];

      expect(() =>
        system.getCustomerFeedbackSummary(feedbackData, "999")
      ).toThrow("No customer found");
    });

    it("should throw error when passed customer id is invalid type", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
      ];

      expect(() =>
        system.getCustomerFeedbackSummary(feedbackData, 123)
      ).toThrow("Invalid Feedback Details");
    });

    it("should throw error if feedbackData is not an array", () => {
      expect(() =>
        system.getCustomerFeedbackSummary("invalid data", "123")
      ).toThrow("Invalid Feedback Details");
    });
  });

  describe("getSameReportOfCustomer", () => {
    it("should club customers based on rating and sentiment", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: "124",
          feedbackText: "Okay",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-11",
        },
        {
          customerId: "125",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
        {
          customerId: "126",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];

      const result = system.getSameReportOfCustomer(feedbackData);

      expect(result).toEqual([
        { customerId: "123", rating: 10, sentimentScore: 0.9 },
        { customerId: "124", rating: 10, sentimentScore: 0.9 },
        {
          customerId: "125",
          rating: 2,
          sentimentScore: -0.9,
        },
        {
          customerId: "126",
          rating: 2,
          sentimentScore: -0.9,
        },
      ]);
    });
    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-03-10",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "2025-03-11",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 1,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 12,
          sentimentScore: -0.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });

    it("should throw error if feedbackData is invalid", () => {
      const feedbackData = [
        {
          customerId: "123",
          feedbackText: "Great!",
          rating: 5,
          sentimentScore: 0.9,
          date: "2025-14-12",
        },
        {
          customerId: 123,
          feedbackText: "Okay",
          rating: 3,
          sentimentScore: 0,
          date: "03-11-2025",
        },
        {
          customerId: "124",
          feedbackText: "Bad experience",
          rating: 12,
          sentimentScore: -1.8,
          date: "2025-03-12",
        },
      ];
      expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
        "Invalid Feedback Details"
      );
    });
  });
});