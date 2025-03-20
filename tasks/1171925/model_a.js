const checkType = require("check-type");

function processUserActivity(data, windowDays = 30) {
  if (!checkType(data).is("array")) {
    throw new Error("Invalid type: data must be an array");
  }

  const currentDate = new Date();
  const windowMilliseconds = windowDays * 24 * 60 * 60 * 1000;

  function validateActivityObject(activity) {
    if (!checkType(activity).is("object")) return false;

    const isValidTimestamp = checkType(activity.timestamp).is("string") && !isNaN(Date.parse(activity.timestamp));
    const isValidAction = checkType(activity.action).is("string");
    const isValidPostId = checkType(activity.postId).is("number");
    const isValidLikes = checkType(activity.likes).is("number");
    const isValidComments = checkType(activity.comments).is("number");

    if (!isValidTimestamp || !isValidAction || !isValidPostId || !isValidLikes || !isValidComments) {
      throw new Error("Invalid type");
    }

    return true;
  }

  function validateUserObject(user) {
    if (!checkType(user).is("object")) return false;

    const isValidUserId = checkType(user.userId).is("number");
    const isValidUserName = checkType(user.userName).is("string");
    const isValidActivity = checkType(user.activity).is("array");

    if (!isValidUserId || !isValidUserName || !isValidActivity) {
      throw new Error("Invalid type");
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
      const nonShareActivities = user.activity.filter(act => act.action !== "share");
      const sortedActivities = nonShareActivities.sort(
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