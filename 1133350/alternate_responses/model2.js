const moment = require("moment");
const mongoose = require("mongoose");

function isValidDate(value) {
  return moment(value).isValid();
}

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function formatDate(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function normalizeObjectId(value) {
  if (!value) return null;
  try {
    return value.toString();
  } catch (e) {
    return null;
  }
}

function compareArrays(oldArr, newArr) {
  if (!Array.isArray(oldArr)) oldArr = [];
  if (!Array.isArray(newArr)) newArr = [];

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
  // Handle null/undefined cases
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;

  // Handle dates
  if (isValidDate(obj1) && isValidDate(obj2)) {
    return moment(obj1).isSame(moment(obj2));
  }

  // Handle ObjectIds
  if (isObjectId(obj1) || isObjectId(obj2)) {
    return normalizeObjectId(obj1) === normalizeObjectId(obj2);
  }

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return obj1.length === obj2.length &&
           obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
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
  const oldData = document.toObject ? document.toObject() : document;
  const fieldsToCheck = fields.length > 0 ? fields : Object.keys(newData);

  for (const key of fieldsToCheck) {
    const newField = newData[key];
    const oldField = oldData[key];

    // Skip if both values are undefined/null
    if (!newField && !oldField) continue;

    // Handle arrays
    if (Array.isArray(oldField) || Array.isArray(newField)) {
      const arrayChanges = compareArrays(oldField, newField);
      if (arrayChanges) {
        changes[key] = arrayChanges;
      }
      continue;
    }

    // Handle dates
    if (isValidDate(oldField) || isValidDate(newField)) {
      if (!moment(oldField).isSame(moment(newField))) {
        changes[key] = {
          old: oldField ? formatDate(oldField) : null,
          new: newField ? formatDate(newField) : null
        };
      }
      continue;
    }

    // Handle ObjectIds
    if (isObjectId(oldField) || isObjectId(newField)) {
      const oldId = normalizeObjectId(oldField);
      const newId = normalizeObjectId(newField);
      if (oldId !== newId) {
        changes[key] = { old: oldId, new: newId };
      }
      continue;
    }

    // Handle objects (nested comparison)
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