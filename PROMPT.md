Base Code:
```javascript
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
      if (!deepEqual(oldField, newField)) {
        changes[key] = { old: oldField, new: newField };
      }
      continue;
    }

    if (oldField !== newField) {
      if (key.toLowerCase().endsWith("id")) {
        if (String(oldField) !== String(newField)) {
          changes[key] = { old: oldField.toString(), new: newField };
        }
        continue;
      }
      if (key.toLowerCase().endsWith("date")) {
        if (
          !moment(newField)
            .startOf("day")
            .isSame(moment(oldField).startOf("day"))
        ) {
          changes[key] = {
            old: moment(oldField).format("YYYY-MM-DD"),
            new: moment(newField).format("YYYY-MM-DD"),
          };
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
```

Prompt:
The getChangedFields is a util I use to get changes in a document. It should produce accurate new and old values since I expect to use it to achieve something human-readable for the user, such as "age was changed from 24 to 27".

Right now, it works for many things, and I realise it probably would not work for some others, such as:
- dates in various formats
- date fields whose names don't end with "date"
- mongoose ids (such as when old value is nothing and new value is passed as string, and when the field name does not end with id, etc),
- when nothing is sent at all in the new

Also, I'd like for it to 
- return only changed items when an array is modified (use `added` or `removed` as keys instead of `old` and `new`)