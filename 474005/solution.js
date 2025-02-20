const { Command } = require("commander");
const {
  getUsers,
  filterUsers,
  searchUsers,
} = require("./alternate_responses/api");

const program = new Command();

program.name("user-cli").description("CLI to manage users").version("1.0.0");

program
  .command("users")
  .description("List all users")
  .action(async () => {
    console.log("Fetching user list...");
    try {
      const response = await getUsers();
      console.log("Users fetched successfully");

      response.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.firstName} ${user.middleName} ${
            user.lastName
          } (${user.age})`
        );
      });
    } catch (error) {
      console.error("User fetch failed:", error.message);
    }
  });

program
  .command("filter")
  .description("Filter users by a specific field")
  .requiredOption("-q, --query <query>", "field to query")
  .requiredOption("-t, --term <term>", "value to filter by")
  .action(async (options) => {
    console.log("Fetching and filtering users...");
    try {
      const response = await filterUsers(options.query, options.term);
      console.log("Users fetched successfully");

      // Convert query path to readable header
      const header = options.query
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters in camelCase
        .split(".")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const tableData = response.map((user) => {
        // Handle nested properties
        const value = options.query
          .split(".")
          .reduce((obj, key) => obj[key], user);
        return {
          Name: `${user.firstName} ${user.lastName}`,
          [header]: value.charAt(0).toUpperCase() + value.slice(1),
        };
      });

      console.table(tableData);
    } catch (error) {
      console.error("User fetch failed:", error.message);
    }
  });

program
  .command("search")
  .description("Search users")
  .argument("<query>", "search query")
  .action(async (query) => {
    console.log("Searching users...");
    try {
      const response = await searchUsers(query);
      console.log("Users fetched successfully");

      response.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.firstName} ${user.middleName} ${
            user.lastName
          } (${user.age})`
        );
      });
    } catch (error) {
      console.error("User fetch failed:", error.message);
    }
  });

module.exports = { program };
