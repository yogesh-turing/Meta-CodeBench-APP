function checkDataset(dataset) {
    if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error("Invalid DataSet");
    }

    const meterNumbers = new Set();

    for (const house of dataset) {
        // Check if all required properties exist
        if (!house.meterNo || !house.members || !house.meterReading || 
            !house.floors || !house.adharno) {
            throw new Error("Dataset is not valid");
        }

        // Check meter number uniqueness and type
        if (typeof house.meterNo !== 'number' || !Number.isInteger(house.meterNo)) {
            throw new Error("Dataset is not valid");
        }
        if (meterNumbers.has(house.meterNo)) {
            throw new Error("Meter number cant be same");
        }
        meterNumbers.add(house.meterNo);

        // Check members array and its properties
        if (!Array.isArray(house.members)) {
            throw new Error("Dataset is not valid");
        }

        // Check if adharno array length matches members array length
        if (!Array.isArray(house.adharno) || house.adharno.length !== house.members.length) {
            throw new Error("Dataset is not valid");
        }

        // Validate each adharno is string
        if (!house.adharno.every(no => typeof no === 'string')) {
            throw new Error("Dataset is not valid");
        }

        for (const member of house.members) {
            if (typeof member.memberName !== 'string') {
                throw new Error("Dataset is not valid");
            }
            if (typeof member.age !== 'number' || !Number.isInteger(member.age)) {
                throw new Error("Dataset is not valid");
            }
            if (!/^\$\d+k$/i.test(member.Salary)) {
                throw new Error("Dataset is not valid");
            }
        }

        // Check meterReading format
        if (!/^\d+W$/.test(house.meterReading)) {
            throw new Error("Dataset is not valid");
        }

        // Check floors
        if (typeof house.floors !== 'number' || !Number.isInteger(house.floors)) {
            throw new Error("Dataset is not valid");
        }
    }

    return dataset;
}

function billingAmount(dataset) {
    checkDataset(dataset);
    const processedAdharNos = new Set();
    const billingAmounts = [];

    for (const house of dataset) {
        const watts = parseInt(house.meterReading);
        let totalIncome = 0;
        let hasEligibleMember = false;

        // Calculate total income from eligible members
        for (let i = 0; i < house.members.length; i++) {
            const member = house.members[i];
            const adharNo = house.adharno[i];

            if (member.age >= 18 && member.age <= 45 && !processedAdharNos.has(adharNo)) {
                hasEligibleMember = true;
                totalIncome += parseInt(member.Salary.replace(/[\$k]/gi, '')) * 1000;
                processedAdharNos.add(adharNo);
            }
        }

        let ratePerTenWatts;
        if (!hasEligibleMember) {
            ratePerTenWatts = 1; // Default billing
        } else if (totalIncome < 100000) {
            ratePerTenWatts = 1;
        } else if (totalIncome < 200000) {
            ratePerTenWatts = 2;
        } else {
            ratePerTenWatts = 3;
        }

        const baseAmount = Math.floor(watts / 10) * ratePerTenWatts;
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