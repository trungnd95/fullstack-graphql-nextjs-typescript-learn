import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import expressPlayground from 'graphql-playground-middleware-express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
import { createClient } from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { COOKIE_NAME, __PROD__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/Hello';
import { UserResolver } from './resolvers/User';
require('dotenv').config();

const main = async () => {
  // Init express server
  const app = express();
  const httpServer = http.createServer(app);

  // Setup session
  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch((error) => console.log('Redis client connect error ', error));
  app.set('trust proxy', !__PROD__);
  app.use(
    session({
      name: COOKIE_NAME,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET_DEV_KEY as string,
      resave: false,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 60 * 60 * 1000, // one hour
        httpOnly: true,
        secure: __PROD__,
        sameSite: 'lax',
      },
    }),
  );

  // Init data source to connect to database
  const appDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: 'reddit',
    synchronize: true,
    logging: true,
    entities: [User, Post],
    subscribers: [],
    migrations: [],
  });
  appDataSource
    .initialize()
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.log('Failed to connect to database ', err);
    });

  // Init graphql-server

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      emitSchemaFile: true,
      validate: false,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );
  /// Option for using playground
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  // Server listen
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

main().catch((err) => {
  console.log(err);
});
