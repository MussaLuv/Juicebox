const { client, getAllUsers, createUser } = require("./index");

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });

    const albertTwo = await createUser({
      username: "albert",
      password: "imposter_albert",
    });

    console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS users;
      `);
    console.log("Finished dropping tables");
  } catch (error) {
    console.log("Error dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      `);
    console.log("Finished building tables");
  } catch (error) {
    console.log("Error building tables!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test databases...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);
  } catch (error) {
    console.error("Error testing databases!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

// const { client } = require("./index");

// async function testDB() {
//   try {
//     client.connect();

//     const result = await client.query(`SELECT * FROM users;`);

//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.end();
//   }
// }

// async function testDB() {
//   try {
//     client.connect();

//     const { rows } = await client.query(`SELECT * FROM users;`);
//     console.log(rows);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.end();
//   }
// }
