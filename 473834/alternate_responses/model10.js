function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error("Invalid DataSet");
  }

  dataset.forEach((record, index) => {
    if (typeof record.meterNo !== "number" || record.meterNo <= 0) {
      throw new Error(`Meter number should be a positive integer at index ${index}`);
    }

    if (!Array.isArray(record.members) || record.members.length === 0) {
      throw new Error(`Members list should not be empty at index ${index}`);
    }

    record.members.forEach((member) => {
      if (typeof member.memberName !== "string") {
        throw new Error(`Member name should be a string at index ${index}`);
      }

      if (typeof member.age !== "number" || member.age < 0) {
        throw new Error(`Age should be a non-negative integer at index ${index}`);
      }

      if (!/^\$\d+k$/.test(member.Salary)) {
        throw new Error(`Salary should be in the format $Xk at index ${index}`);
      }
    });

    if (!/^\d+W$/.test(record.meterReading)) {
      throw new Error(`Meter reading should be in the format XW at index ${index}`);
    }

    if (typeof record.floors !== "number" || record.floors <= 0) {
      throw new Error(`Number of floors should be a positive integer at index ${index}`);
    }

    if (!Array.isArray(record.adharno) || record.adharno.length !== record.members.length) {
      throw new Error(`Adhar number list should be an array of strings and match the length of members list at index ${index}`);
    }

    record.adharno.forEach((adhar) => {
      if (typeof adhar !== "string") {
        throw new Error(`Adhar number should be a string at index ${index}`);
      }
    });
  });

  return dataset;
}

function billingAmount(dataset) {
  checkDataset(dataset);

  const billedMembers = billedMembers(dataset);
  const billingAmounts = [];

  dataset.forEach((record, index) => {
    const eligibleMembers = billedMembers[index][`house${index + 1}`];
    let totalIncome = 0;

    eligibleMembers.forEach((memberName) => {
      const member = record.members.find((member) => member.memberName === memberName);
      totalIncome += parseInt(member.Salary.slice(1, -1), 10) * 1000;
    });

    let billingRate;
    if (totalIncome < 100000) {
      billingRate = 1;
    } else if (totalIncome < 200000) {
      billingRate = 2;
    } else {
      billingRate = 3;
    }

    const meterReading = parseInt(record.meterReading.slice(0, -1), 10);
    const billingAmount = Math.floor(meterReading / 10) * billingRate;
    const additionalCharges = Math.floor(billingAmount / record.floors);

    billingAmounts.push(billingAmount + additionalCharges);
  });

  return billingAmounts;
}

function billedMembers(dataset) {
  const billedMembers = [];

  dataset.forEach((record, index) => {
    const eligibleMembers = [];

    record.members.forEach((member) => {
      if (member.age >= 18 && member.age <= 45) {
        eligibleMembers.push(member.memberName);
      }
    });

    const processedMembers = [];

    if (index > 0) {
      for (let i = 0; i < index; i++) {
        processedMembers.push(...billedMembers[i][`house${i + 1}`]);
      }
    }

    const filteredMembers = eligibleMembers.filter((member) => {
      const adharIndex = record.members.findIndex((m) => m.memberName === member);
      const adharNumber = record.adharno[adharIndex];

      return !processedMembers.includes(member) || !dataset.slice(0, index).some((prevRecord) => prevRecord.adharno.includes(adharNumber));
    });

    billedMembers.push({ [`house${index + 1}`]: filteredMembers });
  });

  return billedMembers;
}

module.exports = { checkDataset, billingAmount, billedMembers };