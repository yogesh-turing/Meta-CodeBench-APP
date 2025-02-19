const moment = require("moment");

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function getChangedFields(newData, document, fields = []) {
  const changes = {};

  for (const key of fields.length > 0 ? fields : Object.keys(newData)) {
    const newField = newData[key];
    const oldField = document.toObject()[key];

    if (typeof oldField === "object" && typeof newField === "object") {
      if (Array.isArray(oldField) && Array.isArray(newField)) {
        const added = newField.filter(item => !oldField.includes(item));
        const removed = oldField.filter(item => !newField.includes(item));
        if (added.length > 0 || removed.length > 0) {
          changes[key] = { added, removed };
        }
        continue;
      }
      if (!deepEqual(oldField, newField)) {
        changes[key] = { old: oldField, new: newField };
      }
      continue;
    }

    if (oldField !== newField) {
      if (moment.isMoment(newField) || moment.isDate(newField)) {
        if (!moment(oldField).isSame(newField)) {
          changes[key] = {
            old: moment(oldField).format("YYYY-MM-DD"),
            new: moment(newField).format("YYYY-MM-DD"),
          };
          continue;
        }
      } else if (typeof newField === "string" && moment(newField, moment.ISO_8601, true).isValid()) {
        if (!moment(oldField).isSame(newField)) {
          changes[key] = {
            old: moment(oldField).format("YYYY-MM-DD"),
            new: moment(newField).format("YYYY-MM-DD"),
          };
          continue;
        }
      } else if (typeof newField === "string" && mongoose.Types.ObjectId.isValid(newField)) {
        if (String(oldField) !== String(newField)) {
          changes[key] = { old: oldField.toString(), new: newField };
          continue;
        }
      } else {
        changes[key] = { old: oldField, new: newField };
      }
    }
  }
  return changes;
}

module.exports = { getChangedFields };