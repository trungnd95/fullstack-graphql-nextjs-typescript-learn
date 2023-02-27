import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Post } from './../entities/Post';
import { CheckAuth } from './../middlewares/checkAuth';
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

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find();
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
