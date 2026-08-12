const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db("medsafe");

    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error);

    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }

  return db;
}

module.exports = {
  connectDB,
  getDB,
};