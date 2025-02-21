
const { checkDataset, billingAmount, billedMembers } = require("./solution");

describe("Dataset validation", () => {
  it("should throw error if meterNo is not an integer", () => {
    const invalidDataset = [
      {
        meterNo: "1", // Invalid meterNo
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: 3,
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw error if floors is not an integer", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: "3",
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw error if age is not an integer", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: "21",
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: "3",
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw error if meterReading does not end with W", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100", // Invalid meterReading
        floors: 3,
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw error if any memberName is not a string", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: 123, // Invalid memberName
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: 3,
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw error if salary format is invalid", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30", // Invalid salary format
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: 3,
      },
    ];

    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should pass if dataset is valid", () => {
    const validDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
          {
            memberName: "Sarah",
            Salary: "$40k",
            age: 22,
          },
        ],
        adharno: ["ghf", "qqw"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          {
            memberName: "John",
            Salary: "$50k",
            age: 20,
          },
        ],
        adharno: ["ppp"],
        meterReading: "200W",
        floors: 2,
      },
    ];

    expect(() => checkDataset(validDataset)).not.toThrow();
  });

  it("should throw an error if dataset is not an array", () => {
    const invalidDataset = {};
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if dataset is empty", () => {
    const invalidDataset = [];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if members list is empty", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [],
        adharno: ["ghf", "qqw"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          {
            memberName: "John",
            Salary: "$50k",
            age: 20,
          },
        ],
        adharno: ["ppp"],
        meterReading: "200W",
        floors: 2,
      },
    ];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if adharno list is empty", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
          {
            memberName: "Sarah",
            Salary: "$40k",
            age: 22,
          },
        ],
        adharno: [],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          {
            memberName: "John",
            Salary: "$50k",
            age: 20,
          },
        ],
        adharno: ["ppp"],
        meterReading: "200W",
        floors: 2,
      },
    ];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if adharno list mismatch with memers list length", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
          {
            memberName: "Sarah",
            Salary: "$40k",
            age: 22,
          },
        ],
        adharno: ["aab"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          {
            memberName: "John",
            Salary: "$50k",
            age: 20,
          },
        ],
        adharno: ["ppp"],
        meterReading: "200W",
        floors: 2,
      },
    ];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if house list is empty", () => {
    const invalidDataset = [];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });

  it("should throw an error if same meter number is assigned", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["ghf"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 1,
        members: [
          {
            memberName: "S",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["qqw"],
        meterReading: "100W",
        floors: 3,
      },
    ];
    expect(() => checkDataset(invalidDataset)).toThrow(
      "Meter number cant be same"
    );
  });

  it("should throw an error if adhar list has invalid data", () => {
    const invalidDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: [1],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 1,
        members: [
          {
            memberName: "S",
            Salary: "$30k",
            age: 21,
          },
        ],
        adharno: ["qqw"],
        meterReading: "100W",
        floors: 3,
      },
    ];
    expect(() => checkDataset(invalidDataset)).toThrow("Dataset is not valid");
  });
});

