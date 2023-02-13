import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from "typeorm";
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/Hello';
import { UserResolver } from './resolvers/User';
require("dotenv").config();

const main = async () => {
  // Init data source to connect to database
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
  
  // Init graphql-server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver], 
      emitSchemaFile: true,
      validate: false
    }), 
    context: async ({ req }) => ({ token: req.headers.token}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  });

  await apolloServer.start();
  
  // Init express server    
  const app = express();
  apolloServer.applyMiddleware({app, cors: false});
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => { console.log("Server is running!")});
}

main().catch((err) => { console.log(err) });