import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongoDataSource } from "apollo-datasource-mongodb"
import { Model, Types } from "mongoose"

import { IUser, IUserModel } from "./users.model"
import { User, UserDocument } from "./users.schema"

export const USERS_SERVICE = "USERS_SERVICE"

export interface IUsersService {
  findById(id: string): Promise<IUser | undefined>
  findAll(ids?: string[]): Promise<IUser[]>
  create(userModel: IUserModel): Promise<IUser>
  updateById(id: string, userModel: IUserModel): Promise<IUser>
  deleteById(id: string): Promise<IUser>
}

@Injectable()
export class UsersService
  extends MongoDataSource<UserDocument>
  implements IUsersService
{
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super({
      modelOrCollection: userModel,
    })
  }

  async findById(id: string): Promise<IUser | undefined> {
    return this.findOneById(new Types.ObjectId(id)).then(this.toUser)
  }

  async findAll(ids?: string[]): Promise<IUser[]> {
    const userDocuments = await this.findManyByIds(
      ids ? ids.map((id) => new Types.ObjectId(id)) : await this.findAllIds(),
    )
    return userDocuments.map(this.toUser)
  }

  async create(userModel: IUserModel): Promise<IUser> {
    return this.model.create(userModel).then(this.toUser)
  }

  async updateById(
    id: string,
    userModel: IUserModel,
  ): Promise<IUser | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    await this.model.findByIdAndUpdate(objectId, userModel).exec()
    return this.findOneById(objectId).then(this.toUser)
  }

  async deleteById(id: string): Promise<IUser | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    return this.model
      .findByIdAndDelete(objectId)
      .exec()
      .then((result) => {
        return this.toUser(result.value)
      })
  }

  private async findAllIds(): Promise<Types.ObjectId[]> {
    const users = await this.model.find({}, ["_id"]).exec()
    return users.map((user) => user._id)
  }

  private toUser(userDocument: UserDocument): IUser {
    return {
      id: userDocument._id.toHexString(),
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      emailAddress: userDocument.emailAddress,
      title: userDocument.title,
      image: userDocument.image,
      notes: userDocument.notes,
    }
  }
}
