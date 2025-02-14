const moment = require("moment");
const mongoose = require("mongoose");

function isValidDate(date) {
  return moment(date, moment.ISO_8601, true).isValid();
}

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value) || 
         (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value));
}

function normalizeObjectId(value) {
  if (!value) return null;
  return value.toString();
}

function normalizeDate(date) {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
}

function getArrayDifferences(oldArr, newArr) {
  if (!Array.isArray(oldArr) || !Array.isArray(newArr)) return null;
  
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
  
  if (obj1 === null || obj2 === null || 
      typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => 
    keys2.includes(key) && deepEqual(obj1[key], obj2[key])
  );
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
      const arrayDiffs = getArrayDifferences(oldField || [], newField || []);
      if (arrayDiffs) {
        changes[key] = arrayDiffs;
      }
      continue;
    }

    // Handle dates
    if (isValidDate(oldField) || isValidDate(newField)) {
      if (!moment(newField).isSame(moment(oldField))) {
        changes[key] = {
          old: normalizeDate(oldField),
          new: normalizeDate(newField)
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

    // Handle nested objects
    if (typeof oldField === 'object' && typeof newField === 'object') {
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