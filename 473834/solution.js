function checkDataset(dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
      throw new Error("Dataset is not valid");
  }

  const meterNumbers = new Set();
  
  dataset.forEach(house => {
      // Check if all required properties exist
      if (!house.meterNo || !house.members || !house.adharno || 
          !house.meterReading || !house.floors || typeof house.meterNo !== 'number' ) {
          throw new Error("Dataset is not valid");
      }

      // Check meter number uniqueness and type
      if (meterNumbers.has(house.meterNo)) {
          throw new Error("Meter number cant be same");
      }
      meterNumbers.add(house.meterNo);

      // Check members array
      if (!Array.isArray(house.members) || house.members.length === 0) {
          throw new Error("Dataset is not valid");
      }

      // Check adharno array
      if (!Array.isArray(house.adharno) || 
          house.adharno.length !== house.members.length) {
          throw new Error("Dataset is not valid");
      }

      // Validate members data
      house.members.forEach(member => {
          if (typeof member.memberName !== 'string' ||
              typeof member.age !== 'number' ||
              !/^\$\d+k$/i.test(member.Salary)) {
              throw new Error("Dataset is not valid");
          }
      });

      // Validate adharno elements
      if (!house.adharno.every(no => typeof no === 'string')) {
          throw new Error("Dataset is not valid");
      }

      // Validate meterReading format
      if (!/^\d+W$/.test(house.meterReading)) {
          throw new Error("Dataset is not valid");
      }

      // Validate floors
      if (typeof house.floors !== 'number') {
          throw new Error("Dataset is not valid");
      }
  });

  return dataset;
}

function billingAmount(dataset) {
  const validatedDataset = checkDataset(dataset);
  const processedAdharNos = new Set();
  const billingAmounts = [];

  for (const house of validatedDataset) {
      let totalIncome = 0;
      const watts = parseInt(house.meterReading);
      
      // Calculate total income considering eligible members
      house.members.forEach((member, index) => {
          if (member.age >= 18 && member.age <= 45 && 
              !processedAdharNos.has(house.adharno[index])) {
              totalIncome += parseInt(member.Salary.slice(1, -1));
              processedAdharNos.add(house.adharno[index]);
          }
      });

      // Calculate base billing amount
      let ratePerTenWatts;
      if (totalIncome === 0) {
          ratePerTenWatts = 1; // Default billing
      } else if (totalIncome < 100) {
          ratePerTenWatts = 1;
      } else if (totalIncome < 200) {
          ratePerTenWatts = 2;
      } else {
          ratePerTenWatts = 3;
      }

      const baseBilling = Math.floor(watts / 10) * ratePerTenWatts;
      const floorCharge = Math.floor(baseBilling / house.floors);
      
      billingAmounts.push(baseBilling + floorCharge);
  }

  return billingAmounts;
}

function billedMembers(dataset) {
  const validatedDataset = checkDataset(dataset);
  const processedAdharNos = new Set();
  const result = [];

  validatedDataset.forEach((house, index) => {
      const eligibleMembers = [];
      
      house.members.forEach((member, memberIndex) => {
          if (member.age >= 18 && member.age <= 45 && 
              !processedAdharNos.has(house.adharno[memberIndex])) {
              eligibleMembers.push(member.memberName);
              processedAdharNos.add(house.adharno[memberIndex]);
          }
      });

      result.push({ [`house${index + 1}`]: eligibleMembers });
  });

  return result;
}

module.exports = { checkDataset, billingAmount, billedMembers };