import { Context } from 'src/types/Context';
import { Ctx, Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(@Ctx() { req }: Context) {
    console.log(req.session);
    return 'Helloworld';
  }
}
