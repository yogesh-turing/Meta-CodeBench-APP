const moment = require("moment");
const mongoose = require("mongoose");

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

function isValidObjectId(value) {
  return (
    typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value) // Ensure it's a 24-character hex string
  );
}

function isDate(value) {
  return (
    moment(value, moment.ISO_8601, true).isValid() ||
    moment(value, "YYYY-MM-DD", true).isValid() ||
    moment(value, "MM/DD/YYYY", true).isValid() ||
    moment(value, "DD-MM-YYYY", true).isValid()
  );
}

function getChangedFields(newData, document, fields = []) {
  if (!newData || Object.keys(newData).length === 0) {
    return {};
  }

  const changes = {};
  const docObject = document.toObject();

  for (const key of fields.length > 0 ? fields : Object.keys(newData)) {
    const newField = newData[key];
    const oldField = docObject[key];

    if (newField === undefined) continue;

    // Handle Mongoose ObjectIds safely
    if (
      (mongoose.isObjectIdOrHexString(oldField) || isValidObjectId(oldField)) &&
      (mongoose.isObjectIdOrHexString(newField) || isValidObjectId(newField))
    ) {
      if (String(oldField || "") !== String(newField)) {
        changes[key] = {
          old: oldField ? oldField.toString() : null,
          new: newField,
        };
      }
      continue;
    }

    // Handle Date Fields (Even if they don't end with "date")
    if (isDate(newField) && isDate(oldField)) {
      const oldFormatted = moment(oldField).format("YYYY-MM-DD");
      const newFormatted = moment(newField).format("YYYY-MM-DD");

      if (oldFormatted !== newFormatted) {
        changes[key] = { old: oldFormatted, new: newFormatted };
      }
      continue;
    }

    // Handle Arrays (Only return added/removed)
    if (Array.isArray(oldField) && Array.isArray(newField)) {
      const added = newField.filter((item) => !oldField.includes(item));
      const removed = oldField.filter((item) => !newField.includes(item));

      if (added.length || removed.length) {
        changes[key] = {};
        if (added.length) changes[key]["added"] = added;
        if (removed.length) changes[key]["removed"] = removed;
      }
      continue;
    }

    // Handle Nested Objects
    if (typeof oldField === "object" && typeof newField === "object") {
      if (!deepEqual(oldField, newField)) {
        changes[key] = { old: oldField, new: newField };
      }
      continue;
    }

    // Handle Primitives
    if (oldField !== newField) {
      changes[key] = { old: oldField, new: newField };
    }
  }
  return changes;
}

module.exports = { getChangedFields };