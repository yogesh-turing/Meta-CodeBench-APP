const checkType = require("check-type");

function processUserActivity(data, windowDays = 30) {
  if (!Array.isArray(data)) {
    throw new Error("Invalid type: data must be an array");
  }

  const currentDate = new Date();
  const windowMilliseconds = windowDays * 24 * 60 * 60 * 1000;

  function validateActivityObject(activity) {
    return (
      checkType(activity).is("object") &&
      checkType(activity.timestamp).is("string") &&
      checkType(activity.action).is("string") &&
      checkType(activity.postId).is("number") &&
      checkType(activity.likes).is("number") &&
      checkType(activity.comments).is("number")
    );
  }

  function validateUserObject(user) {
    return (
      checkType(user).is("object") &&
      checkType(user.userId).is("number") &&
      checkType(user.userName).is("string") &&
      checkType(user.activity).is("array") &&
      user.activity.every(validateActivityObject)
    );
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
      const sortedActivities = user.activity
        .filter((act) => act.action !== "share")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

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