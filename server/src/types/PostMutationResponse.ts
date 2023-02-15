import { Field, ObjectType } from 'type-graphql';
import { Post } from './../entities/Post';
import { FieldError, MutationResponse } from './MutationResponse';

@ObjectType({ implements: MutationResponse })
export class PostMutationResponse implements MutationResponse {
  code: number;
  success: boolean;
  message?: string;
  errors?: FieldError[];

  @Field({ nullable: true })
  post?: Post;
}
