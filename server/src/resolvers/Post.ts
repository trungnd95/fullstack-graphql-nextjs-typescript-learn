import { Arg, Mutation, Resolver } from 'type-graphql';
import { Post } from './../entities/Post';
import { PostCreateInput } from './../types/PostMutationInput';
import { PostMutationResponse } from './../types/PostMutationResponse';

@Resolver()
export class PostResolver {
  @Mutation(() => PostMutationResponse)
  async createPost(
    @Arg('createPostInput') createPostInput: PostCreateInput,
  ): Promise<PostMutationResponse> {
    try {
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
}
