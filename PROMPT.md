Base Code:
```javascript
const checkType = require("check-type");

function processUserActivity(data, windowDays = 30) {
  if (!Array.isArray(data)) {
    throw new Error("Invalid type: data must be an array");
  }

  const currentDate = new Date();
  const windowMilliseconds = windowDays * 24 * 60 * 60 * 1000;

  function validateActivityObject(activity) {
    // Make sure the expected types are strings in lowercase
    return checkType(activity).matches({
      timestamp: "string",
      action: "string",
      postId: "number",
      likes: "number",
      comments: "number",
    });
  }

  function validateUserObject(user) {
    if (
      !checkType(user).matches({
        userId: "number", // Make sure "number" is a string type
        userName: "string", // "string" is a string type
        activity: "array", // "array" is a string type
      })
    ) {
      return false;
    }
    return user.activity.every(validateActivityObject);
  }

  if (!data.every(validateUserObject)) {
    throw new Error("Invalid type");
  }

  const filteredData = data
    .filter((user) => {
      if (user.activity.length === 0) return false;

      const hasNonShareActions = user.activity.some(
        (act) => act.action !== "share"
      );
      if (!hasNonShareActions) return false;

      const recentActivity = user.activity.some((act) => {
        const activityDate = new Date(act.timestamp);
        return currentDate - activityDate <= windowMilliseconds;
      });

      return recentActivity;
    })
    .map((user) => {
      const sortedActivities = user.activity.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      const totalLikes = sortedActivities.reduce(
        (sum, act) => sum + act.likes,
        0
      );
      const totalComments = sortedActivities.reduce(
        (sum, act) => sum + act.comments,
        0
      );
      const activityCount = sortedActivities.length;

      const totalEngagementScore = totalLikes * 0.5 + totalComments * 0.3;

      return {
        userId: user.userId,
        userName: user.userName,
        totalEngagementScore,
        activityCount,
        avgLikes: activityCount > 0 ? totalLikes / activityCount : 0,
        avgComments: activityCount > 0 ? totalComments / activityCount : 0,
      };
    });

  return filteredData.sort(
    (a, b) => b.totalEngagementScore - a.totalEngagementScore
  );
}

module.exports = { processUserActivity };

```
Stack Trace:
```javascript
  processUserActivity
    ✕ should handle empty activity arrays correctly (1 ms)
    ✕ should filter out users with no recent activity
    ✕ should exclude "share" actions from user activity
    ✕ should calculate total engagement score, average likes, and comments
    ✕ should handle multiple users with varying activity counts and engagement scores
    ✕ should handle edge case of no valid records after filtering
    ✕ should handle edge case with all activities being "share" actions
    ✓ should throw an error if the data is not an array (1 ms)
    ✕ should throw an error if user object is invalid (missing userId) (9 ms)
    ✕ should throw an error if activity object is invalid (incorrect timestamp type) (1 ms)
    ✕ should throw an error if activity object is missing a required field (missing action) (1 ms)
    ✕ should throw an error if activity object contains invalid likes type (should be a number) (1 ms)
    ✕ should throw an error if activity object contains invalid comments type (should be a number) (1 ms)

  ● processUserActivity › should handle empty activity arrays correctly

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:13:20)

  ● processUserActivity › should filter out users with no recent activity

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:47:20)

  ● processUserActivity › should exclude "share" actions from user activity

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:84:20)

  ● processUserActivity › should calculate total engagement score, average likes, and comments

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:121:20)

  ● processUserActivity › should handle multiple users with varying activity counts and engagement scores

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:171:20)

  ● processUserActivity › should handle edge case of no valid records after filtering

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:209:20)

  ● processUserActivity › should handle edge case with all activities being "share" actions

    Unsupported type

      22 |   function validateUserObject(user) {
      23 |     if (
    > 24 |       !checkType(user).matches({
         |                        ^
      25 |         userId: "number", // Make sure "number" is a string type
      26 |         userName: "string", // "string" is a string type
      27 |         activity: "array", // "array" is a string type

      at d.is (node_modules/check-type/check-type.min.js:2:240)
      at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
      at node_modules/check-type/check-type.min.js:2:683
      at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
      at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
      at matches (Solution.js:24:24)
          at Array.every (<anonymous>)
      at every (Solution.js:35:13)
      at Object.processUserActivity (WordCloud.test.js:230:20)

  ● processUserActivity › should throw an error if user object is invalid (missing userId)

    expect(received).toThrowError(expected)

    Expected substring: "Invalid type"
    Received message:   "Unsupported type"

          22 |   function validateUserObject(user) {
          23 |     if (
        > 24 |       !checkType(user).matches({
             |                        ^
          25 |         userId: "number", // Make sure "number" is a string type
          26 |         userName: "string", // "string" is a string type
          27 |         activity: "array", // "array" is a string type

          at d.is (node_modules/check-type/check-type.min.js:2:240)
          at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
          at node_modules/check-type/check-type.min.js:2:683
          at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
          at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
          at matches (Solution.js:24:24)
              at Array.every (<anonymous>)
          at every (Solution.js:35:13)
          at processUserActivity (WordCloud.test.js:259:18)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:259:46)

      257 |     ];
      258 |
    > 259 |     expect(() => processUserActivity(input)).toThrowError("Invalid type");
          |                                              ^
      260 |   });
      261 |
      262 |   it("should throw an error if activity object is invalid (incorrect timestamp type)", () => {

      at Object.toThrowError (WordCloud.test.js:259:46)

  ● processUserActivity › should throw an error if activity object is invalid (incorrect timestamp type)

    expect(received).toThrowError(expected)

    Expected substring: "Invalid type"
    Received message:   "Unsupported type"

          22 |   function validateUserObject(user) {
          23 |     if (
        > 24 |       !checkType(user).matches({
             |                        ^
          25 |         userId: "number", // Make sure "number" is a string type
          26 |         userName: "string", // "string" is a string type
          27 |         activity: "array", // "array" is a string type

          at d.is (node_modules/check-type/check-type.min.js:2:240)
          at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
          at node_modules/check-type/check-type.min.js:2:683
          at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
          at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
          at matches (Solution.js:24:24)
              at Array.every (<anonymous>)
          at every (Solution.js:35:13)
          at processUserActivity (WordCloud.test.js:279:18)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:279:46)

      277 |     ];
      278 |
    > 279 |     expect(() => processUserActivity(input)).toThrowError("Invalid type");
          |                                              ^
      280 |   });
      281 |
      282 |   it("should throw an error if activity object is missing a required field (missing action)", () => {

      at Object.toThrowError (WordCloud.test.js:279:46)

  ● processUserActivity › should throw an error if activity object is missing a required field (missing action)

    expect(received).toThrowError(expected)

    Expected substring: "Invalid type"
    Received message:   "Unsupported type"

          22 |   function validateUserObject(user) {
          23 |     if (
        > 24 |       !checkType(user).matches({
             |                        ^
          25 |         userId: "number", // Make sure "number" is a string type
          26 |         userName: "string", // "string" is a string type
          27 |         activity: "array", // "array" is a string type

          at d.is (node_modules/check-type/check-type.min.js:2:240)
          at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
          at node_modules/check-type/check-type.min.js:2:683
          at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
          at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
          at matches (Solution.js:24:24)
              at Array.every (<anonymous>)
          at every (Solution.js:35:13)
          at processUserActivity (WordCloud.test.js:298:18)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:298:46)

      296 |     ];
      297 |
    > 298 |     expect(() => processUserActivity(input)).toThrowError("Invalid type");
          |                                              ^
      299 |   });
      300 |
      301 |   it("should throw an error if activity object contains invalid likes type (should be a number)", () => {

      at Object.toThrowError (WordCloud.test.js:298:46)

  ● processUserActivity › should throw an error if activity object contains invalid likes type (should be a number)

    expect(received).toThrowError(expected)

    Expected substring: "Invalid type"
    Received message:   "Unsupported type"

          22 |   function validateUserObject(user) {
          23 |     if (
        > 24 |       !checkType(user).matches({
             |                        ^
          25 |         userId: "number", // Make sure "number" is a string type
          26 |         userName: "string", // "string" is a string type
          27 |         activity: "array", // "array" is a string type

          at d.is (node_modules/check-type/check-type.min.js:2:240)
          at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
          at node_modules/check-type/check-type.min.js:2:683
          at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
          at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
          at matches (Solution.js:24:24)
              at Array.every (<anonymous>)
          at every (Solution.js:35:13)
          at processUserActivity (WordCloud.test.js:318:18)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:318:46)

      316 |     ];
      317 |
    > 318 |     expect(() => processUserActivity(input)).toThrowError("Invalid type");
          |                                              ^
      319 |   });
      320 |
      321 |   it("should throw an error if activity object contains invalid comments type (should be a number)", () => {

      at Object.toThrowError (WordCloud.test.js:318:46)

  ● processUserActivity › should throw an error if activity object contains invalid comments type (should be a number)

    expect(received).toThrowError(expected)

    Expected substring: "Invalid type"
    Received message:   "Unsupported type"

          22 |   function validateUserObject(user) {
          23 |     if (
        > 24 |       !checkType(user).matches({
             |                        ^
          25 |         userId: "number", // Make sure "number" is a string type
          26 |         userName: "string", // "string" is a string type
          27 |         activity: "array", // "array" is a string type

          at d.is (node_modules/check-type/check-type.min.js:2:240)
          at Function.d.is.not (node_modules/check-type/check-type.min.js:2:317)
          at node_modules/check-type/check-type.min.js:2:683
          at Function.Object.<anonymous>._.each._.forEach (node_modules/check-type/node_modules/underscore/underscore.js:87:22)
          at Object.d.matches (node_modules/check-type/check-type.min.js:2:651)
          at matches (Solution.js:24:24)
              at Array.every (<anonymous>)
          at every (Solution.js:35:13)
          at processUserActivity (WordCloud.test.js:338:18)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrowError] (node_modules/expect/build/index.js:320:21)
          at Object.toThrowError (WordCloud.test.js:338:46)

      336 |     ];
      337 |
    > 338 |     expect(() => processUserActivity(input)).toThrowError("Invalid type");
          |                                              ^
      339 |   });
      340 | });
      341 |

      at Object.toThrowError (WordCloud.test.js:338:46)
Test Suites: 1 failed, 1 total
Tests:       12 failed, 1 passed, 13 total
Snapshots:   0 total
Time:        0.202 s, estimated 1 s
Ran all test suites.
```

