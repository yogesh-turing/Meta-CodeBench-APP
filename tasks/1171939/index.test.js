const { processUserActivity } = require("./correct");
// const { processUserActivity } = require(process.env.TARGET_FILE);

describe("processUserActivity", () => {
  it("should handle empty activity arrays correctly", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [],
      },
    ];

    const result = processUserActivity(input);
    expect(result).toEqual([]);
  });

  it("should filter out users with no recent activity", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-02-10T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 20,
            comments: 5,
          },
        ],
      },
      {
        userId: 2,
        userName: "user_2",
        activity: [
          {
            timestamp: "2025-03-10T12:00:00Z",
            action: "comment",
            postId: 102,
            likes: 15,
            comments: 8,
          },
        ],
      },
    ];

    const result = processUserActivity(input, 30);
    expect(result).toEqual([
      {
        userId: 2,
        userName: "user_2",
        totalEngagementScore: 9.9,
        activityCount: 1,
        avgLikes: 15,
        avgComments: 8,
      },
    ]);
  });

  it('should exclude "share" actions from user activity', () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-18T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 30,
            comments: 5,
          },
          {
            timestamp: "2025-03-18T13:00:00Z",
            action: "share",
            postId: 102,
            likes: 0,
            comments: 0,
          },
        ],
      },
    ];

    const result = processUserActivity(input);
    expect(result).toEqual([
      {
        userId: 1,
        userName: "user_1",
        totalEngagementScore: 16.5,
        activityCount: 1,
        avgLikes: 30,
        avgComments: 5,
      },
    ]);
  });

  it("should calculate total engagement score, average likes, and comments", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-10T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 10,
            comments: 2,
          },
          {
            timestamp: "2025-03-15T12:00:00Z",
            action: "comment",
            postId: 102,
            likes: 20,
            comments: 5,
          },
        ],
      },
    ];

    const result = processUserActivity(input);
    expect(result).toEqual([
      {
        userId: 1,
        userName: "user_1",
        totalEngagementScore: 17.1,
        activityCount: 2,
        avgLikes: 15,
        avgComments: 3.5,
      },
    ]);
  });

  it("should handle multiple users with varying activity counts and engagement scores", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 30,
            comments: 5,
          },
          {
            timestamp: "2025-03-02T13:00:00Z",
            action: "comment",
            postId: 102,
            likes: 20,
            comments: 8,
          },
        ],
      },
      {
        userId: 2,
        userName: "user_2",
        activity: [
          {
            timestamp: "2025-03-05T14:00:00Z",
            action: "like",
            postId: 103,
            likes: 40,
            comments: 10,
          },
        ],
      },
    ];

    const result = processUserActivity(input);
    expect(result).toEqual([
      {
        userId: 1,
        userName: "user_1",
        totalEngagementScore: 28.9,
        activityCount: 2,
        avgLikes: 25,
        avgComments: 6.5,
      },
      {
        userId: 2,
        userName: "user_2",
        totalEngagementScore: 23,
        activityCount: 1,
        avgLikes: 40,
        avgComments: 10,
      },
    ]);
  });

  it("should handle edge case of no valid records after filtering", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-02-01T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 20,
            comments: 5,
          },
        ],
      },
    ];

    const result = processUserActivity(input, 30);
    expect(result).toEqual([]);
  });

  it('should handle edge case with all activities being "share" actions', () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            action: "share",
            postId: 101,
            likes: 10,
            comments: 2,
          },
        ],
      },
    ];

    const result = processUserActivity(input);
    expect(result).toEqual([]);
  });

  // Type Validation Test Cases

  it("should throw an error if the data is not an array", () => {
    const input = {};
    expect(() => processUserActivity(input)).toThrowError(
      "Invalid type: data must be an array"
    );
  });

  it("should throw an error if user object is invalid (missing userId)", () => {
    const input = [
      {
        userName: "user_1", // missing userId
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            action: "like",
            postId: 101,
            likes: 10,
            comments: 2,
          },
        ],
      },
    ];

    expect(() => processUserActivity(input)).toThrowError("Invalid type");
  });

  it("should throw an error if activity object is invalid (incorrect timestamp type)", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: 1234567890, // invalid type (should be a string)
            action: "like",
            postId: 101,
            likes: 10,
            comments: 2,
          },
        ],
      },
    ];

    expect(() => processUserActivity(input)).toThrowError("Invalid type");
  });

  it("should throw an error if activity object is missing a required field (missing action)", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            postId: 101, // missing action
            likes: 10,
            comments: 2,
          },
        ],
      },
    ];

    expect(() => processUserActivity(input)).toThrowError("Invalid type");
  });

  it("should throw an error if activity object contains invalid likes type (should be a number)", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            action: "like",
            postId: 101,
            likes: "ten", // invalid type (should be a number)
            comments: 2,
          },
        ],
      },
    ];

    expect(() => processUserActivity(input)).toThrowError("Invalid type");
  });

  it("should throw an error if activity object contains invalid comments type (should be a number)", () => {
    const input = [
      {
        userId: 1,
        userName: "user_1",
        activity: [
          {
            timestamp: "2025-03-01T12:00:00Z",
            action: "comment",
            postId: 101,
            likes: 10,
            comments: "two", // invalid type (should be a number)
          },
        ],
      },
    ];

    expect(() => processUserActivity(input)).toThrowError("Invalid type");
  });
});