import { Field, ObjectType } from "type-graphql";
import { User } from './../entities/User';
import { FieldError, MutationResponse } from "./MutationResponse";


@ObjectType({implements: MutationResponse})
export class UserRegisterResponse implements MutationResponse {
  code: number;
  success: boolean;
  message?: string;
  errors?: FieldError[];

  @Field({ nullable: true })
  user?: User;
}