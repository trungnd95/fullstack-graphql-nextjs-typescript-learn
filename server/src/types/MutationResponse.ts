import { Field, InterfaceType, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@InterfaceType()
export abstract class MutationResponse {
  @Field()
  code: number 

  @Field()
  success: boolean

  @Field({ nullable: true })
  message?: string

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[] 
}