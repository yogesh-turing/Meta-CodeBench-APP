// api.js
/* 
The return type for these functions is an array with this object
{
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
};
*/
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

// program.js
// TODO: Implement program

module.exports = { progam }