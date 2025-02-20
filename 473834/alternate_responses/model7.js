function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error("Invalid DataSet");
  }

  dataset.forEach((record, index) => {
    if (typeof record.meterNo !== "number" || record.meterNo % 1 !== 0) {
      throw new Error(`Dataset is not valid at index ${index}: meterNo should be an integer`);
    }

    if (!Array.isArray(record.members) || record.members.length === 0) {
      throw new Error(`Dataset is not valid at index ${index}: members should be a non-empty array`);
    }

    record.members.forEach((member, memberIndex) => {
      if (typeof member.memberName !== "string") {
        throw new Error(`Dataset is not valid at index ${index}: memberName should be a string at member index ${memberIndex}`);
      }

      if (typeof member.age !== "number" || member.age % 1 !== 0) {
        throw new Error(`Dataset is not valid at index ${index}: age should be an integer at member index ${memberIndex}`);
      }

      if (!/^\$\d+k$/.test(member.Salary)) {
        throw new Error(`Dataset is not valid at index ${index}: Salary should be in the format $<number>k at member index ${memberIndex}`);
      }
    });

    if (!Array.isArray(record.adharno) || record.adharno.length !== record.members.length) {
      throw new Error(`Dataset is not valid at index ${index}: adharno should be an array of the same length as members`);
    }

    record.adharno.forEach((adhar, adharIndex) => {
      if (typeof adhar !== "string") {
        throw new Error(`Dataset is not valid at index ${index}: adharno should be a string at index ${adharIndex}`);
      }
    });

    if (!/^\d+W$/.test(record.meterReading)) {
      throw new Error(`Dataset is not valid at index ${index}: meterReading should be in the format <number>W`);
    }

    if (typeof record.floors !== "number" || record.floors % 1 !== 0) {
      throw new Error(`Dataset is not valid at index ${index}: floors should be an integer`);
    }
  });

  return dataset;
}

function billingAmount(dataset) {
  checkDataset(dataset);

  const billingAmounts = [];
  const processedMembers = new Set();

  dataset.forEach((record) => {
    const eligibleMembers = record.members.filter((member) => {
      if (member.age < 18 || member.age > 45) return false;
      if (processedMembers.has(record.adharno[record.members.indexOf(member)])) return false;
      processedMembers.add(record.adharno[record.members.indexOf(member)]);
      return true;
    });

    if (eligibleMembers.length === 0) {
      billingAmounts.push(Math.floor(record.meterReading.replace("W", "") / 10) + Math.floor(Math.floor(record.meterReading.replace("W", "") / 10) / record.floors));
    } else {
      const totalIncome = eligibleMembers.reduce((acc, member) => acc + parseInt(member.Salary.replace("$", "").replace("k", "")), 0);
      let billingMultiplier;

      if (totalIncome < 100) {
        billingMultiplier = 1;
      } else if (totalIncome < 200) {
        billingMultiplier = 2;
      } else {
        billingMultiplier = 3;
      }

      billingAmounts.push(Math.floor(record.meterReading.replace("W", "") / 10) * billingMultiplier + Math.floor((Math.floor(record.meterReading.replace("W", "") / 10) * billingMultiplier) / record.floors));
    }
  });

  return billingAmounts;
}

function billedMembers(dataset) {
  checkDataset(dataset);

  const billedMembersList = [];
  const processedMembers = new Set();

  dataset.forEach((record, index) => {
    const eligibleMembers = record.members.filter((member) => {
      if (member.age < 18 || member.age > 45) return false;
      if (processedMembers.has(record.adharno[record.members.indexOf(member)])) return false;
      processedMembers.add(record.adharno[record.members.indexOf(member)]);
      return true;
    });

    billedMembersList.push({ [`house${index + 1}`]: eligibleMembers.map((member) => member.memberName) });
  });

  return billedMembersList;
}

module.exports = { checkDataset, billingAmount, billedMembers };