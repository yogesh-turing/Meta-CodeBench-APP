function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
      throw new Error("Invalid DataSet");
  }

  const processedMeters = new Set();

  for (const house of dataset) {
      // Check if all required properties exist
      if (!house.meterNo || !house.members || !house.meterReading || 
          !house.floors || !house.adharno) {
          throw new Error("Dataset is not valid");
      }

      // Check meter number uniqueness and type
      if (typeof house.meterNo !== 'number' || processedMeters.has(house.meterNo)) {
          throw new Error("Meter number cant be same");
      }
      processedMeters.add(house.meterNo);

      // Validate members array and its properties
      if (!Array.isArray(house.members)) {
          throw new Error("Dataset is not valid");
      }

      // Check if adharno list length matches members length
      if (!Array.isArray(house.adharno) || house.adharno.length !== house.members.length) {
          throw new Error("Dataset is not valid");
      }

      // Validate each member's data
      for (const member of house.members) {
          if (typeof member.memberName !== 'string' ||
              typeof member.age !== 'number' ||
              !member.Salary.match(/^\$\d+[kK]$/)) {
              throw new Error("Dataset is not valid");
          }
      }

      // Validate adharno elements
      for (const adhar of house.adharno) {
          if (typeof adhar !== 'string') {
              throw new Error("Dataset is not valid");
          }
      }

      // Validate meterReading format
      if (!house.meterReading.match(/^\d+W$/)) {
          throw new Error("Dataset is not valid");
      }

      // Validate floors
      if (typeof house.floors !== 'number') {
          throw new Error("Dataset is not valid");
      }
  }

  return dataset;
}

function billingAmount(dataset) {
  checkDataset(dataset);
  const processedAdharNos = new Set();
  const billingAmounts = [];

  for (let i = 0; i < dataset.length; i++) {
      const house = dataset[i];
      let totalIncome = 0;
      let eligibleMembers = false;

      // Calculate total income considering only eligible members
      for (let j = 0; j < house.members.length; j++) {
          const member = house.members[j];
          const adharNo = house.adharno[j];

          if (member.age >= 18 && member.age <= 45 && !processedAdharNos.has(adharNo)) {
              eligibleMembers = true;
              const salary = parseInt(member.Salary.replace(/[\$k]/gi, '')) * 1000;
              totalIncome += salary;
              processedAdharNos.add(adharNo);
          }
      }

      // Get wattage from meter reading
      const watts = parseInt(house.meterReading);
      let baseAmount;

      if (!eligibleMembers) {
          baseAmount = Math.floor(watts / 10);
      } else if (totalIncome < 100000) {
          baseAmount = Math.floor(watts / 10);
      } else if (totalIncome >= 100000 && totalIncome < 200000) {
          baseAmount = Math.floor(watts / 10) * 2;
      } else {
          baseAmount = Math.floor(watts / 10) * 3;
      }

      // Add floor charges
      const floorCharge = Math.floor(baseAmount / house.floors);
      billingAmounts.push(baseAmount + floorCharge);
  }

  return billingAmounts;
}

function billedMembers(dataset) {
  const processedAdharNos = new Set();
  const result = [];

  for (let i = 0; i < dataset.length; i++) {
      const house = dataset[i];
      const eligibleMembers = [];

      for (let j = 0; j < house.members.length; j++) {
          const member = house.members[j];
          const adharNo = house.adharno[j];

          if (member.age >= 18 && member.age <= 45 && !processedAdharNos.has(adharNo)) {
              eligibleMembers.push(member.memberName);
              processedAdharNos.add(adharNo);
          }
      }

      result.push({ [`house${i + 1}`]: eligibleMembers });
  }

  return result;
}

module.exports = { checkDataset, billingAmount, billedMembers };