Prompt:
Please fix the bug/errors in the code as per detailed below and have the type check using `check-type` methods.


`processUserActivity` function:
-  Input Data Structure:

	 An array of objects with the following structure:

	-   `userId`: Integer, representing the unique ID of the user.
	-   `userName`: String, representing the username.
	-   `activity`: Array of objects representing individual user activities. Each activity object has:
	    -   `timestamp`: ISO 8601 date string, e.g., `"2025-03-18T08:30:00Z"`, representing the time of the activity.
	    -   `action`: String, representing the type of action the user performed (e.g., "like", "comment", "share").
	    -   `postId`: Integer, the ID of the post the user interacted with.
	    -   `likes`: Integer, the number of likes received for that post at the time of the action.
	    -   `comments`: Integer, the number of comments received for that post at the time of the action.
        - if the type of the fields in the structure is not valid type as defined then raise error ,"Invalid type"

Logic:

1.  **Filter the Records**:
    
    -   filter out records where the `activity` array is empty or contains only "share" actions.
    -   Filter out users who have no interactions in the last 30 days from the current date.
2.  **Group Activities by User**:
    
    -   Group the activities by `userId` and aggregate the activities into a list of actions performed by each user. Each group should be sorted by `timestamp` in ascending order.
3.  **Calculate User Engagement**:
    
    -   Calculate the total `likes` and `comments` across all activities for each user, and calculate an average engagement score for each user as:
        -   `engagement_score = (total_likes * 0.5) + (total_comments * 0.3)`
4.  **Summarize User Activity(Taking the filtered dataset)**:
    
    -   For each user, return an object that contains:
        -   `userId`
        -   `userName`
        -   `totalEngagementScore`
        -   `activityCount`: The number of activities the user performed.
        -   `avgLikes`: The average number of likes per activity.
        -   `avgComments`: The average number of comments per activity.
5.  **Sort the Users**:
    
    -   Return the list of users sorted by `totalEngagementScore` in descending order.
6.  **Return the Output**:
    
    -   The output should be an array of objects, each representing a user and their summarized activity statistics.

Here is Summarize User Activity test case which is failing:
```javascript
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
```