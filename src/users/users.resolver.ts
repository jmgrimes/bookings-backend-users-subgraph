import { Inject } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { IsEmail, IsUrl } from "class-validator"

import { IUser, IUserModel, IUserPayload } from "./users.model"
import { IUsersService, USERS_SERVICE } from "./users.service"

export class UserInput implements IUserModel {
  firstName: string
  lastName: string
  @IsEmail() emailAddress: string
  title: string
  @IsUrl() image?: string
  notes?: string
}

@Resolver("User")
export class UsersResolver {
  constructor(@Inject(USERS_SERVICE) private usersService: IUsersService) {}

  @Query()
  async user(@Args("id") id: string): Promise<IUser | undefined> {
    return this.usersService.findById(id)
  }

  @Query()
  async users(@Args("ids") ids?: string[]): Promise<IUser[]> {
    return this.usersService.findAll(ids)
  }

  @Mutation()
  async userCreate(@Args("user") userInput: UserInput): Promise<IUserPayload> {
    return this.usersService
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
    @Args("id") id: string,
    @Args("user") userInput: UserInput,
  ): Promise<IUserPayload> {
    return this.usersService
      .updateById(id, userInput)
      .then((user) => ({
        user,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async userDelete(@Args("id") id: string): Promise<IUserPayload> {
    return this.usersService
      .deleteById(id)
      .then((user) => ({
        user,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
