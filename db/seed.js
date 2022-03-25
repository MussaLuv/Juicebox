const {
  client,
  createUser,
  updateUser,

  getAllPosts,
  createPost,
  updatePost,
  getUserById,
  getPostsByTagName,
} = require("./index");


  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
} = require("./index");

async function dropTables() {
  try {
    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
        `);
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name varchar(255) UNIQUE NOT NULL,
      location varchar(255) NOT NULL,
      active boolean DEFAULT true
    );
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "postId", INTEGER REFERENCES posts(id),
      "tagId", INTEGER REFERENCES tags(id),
       Add a UNIQUE constraint on ("postId", "tagId"),
      "authorId" INTEGER REFERENCES users(id),
      title varchar(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    )
    CREATE TABLE post_tags (
     "postId", INTEGER REFERENCES posts(id),
     "tagId", INTEGER REFERENCES tags(id),
     Add a UNIQUE constraint on ("postId", "tagId")
    )`);
  } catch (error) {
    throw error;
  }
}


async function createInitialUsers() {
  try {
    await createUser({
      username: "albert",
      password: "bertie99",

      name: "albert",
      location: "anywhere",

      name: "Al Bert",
      location: "Sidney, Australia",

    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",

      name: "sandra",
      location: "anywhere",

      name: "Sandra",
      location: "LA",

    });
    await createUser({
      username: "glamgal",
      password: "soglam",

      name: "glamgal",
      location: "anywhere",

      name: "Mike",
      location: "Chicago",

    });
  } catch (error) {
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
    });

    await createPost({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?",
    });

    await createPost({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing.",
    });
  } catch (error) {
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#happy", "#youcandoanything"],
    });

    await createPost({
      authorId: sandra.id,
      title: "First Post",
      content:
        "This is my first post. I hope you hate writing blogs as much as I hate writing them.",
      tags: ["#happy", "#worst-day-ever"],
    });

    await createPost({
      authorId: glamgal.id,
      title: "First Post",
      content:
        "This is my first post. Tags wont show up so i'm going to quit blogging",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
    });
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();

    // await createInitialTags();
  } catch (error) {
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE("postId", "tagId")
      );
    `);


  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function testDB() {
  try {

    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    const users = await getAllUsers();

    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });

    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("POST Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[0].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"],
    });
    console.log("Result:", updatePostTagsResult);

    console.log("Calling getUserById with 3");
    const glamgal = await getUserById(3);
    console.log("Result:", glamgal);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);


    const posts = await getAllPosts();

    // const getUser = await getPostsByUser();

    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });

    const albert = await getUserById(1);
  } catch (error) {

    console.log("Error during testDB");

    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
