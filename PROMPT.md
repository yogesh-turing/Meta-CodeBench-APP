Base Code:
```javascript
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

```

Stack Trace:
```javascript
FeedbackAnalysisSystem
    aggregateFeedback
      ✕ should correctly aggregate feedback by customer (1 ms)
      ✓ should throw error if feedbackData is not an array (1 ms)
      ✕ should throw error if feedbackData has customerId not as string (10 ms)
      ✕ should throw error if feedbackData has rating not in range of 1 to 5 (5 ms)
      ✕ should throw error if feedbackData has sentiment not in range of -1 to 1 (1 ms)
      ✕ should throw error if feedbackData has date not in correct format (1 ms)
    filterFeedbackByDate
      ✓ should filter feedback within the specified date range (2 ms)
      ✓ should return empty array if no feedback in the date range
      ✓ should throw error if feedbackData is not an array (1 ms)
      ✕ should throw error when start date is invalid
      ✕ should throw error when end date is invalid
      ✕ should throw error when end date is not a valid date
    generateSentimentReport
      ✓ should generate a sentiment report categorizing feedback as positive, neutral, or negative
      ✓ should throw error if feedbackData is not an array
      ✕ should throw error if feedbackData is invalid (1 ms)
      ✕ should throw error if feedbackData is invalid
      ✕ should throw error if feedbackData is invalid
      ✕ should throw error if feedbackData is invalid (1 ms)
    sortFeedbackByRating
      ✕ should sort feedback by rating in descending order by default (2 ms)
      ✓ should sort feedback by rating in ascending order if specified
      ✓ should throw error if feedbackData is not an array
    getCustomerFeedbackSummary
      ✕ should return a customer feedback summary
      ✕ should return summary feebdback object for the customer
      ✓ should throw error if no customer found (1 ms)
      ✓ should throw error when passed customer id is invalid type
      ✓ should throw error if feedbackData is not an array
    getSameReportOfCustomer
      ✕ should club customers based on rating and sentiment (1 ms)
      ✕ should throw error if feedbackData is invalid
      ✕ should throw error if feedbackData is invalid
      ✕ should throw error if feedbackData is invalid
      ✕ should throw error if feedbackData is invalid (1 ms)

  ● FeedbackAnalysisSystem › aggregateFeedback › should correctly aggregate feedback by customer

    TypeError: _.meanBy is not a function

      16 |       groupedFeedback,
      17 |       (feedbacks, customerId) => {
    > 18 |         const averageRating = _.meanBy(feedbacks, "rating");
         |                                 ^
      19 |         const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");
      20 |
      21 |         return {

      at meanBy (Solution.js:18:33)
      at Function.map (node_modules/underscore/underscore-node-f-pre.js:1340:22)
      at FeedbackAnalysisSystem.map [as aggregateFeedback] (Solution.js:15:33)
      at Object.aggregateFeedback (WordCloud.test.js:36:29)

  ● FeedbackAnalysisSystem › aggregateFeedback › should throw error if feedbackData has customerId not as string

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"
    Received message:   "_.meanBy is not a function"

          16 |       groupedFeedback,
          17 |       (feedbacks, customerId) => {
        > 18 |         const averageRating = _.meanBy(feedbacks, "rating");
             |                                 ^
          19 |         const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");
          20 |
          21 |         return {

          at meanBy (Solution.js:18:33)
          at Function.map (node_modules/underscore/underscore-node-f-pre.js:1340:22)
          at FeedbackAnalysisSystem.map [as aggregateFeedback] (Solution.js:15:33)
          at aggregateFeedback (WordCloud.test.js:84:27)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:84:60)

      82 |         },
      83 |       ];
    > 84 |       expect(() => system.aggregateFeedback(feedbackData)).toThrow(
         |                                                            ^
      85 |         "Invalid Feedback Details"
      86 |       );
      87 |     });

      at Object.toThrow (WordCloud.test.js:84:60)

  ● FeedbackAnalysisSystem › aggregateFeedback › should throw error if feedbackData has rating not in range of 1 to 5

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"
    Received message:   "_.meanBy is not a function"

          16 |       groupedFeedback,
          17 |       (feedbacks, customerId) => {
        > 18 |         const averageRating = _.meanBy(feedbacks, "rating");
             |                                 ^
          19 |         const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");
          20 |
          21 |         return {

          at meanBy (Solution.js:18:33)
          at Function.map (node_modules/underscore/underscore-node-f-pre.js:1340:22)
          at FeedbackAnalysisSystem.map [as aggregateFeedback] (Solution.js:15:33)
          at aggregateFeedback (WordCloud.test.js:113:27)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:113:60)

      111 |         },
      112 |       ];
    > 113 |       expect(() => system.aggregateFeedback(feedbackData)).toThrow(
          |                                                            ^
      114 |         "Invalid Feedback Details"
      115 |       );
      116 |     });

      at Object.toThrow (WordCloud.test.js:113:60)

  ● FeedbackAnalysisSystem › aggregateFeedback › should throw error if feedbackData has sentiment not in range of -1 to 1

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"
    Received message:   "_.meanBy is not a function"

          16 |       groupedFeedback,
          17 |       (feedbacks, customerId) => {
        > 18 |         const averageRating = _.meanBy(feedbacks, "rating");
             |                                 ^
          19 |         const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");
          20 |
          21 |         return {

          at meanBy (Solution.js:18:33)
          at Function.map (node_modules/underscore/underscore-node-f-pre.js:1340:22)
          at FeedbackAnalysisSystem.map [as aggregateFeedback] (Solution.js:15:33)
          at aggregateFeedback (WordCloud.test.js:128:27)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:128:60)

      126 |         },
      127 |       ];
    > 128 |       expect(() => system.aggregateFeedback(feedbackData)).toThrow(
          |                                                            ^
      129 |         "Invalid Feedback Details"
      130 |       );
      131 |     });

      at Object.toThrow (WordCloud.test.js:128:60)

  ● FeedbackAnalysisSystem › aggregateFeedback › should throw error if feedbackData has date not in correct format

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"
    Received message:   "_.meanBy is not a function"

          16 |       groupedFeedback,
          17 |       (feedbacks, customerId) => {
        > 18 |         const averageRating = _.meanBy(feedbacks, "rating");
             |                                 ^
          19 |         const averageSentimentScore = _.meanBy(feedbacks, "sentimentScore");
          20 |
          21 |         return {

          at meanBy (Solution.js:18:33)
          at Function.map (node_modules/underscore/underscore-node-f-pre.js:1340:22)
          at FeedbackAnalysisSystem.map [as aggregateFeedback] (Solution.js:15:33)
          at aggregateFeedback (WordCloud.test.js:143:27)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:143:60)

      141 |         },
      142 |       ];
    > 143 |       expect(() => system.aggregateFeedback(feedbackData)).toThrow(
          |                                                            ^
      144 |         "Invalid Feedback Details"
      145 |       );
      146 |     });

      at Object.toThrow (WordCloud.test.js:143:60)

  ● FeedbackAnalysisSystem › filterFeedbackByDate › should throw error when start date is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      234 |       expect(() =>
      235 |         system.filterFeedbackByDate(feedbackData, "03-11-2025", "2025-03-12")
    > 236 |       ).toThrow("Invalid Feedback Details");
          |         ^
      237 |     });
      238 |
      239 |     it("should throw error when end date is invalid", () => {

      at Object.toThrow (WordCloud.test.js:236:9)

  ● FeedbackAnalysisSystem › filterFeedbackByDate › should throw error when end date is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      249 |       expect(() =>
      250 |         system.filterFeedbackByDate(feedbackData, "2025-03-12", "03-12-2025")
    > 251 |       ).toThrow("Invalid Feedback Details");
          |         ^
      252 |     });
      253 |
      254 |     it("should throw error when end date is not a valid date", () => {

      at Object.toThrow (WordCloud.test.js:251:9)

  ● FeedbackAnalysisSystem › filterFeedbackByDate › should throw error when end date is not a valid date

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      264 |       expect(() =>
      265 |         system.filterFeedbackByDate(feedbackData, "2025-03-12", "2025-13-12")
    > 266 |       ).toThrow("Invalid Feedback Details");
          |         ^
      267 |     });
      268 |   });
      269 |

      at Object.toThrow (WordCloud.test.js:266:9)

  ● FeedbackAnalysisSystem › generateSentimentReport › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      333 |         },
      334 |       ];
    > 335 |       expect(() => system.generateSentimentReport(feedbackData)).toThrow(
          |                                                                  ^
      336 |         "Invalid Feedback Details"
      337 |       );
      338 |     });

      at Object.toThrow (WordCloud.test.js:335:66)

  ● FeedbackAnalysisSystem › generateSentimentReport › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      362 |         },
      363 |       ];
    > 364 |       expect(() => system.generateSentimentReport(feedbackData)).toThrow(
          |                                                                  ^
      365 |         "Invalid Feedback Details"
      366 |       );
      367 |     });

      at Object.toThrow (WordCloud.test.js:364:66)

  ● FeedbackAnalysisSystem › generateSentimentReport › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      391 |         },
      392 |       ];
    > 393 |       expect(() => system.generateSentimentReport(feedbackData)).toThrow(
          |                                                                  ^
      394 |         "Invalid Feedback Details"
      395 |       );
      396 |     });

      at Object.toThrow (WordCloud.test.js:393:66)

  ● FeedbackAnalysisSystem › generateSentimentReport › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      420 |         },
      421 |       ];
    > 422 |       expect(() => system.generateSentimentReport(feedbackData)).toThrow(
          |                                                                  ^
      423 |         "Invalid Feedback Details"
      424 |       );
      425 |     });

      at Object.toThrow (WordCloud.test.js:422:66)

  ● FeedbackAnalysisSystem › sortFeedbackByRating › should sort feedback by rating in descending order by default

    expect(received).toEqual(expected) // deep equality

    - Expected  - 10
    + Received  + 10

      Array [
        Object {
    -     "customerId": "123",
    -     "date": "2025-03-10",
    -     "feedbackText": "Great!",
    -     "rating": 5,
    -     "sentimentScore": 0.9,
    +     "customerId": "124",
    +     "date": "2025-03-12",
    +     "feedbackText": "Bad experience",
    +     "rating": 1,
    +     "sentimentScore": -0.8,
        },
        Object {
          "customerId": "123",
          "date": "2025-03-11",
          "feedbackText": "Okay",
          "rating": 3,
          "sentimentScore": 0,
        },
        Object {
    -     "customerId": "124",
    -     "date": "2025-03-12",
    -     "feedbackText": "Bad experience",
    -     "rating": 1,
    -     "sentimentScore": -0.8,
    +     "customerId": "123",
    +     "date": "2025-03-10",
    +     "feedbackText": "Great!",
    +     "rating": 5,
    +     "sentimentScore": 0.9,
        },
      ]

      454 |       const result = system.sortFeedbackByRating(feedbackData);
      455 |
    > 456 |       expect(result).toEqual([
          |                      ^
      457 |         {
      458 |           customerId: "123",
      459 |           feedbackText: "Great!",

      at Object.toEqual (WordCloud.test.js:456:22)

  ● FeedbackAnalysisSystem › getCustomerFeedbackSummary › should return a customer feedback summary

    TypeError: _.meanBy is not a function

      90 |
      91 |     const totalFeedbacks = customerFeedbacks.length;
    > 92 |     const averageRating = _.meanBy(customerFeedbacks, "rating");
         |                             ^
      93 |     const averageSentimentScore = _.meanBy(customerFeedbacks, "sentimentScore");
      94 |
      95 |     return {

      at FeedbackAnalysisSystem.meanBy [as getCustomerFeedbackSummary] (Solution.js:92:29)
      at Object.getCustomerFeedbackSummary (WordCloud.test.js:559:29)

  ● FeedbackAnalysisSystem › getCustomerFeedbackSummary › should return summary feebdback object for the customer

    TypeError: _.meanBy is not a function

      90 |
      91 |     const totalFeedbacks = customerFeedbacks.length;
    > 92 |     const averageRating = _.meanBy(customerFeedbacks, "rating");
         |                             ^
      93 |     const averageSentimentScore = _.meanBy(customerFeedbacks, "sentimentScore");
      94 |
      95 |     return {

      at FeedbackAnalysisSystem.meanBy [as getCustomerFeedbackSummary] (Solution.js:92:29)
      at Object.getCustomerFeedbackSummary (WordCloud.test.js:580:29)

  ● FeedbackAnalysisSystem › getSameReportOfCustomer › should club customers based on rating and sentiment

    expect(received).toEqual(expected) // deep equality

    Expected: [{"customerId": "123", "rating": 10, "sentimentScore": 0.9}, {"customerId": "124", "rating": 10, "sentimentScore": 0.9}, {"customerId": "125", "rating": 2, "sentimentScore": -0.9}, {"customerId": "126", "rating": 2, "sentimentScore": -0.9}]
    Received: {}

      662 |       const result = system.getSameReportOfCustomer(feedbackData);
      663 |
    > 664 |       expect(result).toEqual([
          |                      ^
      665 |         { customerId: "123", rating: 10, sentimentScore: 0.9 },
      666 |         { customerId: "124", rating: 10, sentimentScore: 0.9 },
      667 |         {

      at Object.toEqual (WordCloud.test.js:664:22)

  ● FeedbackAnalysisSystem › getSameReportOfCustomer › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      701 |         },
      702 |       ];
    > 703 |       expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
          |                                                                  ^
      704 |         "Invalid Feedback Details"
      705 |       );
      706 |     });

      at Object.toThrow (WordCloud.test.js:703:66)

  ● FeedbackAnalysisSystem › getSameReportOfCustomer › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      730 |         },
      731 |       ];
    > 732 |       expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
          |                                                                  ^
      733 |         "Invalid Feedback Details"
      734 |       );
      735 |     });

      at Object.toThrow (WordCloud.test.js:732:66)

  ● FeedbackAnalysisSystem › getSameReportOfCustomer › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      759 |         },
      760 |       ];
    > 761 |       expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
          |                                                                  ^
      762 |         "Invalid Feedback Details"
      763 |       );
      764 |     });

      at Object.toThrow (WordCloud.test.js:761:66)

  ● FeedbackAnalysisSystem › getSameReportOfCustomer › should throw error if feedbackData is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid Feedback Details"

    Received function did not throw

      788 |         },
      789 |       ];
    > 790 |       expect(() => system.getSameReportOfCustomer(feedbackData)).toThrow(
          |                                                                  ^
      791 |         "Invalid Feedback Details"
      792 |       );
      793 |     });

      at Object.toThrow (WordCloud.test.js:790:66)

Test Suites: 1 failed, 1 total
Tests:       20 failed, 11 passed, 31 total
Snapshots:   0 total
Time:        0.443 s, estimated 1 s
Ran all test suites.
```
Prompt:
Please fix the bugs in the code using the date-fns and Underscore libraries based on the details below:
Function: `aggregateFeedback`
-   Input: `feedbackData` (array of objects) with properties:
    -   `customerId` (string), `feedbackText` (string), `rating` (1–5), `sentimentScore` (-1 to 1), `date` (ISO date string).
