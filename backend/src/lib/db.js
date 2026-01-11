import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./secrets/backend.env" });

const dbclient = new MongoClient(process.env.MONGO_URI);

export async function getDb() {
  if (!dbclient.topology?.isConnected()) {
    await dbclient.connect();
  }
  return dbclient.db("myDatabase");
}

export {dbclient};

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
