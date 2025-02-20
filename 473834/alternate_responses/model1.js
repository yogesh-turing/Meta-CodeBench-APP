function checkDataset(dataset) {
    if (!Array.isArray(dataset) || dataset.length === 0) {
      throw new Error("Invalid DataSet");
    }
  
    const meterNumbers = new Set();
  
    for (const house of dataset) {
      // Check meter number
      if (!Number.isInteger(house.meterNo)) {
        throw new Error("Dataset is not valid");
      }
      
      if (meterNumbers.has(house.meterNo)) {
        throw new Error("Meter number cant be same");
      }
      meterNumbers.add(house.meterNo);
  
      // Check members array
      if (!Array.isArray(house.members)) {
        throw new Error("Dataset is not valid");
      }
  
      // Check adharno array
      if (!Array.isArray(house.adharno) || house.adharno.length !== house.members.length) {
        throw new Error("Dataset is not valid");
      }
  
      // Validate each member
      for (const member of house.members) {
        if (typeof member.memberName !== 'string' ||
            !Number.isInteger(member.age) ||
            !/^\$\d+[kK]$/.test(member.Salary)) {
          throw new Error("Dataset is not valid");
        }
      }
  
      // Check adharno elements
      for (const adhar of house.adharno) {
        if (typeof adhar !== 'string') {
          throw new Error("Dataset is not valid");
        }
      }
  
      // Check meterReading
      if (!/^\d+W$/.test(house.meterReading)) {
        throw new Error("Dataset is not valid");
      }
  
      // Check floors
      if (!Number.isInteger(house.floors)) {
        throw new Error("Dataset is not valid");
      }
    }
  
    return dataset;
  }
  
  function billingAmount(dataset) {
    checkDataset(dataset);
    const processedAdharNumbers = new Set();
    const billingAmounts = [];
  
    for (const house of dataset) {
      const watts = parseInt(house.meterReading);
      let totalIncome = 0;
      let eligibleMembersExist = false;
  
      // Calculate total income of eligible members
      for (let i = 0; i < house.members.length; i++) {
        const member = house.members[i];
        const adhar = house.adharno[i];
  
        if (member.age >= 18 && member.age <= 45 && !processedAdharNumbers.has(adhar)) {
          eligibleMembersExist = true;
          const salary = parseInt(member.Salary.replace(/[\$k]/gi, '')) * 1000;
          totalIncome += salary;
          processedAdharNumbers.add(adhar);
        }
      }
  
      // Calculate billing amount
      let baseAmount;
      if (!eligibleMembersExist) {
        baseAmount = Math.floor(watts / 10);
      } else {
        if (totalIncome < 100000) {
          baseAmount = Math.floor(watts / 10);
        } else if (totalIncome >= 100000 && totalIncome < 200000) {
          baseAmount = Math.floor(watts / 10) * 2;
        } else {
          baseAmount = Math.floor(watts / 10) * 3;
        }
      }
  
      // Add floor charges
      const floorCharge = Math.floor(baseAmount / house.floors);
      billingAmounts.push(baseAmount + floorCharge);
    }
  
    return billingAmounts;
  }
  
  function billedMembers(dataset) {
    const processedAdharNumbers = new Set();
    const result = [];
  
    for (let i = 0; i < dataset.length; i++) {
      const house = dataset[i];
      const eligibleMembers = [];
  
      for (let j = 0; j < house.members.length; j++) {
        const member = house.members[j];
        const adhar = house.adharno[j];
  
        if (member.age >= 18 && member.age <= 45 && !processedAdharNumbers.has(adhar)) {
          eligibleMembers.push(member.memberName);
          processedAdharNumbers.add(adhar);
        }
      }
  
      result.push({ [`house${i + 1}`]: eligibleMembers });
    }
  
    return result;
  }
  
  module.exports = { checkDataset, billingAmount, billedMembers };