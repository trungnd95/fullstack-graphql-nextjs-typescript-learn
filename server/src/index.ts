import express from 'express';
import 'reflect-metadata';
import { DataSource } from "typeorm";
import { Post } from './entities/Post';
import { User } from './entities/User';
require("dotenv").config();

const main = async () => {
  const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: "reddit",
    synchronize: true,
    logging: true,
    entities: [User, Post],
    subscribers: [],
    migrations: [],
  })
  appDataSource
    .initialize()
      .then(() => { console.log("Connected to database")})
      .catch((err) => { console.log("Failed to connect to database ", err)});
  
  const app = express();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => { console.log("Server is running!")});
}

main().catch((err) => { console.log(err) });