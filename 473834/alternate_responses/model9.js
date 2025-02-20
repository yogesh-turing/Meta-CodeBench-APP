function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error("Invalid DataSet");
  }

  dataset.forEach((house, index) => {
    if (typeof house.meterNo !== "number" || house.meterNo % 1 !== 0) {
      throw new Error("Dataset is not valid");
    }

    if (!Array.isArray(house.members) || house.members.length === 0) {
      throw new Error("Dataset is not valid");
    }

    house.members.forEach((member) => {
      if (typeof member.memberName !== "string") {
        throw new Error("Dataset is not valid");
      }

      if (typeof member.age !== "number" || member.age % 1 !== 0) {
        throw new Error("Dataset is not valid");
      }

      if (!/^\$\d+k$/.test(member.Salary)) {
        throw new Error("Dataset is not valid");
      }
    });

    if (!Array.isArray(house.adharno) || house.adharno.length !== house.members.length) {
      throw new Error("Dataset is not valid");
    }

    house.adharno.forEach((adhar) => {
      if (typeof adhar !== "string") {
        throw new Error("Dataset is not valid");
      }
    });

    if (!/^\d+W$/.test(house.meterReading)) {
      throw new Error("Dataset is not valid");
    }

    if (typeof house.floors !== "number" || house.floors % 1 !== 0) {
      throw new Error("Dataset is not valid");
    }

    if (dataset.findIndex((h) => h.meterNo === house.meterNo) !== index) {
      throw new Error("Meter number cant be same");
    }
  });

  return dataset;
}

function billingAmount(dataset) {
  checkDataset(dataset);

  const billedMembers = {};
  const billingAmounts = [];

  dataset.forEach((house, index) => {
    const eligibleMembers = house.members.filter((member) => member.age >= 18 && member.age <= 45);

    if (eligibleMembers.length === 0) {
      billingAmounts.push(Math.floor(house.meterReading.replace("W", "") / 10) + Math.floor(Math.floor(house.meterReading.replace("W", "") / 10) / house.floors));
    } else {
      const totalIncome = eligibleMembers.reduce((acc, member) => acc + parseInt(member.Salary.replace("$", "").replace("k", "")), 0);

      let rate;
      if (totalIncome < 100) {
        rate = 1;
      } else if (totalIncome < 200) {
        rate = 2;
      } else {
        rate = 3;
      }

      const billingAmount = Math.floor(house.meterReading.replace("W", "") / 10) * rate + Math.floor(Math.floor(house.meterReading.replace("W", "") / 10) * rate / house.floors);
      billingAmounts.push(billingAmount);
    }

    billedMembers[`house${index + 1}`] = eligibleMembers.map((member) => member.memberName);
  });

  return billingAmounts;
}

function billedMembers(dataset) {
  checkDataset(dataset);

  const billedMembers = {};

  dataset.forEach((house, index) => {
    const eligibleMembers = house.members.filter((member) => member.age >= 18 && member.age <= 45);

    billedMembers[`house${index + 1}`] = eligibleMembers.map((member) => member.memberName);
  });

  return Object.keys(billedMembers).map((key) => ({ [key]: billedMembers[key] }));
}

module.exports = { checkDataset, billingAmount, billedMembers };