-   Output: Aggregated feedback by `customerId`, including:
    -   `customerId`, `averageRating`, `averageSentimentScore`, and an array of `feedbacks`.

Function: `filterFeedbackByDate`
-   Input: `feedbackData` (array), `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD).
-   Output: Filtered feedback within the date range. Returns an empty array if no feedback is found.

Function:`getSameReportOfCustomer`
-  Input: `feedbackData` (array)
-  If customers are having same rating and sentiment then group them.
- Output: Array of objects:
     - customerId, rating(sum of grouped customers), sentimentScore(sum of grouped customers, if exceeded 1, round to 0.9, if fall below -1 round to -0.9)

Function: `generateSentimentReport`
-   Input: `feedbackData` (array of feedback objects).
-   Output: Sentiment report categorizing feedback into "positive", "neutral", or "negative", with counts for each category.

Function: `sortFeedbackByRating`
-   Input: `feedbackData` (array), `order` ("asc" or "desc").
-   Output: Sorted feedback based on `rating`.



Function: `getCustomerFeedbackSummary
-   Input: `feedbackData` (array), `customerId` (string).
-   Output: Summary including:
    -   `customerId`, `totalFeedbacks`, `averageRating`, `averageSentimentScore`.
    -   If no customer or feedback found, raise an error: "No customer found" or return an empty summary object.


-----
-   If any parameter is invalid or improperly formatted, raise an error: "Invalid Feedback Details".