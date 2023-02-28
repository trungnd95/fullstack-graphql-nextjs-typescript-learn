import {
  Arg,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { LessThan } from 'typeorm';
import { Post } from './../entities/Post';
import { CheckAuth } from './../middlewares/checkAuth';
import { PaginatedPost } from './../types/PaginatedPost';
import { PostCreateInput } from './../types/PostMutationInput';
import { PostMutationResponse } from './../types/PostMutationResponse';

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() rootPost: Post) {
    return rootPost.text.slice(0, 50);
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async create(
    @Arg('createPostInput') createPostInput: PostCreateInput,
  ): Promise<PostMutationResponse> {
    try {
      console.log('In to create post');
      const post = new Post();
      post.title = createPostInput.title;
      post.text = createPostInput.text;
      await post.save();
      return {
        code: 500,
        message: 'Post created successfully',
        success: true,
        post,
      };
    } catch (error) {
      console.log('error creating post', error);
      return {
        code: 500,
        message: `error creating post. ${error.message}`,
        success: false,
      };
    }
  }

  @Query(() => PaginatedPost)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor?: string,
  ): Promise<PaginatedPost> {
    const realLimit = Math.min(limit, 5);
    const findConditions: { [key: string]: unknown } = {
      order: {
        updatedAt: 'ASC',
      },
      take: realLimit,
      relations: {
        user: true,
      },
    };

    if (cursor) {
      findConditions.where = {
        updatedAt: LessThan(cursor),
      };
    }

    console.log('Query paginated posts: ', findConditions);
    const posts = await Post.find(findConditions);
    console.log(posts);

    return {
      totalCount: (await Post.count()) as number,
      cursor: posts[posts.length - 1].updatedAt,
      hasMore:
        posts[posts.length - 1].updatedAt.toString() !==
        (await Post.find({ order: { updatedAt: 'DESC' }, take: 1 }))[0]?.updatedAt.toString(),
      paginatedPosts: posts,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id', () => ID) id: number): Promise<Post | null> {
    return await Post.findOneBy({ id });
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async update(
    @Arg('id', () => ID) id: number,
    @Arg('postUpdateInput') postUpdateInput: PostCreateInput,
  ): Promise<PostMutationResponse> {
    try {
      const existPost = await Post.findOneBy({ id });
      if (!existPost)
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        };

      existPost.title = postUpdateInput.title;
      existPost.text = postUpdateInput.text;
      await existPost.save();
      return {
        code: 201,
        success: true,
        message: 'Post is updated successfully',
        post: existPost,
      };
    } catch (error) {
      console.log('Error when updating post', error);
      return {
        code: 500,
        success: false,
        message: `Error when updating post. ${error.message}`,
      };
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async delete(@Arg('id', () => ID) id: number): Promise<PostMutationResponse> {
    try {
      const existPost = await Post.findOneBy({ id });
      if (!existPost)
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        };
      await Post.delete({ id });
      return {
        code: 201,
        success: true,
        message: 'Post is deleted successfully',
      };
    } catch (error) {
      console.log('Error when updating post', error);
      return {
        code: 500,
        success: false,
        message: `Error when updating post. ${error.message}`,
      };
    }
  }
}
