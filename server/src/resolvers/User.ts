import bcrypt from "bcrypt";
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from '../entities/User';
import { UserRegisterInput } from '../types/UserRegisterInput';
import { UserRegisterResponse } from '../types/UserRegisterResponse';

@Resolver()
export class UserResolver {
  @Mutation(() => UserRegisterResponse, { nullable: true })
  async register(@Arg("registerInput") registerInput: UserRegisterInput) 
  : Promise<UserRegisterResponse> {
    try {

      const { email, username, password } = registerInput;

      let user = await User.findOne({ where: [ { email }, { username }]});
      if (user) {
        return {
          code: 400, 
          success: false, 
          message: 'User is already registered', 
          errors: [
            { 
              field: user.email === email ? 'email' : 'username', 
              message: `${user.email === email ? 'Email' : 'Username'} already taken!` 
            }
          ]
        }  
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user = new User();
      user.email = email;
      user.username = username;
      user.password = hash;
      await user.save();
      return {
        code: 201, 
        success: true, 
        message: 'User was successfully registered', 
        user
      };
    }
    catch(error)
    {
      return {
        code: 500, 
        success: false, 
        message: `Internal error ${error.message}`,
      }  
    }

  }
}