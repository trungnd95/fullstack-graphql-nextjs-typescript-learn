import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { Context } from './../types/Context';

export const CheckAuth: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
  if (!req.session.userId) {
    throw new GraphQLError('You are not authorized to perform this action.');
  }

  return next();
};
