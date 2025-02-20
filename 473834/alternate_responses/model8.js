function checkDataset(dataset) {
    if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error("Invalid DataSet");
    }

    const processedAdharnos = new Set();

    dataset.forEach((record, index) => {
        if (typeof record.meterNo !== 'number' || record.meterNo % 1 !== 0) {
            throw new Error("Dataset is not valid");
        }

        if (!record.members || !Array.isArray(record.members)) {
            throw new Error("Dataset is not valid");
        }

        record.members.forEach((member, memberIndex) => {
            if (typeof member.memberName !== 'string') {
                throw new Error("Dataset is not valid");
            }

            if (typeof member.age !== 'number' || member.age % 1 !== 0) {
                throw new Error("Dataset is not valid");
            }

            if (typeof member.Salary !== 'string' || !member.Salary.startsWith('$') || !member.Salary.endsWith('k')) {
                throw new Error("Dataset is not valid");
            }

            if (record.adharno && record.adharno[memberIndex] && processedAdharnos.has(record.adharno[memberIndex])) {
                record.members[memberIndex] = null;
            } else if (record.adharno && record.adharno[memberIndex]) {
                processedAdharnos.add(record.adharno[memberIndex]);
            }
        });

        if (typeof record.meterReading !== 'string' || !record.meterReading.endsWith('W')) {
            throw new Error("Dataset is not valid");
        }

        if (typeof record.floors !== 'number' || record.floors % 1 !== 0) {
            throw new Error("Dataset is not valid");
        }

        if (record.adharno && !Array.isArray(record.adharno)) {
            throw new Error("Dataset is not valid");
        }
    });

    return dataset;
}

function billingAmount(dataset) {
    checkDataset(dataset);

    const billingAmounts = [];

    dataset.forEach((record) => {
        let totalSalary = 0;
        const eligibleMembers = [];

        record.members.forEach((member) => {
            if (member && member.age >= 18 && member.age <= 45) {
                totalSalary += parseInt(member.Salary.slice(1, -1), 10);
                eligibleMembers.push(member.memberName);
            }
        });

        let billingAmount;

        if (totalSalary < 100) {
            billingAmount = parseInt(record.meterReading.slice(0, -1), 10) / 10;
        } else if (totalSalary < 200) {
            billingAmount = parseInt(record.meterReading.slice(0, -1), 10) / 10 * 2;
        } else {
            billingAmount = parseInt(record.meterReading.slice(0, -1), 10) / 10 * 3;
        }

        billingAmount += Math.floor(billingAmount / record.floors);

        billingAmounts.push(billingAmount);
    });

    return billingAmounts;
}

function billedMembers(dataset) {
    checkDataset(dataset);

    const billedMembersList = [];

    dataset.forEach((record, index) => {
        const eligibleMembers = [];

        record.members.forEach((member) => {
            if (member && member.age >= 18 && member.age <= 45) {
                eligibleMembers.push(member.memberName);
            }
        });

        billedMembersList.push({ [`house${index + 1}`]: eligibleMembers });
    });

    return billedMembersList;
}

module.exports = { checkDataset, billingAmount, billedMembers };