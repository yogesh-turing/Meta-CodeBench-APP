const { Command } = require('commander');

async function getUsers(
    limit = 10,
    skip = 0,
    select = [],
    sortBy = "",
    order = "asc"
  ) {
    try {
      const url = new URL("<MY_API_URL>");
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("skip", skip.toString());
      if (select.length > 0) {
        url.searchParams.set("select", select.join(","));
      }
      if (sortBy) {
        url.searchParams.set("sortBy", sortBy);
      }
      url.searchParams.set("order", order);
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users.");
    }
  }
  
  async function filterUsers(key, value) {
    try {
      const response = await fetch(
        `<MY_API_URL>"/filter?key=${key}&value=${value}`
      );
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users.");
    }
  }
  async function searchUsers(query) {
    try {
      const response = await fetch(
        `<MY_API_URL>"/search?q=${query}`
      );
      return response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users.");
    }
  }
  

function formatName(user) {
    const middleName = user.middleName ? ` ${user.middleName} ` : ' ';
    return `${user.firstName}${middleName}${user.lastName}`;
}

function titleCase(str) {
    return str.split(/[.-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const program = new Command();

program
    .name('user-cli')
    .description('CLI to manage users');

program
    .command('users')
    .description('Display all users')
    .action(async () => {
        console.log('Fetching user list...');
        try {
            const users = await getUsers();
            console.log('Users fetched successfully');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${formatName(user)} (${user.age})`);
            });
        } catch (error) {
            console.error('User fetch failed:', error.message);
        }
    });

program
    .command('filter')
    .description('Filter users by property')
    .requiredOption('-q, --query <query>', 'property to filter by')
    .requiredOption('-t, --term <term>', 'value to filter for')
    .action(async (options) => {
        console.log('Fetching and filtering users...');
        try {
            const users = await filterUsers(options.query, options.term);
            console.log('Users fetched successfully');
            
            const tableData = users.map(user => ({
                'Name': `${user.firstName} ${user.lastName}`,
                [titleCase(options.query)]: options.query.includes('.')
                    ? options.query.split('.').reduce((obj, key) => obj[key], user)
                    : user[options.query]
            }));

            console.table(tableData);
        } catch (error) {
            console.error('User fetch failed:', error.message);
        }
    });

program
    .command('search')
    .description('Search users')
    .argument('<query>', 'search query')
    .action(async (query) => {
        console.log('Searching users...');
        try {
            const users = await searchUsers(query);
            console.log('Users fetched successfully');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${formatName(user)} (${user.age})`);
            });
        } catch (error) {
            console.error('User fetch failed:', error.message);
        }
    });

module.exports = { program };