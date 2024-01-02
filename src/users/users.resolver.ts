import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql"
import { IsEmail, IsUrl } from "class-validator"

import { IUser, IUserModel, IUserPayload } from "./users.model"
import { IUsersService } from "./users.service"

export class UserInput implements IUserModel {
  firstName: string
  lastName: string
  @IsEmail() emailAddress: string
  title: string
  @IsUrl() image?: string
  notes?: string
}

export interface IContext {
  usersService: IUsersService
}

@Resolver("User")
export class UsersResolver {
  constructor() {}

  @Query()
  async user(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IUser | undefined> {
    return context.usersService.findById(id)
  }

  @Query()
  async users(
    @Context() context: IContext,
    @Args("ids") ids?: string[],
  ): Promise<IUser[]> {
    return context.usersService.findAll(ids)
  }

  @Mutation()
  async userCreate(
    @Context() context: IContext,
    @Args("user") userInput: UserInput,
  ): Promise<IUserPayload> {
    return context.usersService
      .create(userInput)
      .then((user) => ({
        user,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async userUpdate(
    @Context() context: IContext,
    @Args("id") id: string,
    @Args("user") userInput: UserInput,
  ): Promise<IUserPayload> {
    return context.usersService
      .updateById(id, userInput)
      .then((user) => ({
        user,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async userDelete(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IUserPayload> {
    return context.usersService
      .deleteById(id)
      .then((user) => ({
        user,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
