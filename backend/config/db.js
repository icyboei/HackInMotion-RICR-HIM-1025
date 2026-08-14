const { MongoClient, ObjectId } = require("mongodb");

let db = null;
const inMemoryStore = {};

function matchQuery(doc, query) {
  for (const key of Object.keys(query)) {
    if (key === "$or") {
      const clauses = query["$or"];
      if (Array.isArray(clauses)) {
        const anyMatch = clauses.some((clause) => matchQuery(doc, clause));
        if (!anyMatch) return false;
      }
      continue;
    }
    const targetVal = query[key];
    const docVal = doc[key];

    if (targetVal === null || targetVal === undefined) {
      if (docVal !== targetVal) return false;
    } else if (
      (targetVal instanceof ObjectId || (typeof targetVal === "object" && targetVal !== null && targetVal.toString)) &&
      (docVal instanceof ObjectId || (typeof docVal === "object" && docVal !== null && docVal.toString))
    ) {
      if (docVal.toString() !== targetVal.toString()) return false;
    } else if (typeof targetVal === "string" && typeof docVal === "object" && docVal !== null && docVal.toString) {
      if (docVal.toString() !== targetVal) return false;
    } else if (docVal !== targetVal) {
      return false;
    }
  }
  return true;
}

function getInMemoryCollection(name) {
  if (!inMemoryStore[name]) {
    inMemoryStore[name] = [];
  }
  const store = inMemoryStore[name];

  return {
    find: (query = {}) => {
      const filtered = store.filter((doc) => matchQuery(doc, query));
      let sortConfig = null;
      let skipCount = 0;
      let limitCount = null;

      const cursor = {
        sort: (sortObj) => {
          sortConfig = sortObj;
          return cursor;
        },
        skip: (n) => {
          skipCount = n || 0;
          return cursor;
        },
        limit: (n) => {
          limitCount = n;
          return cursor;
        },
        toArray: async () => {
          let list = [...filtered];
          if (sortConfig) {
            const key = Object.keys(sortConfig)[0];
            const dir = sortConfig[key];
            if (key) {
              list.sort((a, b) => {
                const valA = a[key] instanceof Date ? a[key].getTime() : (a[key] ?? 0);
                const valB = b[key] instanceof Date ? b[key].getTime() : (b[key] ?? 0);
                if (valA < valB) return dir === -1 ? 1 : -1;
                if (valA > valB) return dir === -1 ? -1 : 1;
                return 0;
              });
            }
          }
          if (skipCount > 0) {
            list = list.slice(skipCount);
          }
          if (limitCount !== null && limitCount !== undefined) {
            list = list.slice(0, limitCount);
          }
          return list;
        },
      };
      return cursor;
    },
    findOne: async (query = {}) => {
      return store.find((doc) => matchQuery(doc, query)) || null;
    },
    insertOne: async (doc) => {
      const newDoc = { _id: doc._id || new ObjectId(), ...doc, createdAt: doc.createdAt || new Date() };
      store.push(newDoc);
      return { insertedId: newDoc._id };
    },
    deleteOne: async (query = {}) => {
      const idx = store.findIndex((doc) => matchQuery(doc, query));
      if (idx !== -1) {
        store.splice(idx, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },
    updateOne: async (query = {}, update = {}) => {
      const doc = store.find((d) => matchQuery(d, query));
      if (doc && update.$set) {
        Object.assign(doc, update.$set);
        return { matchedCount: 1, modifiedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    },
  };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      const client = new MongoClient(uri, {
        connectTimeoutMS: 2000,
        serverSelectionTimeoutMS: 2000,
      });
      await Promise.race([
        client.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 2500)),
      ]);
      db = client.db("medsafe");
      console.log("MongoDB connected successfully ✅");
      return;
    } catch (error) {
      console.warn("⚠️  MongoDB connection failed:", error.message);
    }
  } else {
    console.warn("⚠️  MONGODB_URI not set.");
  }

  console.warn("⚠️  Using in-memory database fallback to ensure MedSafe API remains operational.");
  db = {
    collection: (name) => getInMemoryCollection(name),
  };
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
};
