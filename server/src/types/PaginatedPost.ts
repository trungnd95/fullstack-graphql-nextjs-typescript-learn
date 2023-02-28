import { Field, ObjectType } from 'type-graphql';
import { Post } from './../entities/Post';

@ObjectType()
export class PaginatedPost {
  @Field()
  totalCount!: number;

  @Field(() => Date)
  cursor!: Date;

  @Field()
  hasMore!: boolean;

  @Field(() => [Post], { nullable: true })
  paginatedPosts!: Post[];
}
