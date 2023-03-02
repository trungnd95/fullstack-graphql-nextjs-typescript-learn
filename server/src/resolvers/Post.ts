import {
  Arg,
  Ctx,
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
import { User } from './../entities/User';
import { CheckAuth } from './../middlewares/checkAuth';
import { Context } from './../types/Context';
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
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      const author = await User.findOneBy({ id: req.session.userId });
      if (author) {
        const post = new Post();
        post.title = createPostInput.title;
        post.text = createPostInput.text;
        post.user = author;
        await post.save();
        return {
          code: 500,
          message: 'Post created successfully',
          success: true,
          post,
        };
      }
      return {
        code: 500,
        message: `author is not found in db`,
        success: false,
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
        updatedAt: 'DESC',
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

    const posts = await Post.find(findConditions);

    return {
      totalCount: (await Post.count()) as number,
      cursor: posts[posts.length - 1].updatedAt,
      hasMore:
        posts[posts.length - 1].updatedAt.toString() !==
        (await Post.find({ order: { updatedAt: 'ASC' }, take: 1 }))[0]?.updatedAt.toString(),
      paginatedPosts: posts,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id', () => ID) id: number): Promise<Post | null> {
    return await Post.findOne({ where: { id }, relations: { user: true } });
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async update(
    @Arg('id', () => ID) id: number,
    @Arg('postUpdateInput') postUpdateInput: PostCreateInput,
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      console.log('params data: ', id, postUpdateInput);
      const existPost = await Post.findOne({ where: { id }, relations: { user: true } });
      if (!existPost)
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        };

      if (existPost.user.id !== req.session.userId) {
        return {
          code: 403,
          success: false,
          message: 'Not allowed',
        };
      }

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
  async delete(
    @Arg('id', () => ID) id: number,
    @Ctx() { req }: Context,
  ): Promise<PostMutationResponse> {
    try {
      const existPost = await Post.findOne({ where: { id }, relations: { user: true } });

      if (!existPost)
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        };
      if (existPost.user.id !== req.session.userId) {
        return {
          code: 403,
          success: false,
          message: 'Not allowed',
        };
      }

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
