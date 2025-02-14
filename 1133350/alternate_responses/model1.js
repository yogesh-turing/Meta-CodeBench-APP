const moment = require("moment");
const mongoose = require("mongoose");

function isValidDate(value) {
  return moment(value, moment.ISO_8601, true).isValid();
}

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value) || 
         (typeof value === 'object' && value?._bsontype === "ObjectID");
}

function formatDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

function normalizeObjectId(value) {
  if (!value) return null;
  return value.toString();
}

function compareArrays(newArr, oldArr) {
  if (!Array.isArray(newArr) || !Array.isArray(oldArr)) return null;

  const added = newArr.filter(item => !oldArr.some(oldItem => 
    deepEqual(item, oldItem)
  ));
  
  const removed = oldArr.filter(item => !newArr.some(newItem => 
    deepEqual(item, newItem)
  ));

  if (added.length === 0 && removed.length === 0) return null;

  const changes = {};
  if (added.length > 0) changes.added = added;
  if (removed.length > 0) changes.removed = removed;
  return changes;
}

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
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

function getChangedFields(newData, document, fields = []) {
  const changes = {};
  const oldData = document.toObject();
  const keysToCheck = fields.length > 0 ? fields : Object.keys(newData);

  for (const key of keysToCheck) {
    const newField = newData[key];
    const oldField = oldData[key];

    // Skip if both values are undefined/null
    if (!newField && !oldField) continue;

    // Handle arrays
    if (Array.isArray(oldField) || Array.isArray(newField)) {
      const arrayChanges = compareArrays(newField, oldField);
      if (arrayChanges) {
        changes[key] = arrayChanges;
      }
      continue;
    }

    // Handle dates
    if (isValidDate(oldField) || isValidDate(newField)) {
      const oldDate = moment(oldField);
      const newDate = moment(newField);
      
      if (!newDate.startOf('day').isSame(oldDate.startOf('day'))) {
        changes[key] = {
          old: oldField ? formatDate(oldField) : null,
          new: newField ? formatDate(newField) : null
        };
      }
      continue;
    }

    // Handle ObjectIds
    if (isObjectId(oldField) || isObjectId(newField)) {
      const normalizedOld = normalizeObjectId(oldField);
      const normalizedNew = normalizeObjectId(newField);
      
      if (normalizedOld !== normalizedNew) {
        changes[key] = {
          old: normalizedOld,
          new: normalizedNew
        };
      }
      continue;
    }

    // Handle objects (recursive comparison)
    if (typeof oldField === "object" && typeof newField === "object") {
      if (!deepEqual(oldField, newField)) {
        changes[key] = { old: oldField, new: newField };
      }
      continue;
    }

    // Handle primitive values
    if (oldField !== newField) {
      changes[key] = { old: oldField, new: newField };
    }
  }

  return changes;
}

module.exports = { getChangedFields };