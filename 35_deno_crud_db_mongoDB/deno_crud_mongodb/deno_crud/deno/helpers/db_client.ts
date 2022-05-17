// import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';
import {
  Bson,
  MongoClient,
  Database
} from "https://deno.land/x/mongo@v0.29.4/mod.ts";

let db: Database;

export function connect() {
  const client = new MongoClient();
  client.connect("MONGO_DB_URI");

  db = client.database('todo-app');
}



export function getDb() {
  return db;
}


