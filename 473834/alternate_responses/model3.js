function checkDataset(dataset) {
    if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error("Invalid DataSet");
    }

    const meterNumbers = new Set();

    for (const house of dataset) {
        // Check if all required properties exist
        if (!house.meterNo || !house.members || !house.adharno || 
            !house.meterReading || !house.floors) {
            throw new Error("Dataset is not valid");
        }

        // Check meter number uniqueness and type
        if (typeof house.meterNo !== 'number' || meterNumbers.has(house.meterNo)) {
            throw new Error("Meter number cant be same");
        }
        meterNumbers.add(house.meterNo);

        // Validate members array and adharno array length match
        if (!Array.isArray(house.members) || !Array.isArray(house.adharno) || 
            house.members.length !== house.adharno.length) {
            throw new Error("Dataset is not valid");
        }

        // Validate members data
        for (const member of house.members) {
            if (typeof member.memberName !== 'string' ||
                typeof member.age !== 'number' ||
                !member.Salary.match(/^\$\d+[kK]$/)) {
                throw new Error("Dataset is not valid");
            }
        }

        // Validate meter reading format
        if (!house.meterReading.match(/^\d+W$/)) {
            throw new Error("Dataset is not valid");
        }

        // Validate floors
        if (typeof house.floors !== 'number') {
            throw new Error("Dataset is not valid");
        }

        // Validate adharno elements are strings
        if (!house.adharno.every(no => typeof no === 'string')) {
            throw new Error("Dataset is not valid");
        }
    }

    return dataset;
}

function billingAmount(dataset) {
    checkDataset(dataset);
    const processedAdhars = new Set();
    const billingAmounts = [];

    for (const house of dataset) {
        const watts = parseInt(house.meterReading);
        let totalIncome = 0;
        let eligibleMembers = false;

        // Calculate total income from eligible members
        for (let i = 0; i < house.members.length; i++) {
            const member = house.members[i];
            const adhar = house.adharno[i];

            if (member.age >= 18 && member.age <= 45 && !processedAdhars.has(adhar)) {
                eligibleMembers = true;
                processedAdhars.add(adhar);
                totalIncome += parseInt(member.Salary.replace(/[\$k]/gi, '')) * 1000;
            }
        }

        let baseAmount;
        if (!eligibleMembers) {
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
    const processedAdhars = new Set();
    const result = [];

    for (let i = 0; i < dataset.length; i++) {
        const house = dataset[i];
        const eligibleMembers = [];

        for (let j = 0; j < house.members.length; j++) {
            const member = house.members[j];
            const adhar = house.adharno[j];

            if (member.age >= 18 && member.age <= 45 && !processedAdhars.has(adhar)) {
                processedAdhars.add(adhar);
                eligibleMembers.push(member.memberName);
            }
        }

        result.push({ [`house${i + 1}`]: eligibleMembers });
    }

    return result;
}

module.exports = { checkDataset, billingAmount, billedMembers };