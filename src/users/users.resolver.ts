import { Inject } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { IsEmail, IsUrl } from "class-validator"

import { IUser, IUserModel } from "./users.model"
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
  async createUser(@Args("user") userInput: UserInput): Promise<IUser> {
    return this.usersService.create(userInput)
  }

  @Mutation()
  async updateUser(
    @Args("id") id: string,
    @Args("user") userInput: UserInput,
  ): Promise<IUser | undefined> {
    return this.usersService.updateById(id, userInput)
  }

  @Mutation()
  async deleteUser(@Args("id") id: string): Promise<IUser | undefined> {
    return this.usersService.deleteById(id)
  }
}
