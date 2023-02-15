import bcrypt from 'bcrypt';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { Context } from '../types/Context';
import { UserRegisterInput } from '../types/UserRegisterInput';
import { COOKIE_NAME } from './../constants';
import { UserMutationResponse } from './../types/UseMutationResponse';
import { UserLoginInput } from './../types/UserLoginInput';

@Resolver()
export class UserResolver {
  @Mutation(() => UserMutationResponse, { nullable: true })
  async register(
    @Arg('registerInput') registerInput: UserRegisterInput,
    @Ctx() { req }: Context,
  ): Promise<UserMutationResponse> {
    try {
      const { email, username, password } = registerInput;

      let user = await User.findOne({ where: [{ email }, { username }] });
      if (user) {
        return {
          code: 400,
          success: false,
          message: 'User is already registered',
          errors: [
            {
              field: user.email === email ? 'email' : 'username',
              message: `${user.email === email ? 'Email' : 'Username'} already taken!`,
            },
          ],
        };
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user = new User();
      user.email = email;
      user.username = username;
      user.password = hash;
      await user.save();
      req.session.userId = user.id;
      return {
        code: 201,
        success: true,
        message: 'User was successfully registered',
        user,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal error ${error.message}`,
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg('loginInput') loginInput: UserLoginInput,
    @Ctx() { req }: Context,
  ): Promise<UserMutationResponse> {
    const { username, password } = loginInput;
    const userExist = await User.findOneBy({ username });

    if (userExist) {
      const match = await bcrypt.compare(password, userExist.password);
      if (match) req.session.userId = userExist.id;
      return {
        code: 200,
        success: true,
        user: userExist,
        message: 'Login successful',
      };
    }

    return {
      code: 400,
      success: false,
      message: 'Wrong email or password',
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((error) => {
        if (error) {
          console.log('Destroy session error. ', error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