describe("Billing calculation", () => {
  it("should apply default billing if total income is below 100k", () => {
    const validDataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
          {
            memberName: "Sarah",
            Salary: "$40k",
            age: 22,
          },
        ],
        adharno: ["ghf", "qqw"],

        meterReading: "100W",
        floors: 3,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([13]); // 10 from default billing + 3 from floor charge
  });

  it("should apply $2 for every 10W for income between 100k and 200k", () => {
    const validDataset = [
      {
        meterNo: 2,
        members: [
          {
            memberName: "John",
            Salary: "$150k",
            age: 30,
          },
          {
            memberName: "Alice",
            Salary: "$49k",
            age: 38,
          },
        ],
        adharno: ["ghf", "qqw"],
        meterReading: "200W",
        floors: 2,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([60]); // 40 from meter reading and 20 from floor charge
  });

  it("should apply $3 for every 10W for income above 200k", () => {
    const validDataset = [
      {
        meterNo: 3,
        members: [
          {
            memberName: "Mike",
            Salary: "$250k",
            age: 35,
          },
          {
            memberName: "Alice",
            Salary: "$100k",
            age: 40,
          },
        ],
        adharno: ["ghf", "qqw"],
        meterReading: "300W",
        floors: 1,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([180]); // 90 from meter reading and 90 from floor charge
  });

  it("should apply default billing if no eligible members (age outside 18-45)", () => {
    const validDataset = [
      {
        meterNo: 4,
        members: [
          {
            memberName: "Tom",
            Salary: "$10k",
            age: 17, // age < 18
          },
          {
            memberName: "Jerry",
            Salary: "$10k",
            age: 50, // age > 45
          },
        ],
        adharno: ["ghf", "qqw"],
        meterReading: "100W",
        floors: 1,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([20]); // Default billing since no eligible members
  });

  // New test case with house having members both below 18 and above 45
  it("should apply default billing based on income of eligible members (between 18 and 45)", () => {
    const validDataset = [
      {
        meterNo: 5,
        members: [
          {
            memberName: "Kajal",
            Salary: "$150k",
            age: 16, // Below 18
          },
          {
            memberName: "Sharuk",
            Salary: "$30k",
            age: 46, // Above 45
          },
          {
            memberName: "Ravi",
            Salary: "$50k",
            age: 30, // Eligible member
          },
        ],
        adharno: ["ghf", "qqw", "wer"],
        meterReading: "100W",
        floors: 2,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([15]); // Only Ravi's salary counts: 50k, default billing applies: 10 + 5 from floors
  });

  // Case with house having multiple members, and only some eligible
  it("should calculate billing amount for house with mixed age members (some eligible and some ineligible)", () => {
    const validDataset = [
      {
        meterNo: 6,
        members: [
          {
            memberName: "Ravi",
            Salary: "$100k",
            age: 40, // Eligible
          },
          {
            memberName: "Jai",
            Salary: "$50k",
            age: 16, // Ineligible
          },
          {
            memberName: "Simran",
            Salary: "$70k",
            age: 50, // Ineligible
          },
        ],
        adharno: ["ghf", "qqw", "wer"],
        meterReading: "200W",
        floors: 3,
      },
    ];

    const result = billingAmount(validDataset);
    expect(result).toEqual([53]);
  });

  it("should calculate billing amount correctly based on total income and floors", () => {
    const dataset = [
      {
        meterNo: 1,
        members: [
          { memberName: "Salman", Salary: "$30k", age: 21 },
          { memberName: "Saif", Salary: "$150k", age: 21 },
        ],
        adharno: ["abc", "ddf"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          { memberName: "Sharuk", Salary: "$30k", age: 46 }, // Ineligible
          { memberName: "Kajal", Salary: "$150k", age: 16 }, // Ineligible
        ],
        adharno: ["ghf", "qqw"],
        meterReading: "100W",
        floors: 3,
      },
    ];

    const result = billingAmount(dataset);

    expect(result).toEqual([26, 13]);
  });

  it("should calculate billing amount correctly based on total income and floors if same members are present in multiple houses ", () => {
    const dataset = [
      {
        meterNo: 1,

        members: [
          { memberName: "Salman", Salary: "$30k", age: 21 },
          { memberName: "Saif", Salary: "$150k", age: 21 },
        ],
        adharno: ["abc", "ddf"],
        meterReading: "100W",

        floors: 3,
      },
      {
        meterNo: 2,

        members: [
          { memberName: "Sharuk", Salary: "$30k", age: 46 },
          { memberName: "Salman", Salary: "$30k", age: 21 },
        ],
        adharno: ["ghf", "abc"],
        meterReading: "100W",

        floors: 3,
      },
    ];

    const result = billingAmount(dataset);

    expect(result).toEqual([26, 13]);
  });
});

describe("Billed members", () => {
  it("should return billed members for each house", () => {
    const dataset = [
      {
        meterNo: 1,
        members: [
          {
            memberName: "Salman",
            Salary: "$30k",
            age: 21,
          },
          {
            memberName: "Sarah",
            Salary: "$40k",
            age: 22,
          },
        ],
        adharno: ["abc", "ddf"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 2,
        members: [
          {
            memberName: "Sharuk",
            Salary: "$30k",
            age: 46,
          },
          {
            memberName: "Kajal",
            Salary: "$150k",
            age: 16,
          },
        ],
        adharno: ["a", "b"],
        meterReading: "100W",
        floors: 3,
      },
      {
        meterNo: 3,
        members: [
          {
            memberName: "Alok",
            Salary: "$200k",
            age: 30,
          },
          {
            memberName: "Ravi",
            Salary: "$50k",
            age: 25,
          },
        ],
        adharno: ["c", "d"],
        meterReading: "200W",
        floors: 2,
      },
      {
        meterNo: 4,
        members: [
          {
            memberName: "Mike",
            Salary: "$10k",
            age: 55,
          },
          {
            memberName: "Alice",
            Salary: "$50k",
            age: 17,
          },
        ],
        adharno: ["e", "f"],
        meterReading: "100W",
        floors: 2,
      },
      {
        meterNo: 5,
        members: [
          {
            memberName: "John",
            Salary: "$50k",
            age: 23,
          },
        ],
        adharno: ["g"],
        meterReading: "100W",
        floors: 1,
      },
    ];

    const result = billedMembers(dataset);
    expect(result).toEqual([
      { house1: ["Salman", "Sarah"] },
      { house2: [] },
      { house3: ["Alok", "Ravi"] },
      { house4: [] },
      { house5: ["John"] },
    ]);
  });
  it("should return billed members for each house if members are present in multiple houses", () => {
    const dataset = [
      {
        meterNo: 1,

        members: [
          { memberName: "Salman", Salary: "$30k", age: 21 },
          { memberName: "Saif", Salary: "$150k", age: 21 },
        ],
        adharno: ["abc", "ddf"],
        meterReading: "100W",

        floors: 3,
      },
      {
        meterNo: 2,

        members: [
          { memberName: "Sharuk", Salary: "$30k", age: 46 },
          { memberName: "Salman", Salary: "$30k", age: 21 },
        ],
        adharno: ["ghf", "abc"],
        meterReading: "100W",

        floors: 3,
      },
    ];

    const result = billedMembers(dataset);
    expect(result).toEqual([{ house1: ["Salman", "Saif"] }, { house2: [] }]);
  });
});