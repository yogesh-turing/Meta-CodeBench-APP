const { program } = require('./alternate_responses/model1');

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => mockUsers,
  })
);

async function runCLI(args) {
  const originalLog = console.log;
  const originalTable = console.table;
  const originalError = console.error;

  let output = "";
  let tableOutput = "";
  let errorOutput = "";

  console.log = (msg) => (output += msg + "\n");
  console.table = (msg) => (tableOutput += JSON.stringify(msg) + "\n");
  console.error = (msg) => (errorOutput += msg + "\n");

  try {
    await program.parseAsync([, , ...args]);
  } catch (error) {
    errorOutput += error.message;
  }

  console.log = originalLog;
  console.table = originalTable;
  console.error = originalError;

  return {
    stdout: output.trim(),
    table: tableOutput.trim(),
    stderr: errorOutput.trim(),
  };
}

const mockUsers = [
  {
    id: 1,
    firstName: "John",
    middleName: "Elliot",
    lastName: "Doe",
    age: 12,
    hair: { color: "Black" },
  },
  {
    id: 2,
    firstName: "Jane",
    middleName: "Martha",
    lastName: "Smith",
    age: 23,
    hair: { color: "Brown" },
  },
  {
    id: 3,
    firstName: "Bob",
    middleName: "Lucky",
    lastName: "Marley",
    age: 41,
    hair: { color: "Brown" },
  },
];

describe("CLI Tests (Mocked API)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsers),
      })
    );
  });

  test("should fetch all users and display a numbered list", async () => {
    const { stdout, stderr } = await runCLI(["users"]);

    // expect(stderr).toBe("");
    expect(stdout).toContain("Fetching user list...");
    expect(stdout).toContain("Users fetched successfully");
    expect(stdout).toContain("1. John Elliot Doe (12)");
    expect(stdout).toContain("2. Jane Martha Smith (23)");
    expect(stdout).toContain("3. Bob Lucky Marley (41)");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://dummyjson.com/users")
    );
  });

  test("should filter users by hair color and return a formatted table", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          id: 2,
          firstName: "Jane",
          middleName: "Martha",
          lastName: "Smith",
          age: 23,
          hair: { color: "Brown" },
        },
        {
          id: 3,
          firstName: "Bob",
          middleName: "Lucky",
          lastName: "Marley",
          age: 41,
          hair: { color: "Brown" },
        },
      ]),
    });

    const { stdout, table, stderr } = await runCLI([
      "filter",
      "-q",
      "hair.color",
      "-t",
      "Brown",
    ]);

    expect(stderr).toBe("");
    expect(stdout).toContain("Fetching and filtering users...");
    expect(stdout).toContain("Users fetched successfully");

    // Check if console.table contains formatted output
    expect(table).toContain(
      JSON.stringify([
        { Name: "Jane Smith", "Hair Color": "Brown" },
        { Name: "Bob Marley", "Hair Color": "Brown" },
      ])
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("filter?key=hair.color&value=Brown")
    );
  });

  test("should filter users by eye color and return a formatted table", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          id: 2,
          firstName: "Jane",
          middleName: "Martha",
          lastName: "Smith",
          age: 23,
          hair: { color: "Brown" },
          eyeColor: "blue",
        },
        {
          id: 3,
          firstName: "Bob",
          middleName: "Lucky",
          lastName: "Marley",
          age: 41,
          hair: { color: "Black" },
          eyeColor: "blue",
        },
      ]),
    });

    const { stdout, table, stderr } = await runCLI([
      "filter",
      "-q",
      "eyeColor",
      "-t",
      "blue",
    ]);

    expect(stderr).toBe("");
    expect(stdout).toContain("Fetching and filtering users...");
    expect(stdout).toContain("Users fetched successfully");

    // Check if console.table contains formatted output
    expect(table).toContain(
      JSON.stringify([
        { Name: "Jane Smith", "Eye Color": "Blue" },
        { Name: "Bob Marley", "Eye Color": "Blue" },
      ])
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("filter?key=eyeColor&value=blue")
    );
  });

  test("should filter users by company address state and return a formatted table", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          id: 2,
          firstName: "Jane",
          middleName: "Martha",
          lastName: "Smith",
          age: 23,
          company: {
            name: "Some Company",
            title: "Example",
            address: {
              address: "12 Place",
              city: "VI",
              state: "Lagos",
              country: "Nigeria",
            },
          },
        },
        {
          id: 3,
          firstName: "Bob",
          middleName: "Lucky",
          lastName: "Marley",
          age: 41,
          hair: { color: "Brown" },
          company: {
            name: "Other Company",
            title: "Example",
            address: {
              address: "19 Place",
              city: "LA",
              state: "Lagos",
              country: "Nigeria",
            },
          },
        },
      ]),
    });

    const { stdout, table, stderr } = await runCLI([
      "filter",
      "-q",
      "company.address.state",
      "-t",
      "Lagos",
    ]);

    expect(stderr).toBe("");
    expect(stdout).toContain("Fetching and filtering users...");
    expect(stdout).toContain("Users fetched successfully");

    // Check if console.table contains formatted output
    expect(table).toContain(
      JSON.stringify([
        { Name: "Jane Smith", "Company Address State": "Lagos" },
        { Name: "Bob Marley", "Company Address State": "Lagos" },
      ])
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("filter?key=company.address.state&value=Lagos")
    );
  });

  test("should search users and display a filtered numbered list", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          id: 2,
          firstName: "Jane",
          middleName: "Martha",

          lastName: "Smith",
          age: 23,
          hair: { color: "Brown" },
        },
      ]),
    });
    const { stdout, stderr } = await runCLI(["search", "Jane"]);

    expect(stderr).toBe("");
    expect(stdout).toContain("Searching users...");
    expect(stdout).toContain("Users fetched successfully");
    expect(stdout).toContain("1. Jane Martha Smith (23)");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("search?q=Jane")
    );
  });

  test("should handle API fetch errors gracefully", async () => {
    global.fetch.mockRejectedValue(new Error("API error"));

    const { stdout, stderr } = await runCLI(["users"]);

    expect(stdout).toContain("Fetching user list...");
    expect(stderr).toContain("User fetch failed");

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
