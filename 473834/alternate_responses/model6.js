function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error("Invalid DataSet");
  }

  dataset.forEach((record, index) => {
    if (typeof record.meterNo !== "number" || !Number.isInteger(record.meterNo)) {
      throw new Error("Dataset is not valid");
    }

    if (!Array.isArray(record.members) || record.members.length === 0) {
      throw new Error("Dataset is not valid");
    }

    record.members.forEach((member) => {
      if (typeof member.memberName !== "string") {
        throw new Error("Dataset is not valid");
      }

      if (typeof member.age !== "number" || !Number.isInteger(member.age)) {
        throw new Error("Dataset is not valid");
      }

      if (!/^\$\d+k$/.test(member.Salary)) {
        throw new Error("Dataset is not valid");
      }
    });

    if (!/^\d+W$/.test(record.meterReading)) {
      throw new Error("Dataset is not valid");
    }

    if (typeof record.floors !== "number" || !Number.isInteger(record.floors)) {
      throw new Error("Dataset is not valid");
    }

    if (!Array.isArray(record.adharno) || record.adharno.length !== record.members.length) {
      throw new Error("Dataset is not valid");
    }

    record.adharno.forEach((adhar) => {
      if (typeof adhar !== "string") {
        throw new Error("Dataset is not valid");
      }
    });
  });

  // Check for duplicate meter numbers
  const meterNumbers = dataset.map((record) => record.meterNo);
  if (new Set(meterNumbers).size !== meterNumbers.length) {
    throw new Error("Meter number cant be same");
  }

  return dataset;
}

function billingAmount(dataset) {
  checkDataset(dataset);

  const billingAmounts = dataset.map((record, index) => {
    const eligibleMembers = record.members.filter((member) => member.age >= 18 && member.age <= 45);

    // Check if all members have an age outside the range of 18 to 45 (inclusive)
    if (eligibleMembers.length === 0) {
      console.log(`House ${index + 1}: Not applicable for scheme`);
    }

    const totalMonthlyIncome = eligibleMembers.reduce((acc, member) => {
      const salary = parseInt(member.Salary.slice(1, -1), 10) * 1000;
      return acc + salary;
    }, 0);

    let billingAmount;
    if (totalMonthlyIncome < 100000) {
      billingAmount = parseInt(record.meterReading.slice(0, -1), 10) / 10;
    } else if (totalMonthlyIncome < 200000) {
      billingAmount = (parseInt(record.meterReading.slice(0, -1), 10) / 10) * 2;
    } else {
      billingAmount = (parseInt(record.meterReading.slice(0, -1), 10) / 10) * 3;
    }

    const additionCharges = Math.floor(billingAmount / record.floors);
    billingAmount += additionCharges;

    return billingAmount;
  });

  return billingAmounts;
}

function billedMembers(dataset) {
  checkDataset(dataset);

  const processedMembers = {};

  const billedMembers = dataset.map((record, index) => {
    const eligibleMembers = record.members.filter((member) => member.age >= 18 && member.age <= 45);

    const membersToConsider = eligibleMembers.filter((member, memberIndex) => {
      const adhar = record.adharno[memberIndex];
      if (processedMembers[adhar]) {
        return false;
      }
      processedMembers[adhar] = true;
      return true;
    });

    return { [`house${index + 1}`]: membersToConsider.map((member) => member.memberName) };
  });

  return billedMembers;
}

module.exports = { checkDataset, billingAmount, billedMembers };