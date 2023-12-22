export interface IUserModel {
  firstName: string
  lastName: string
  emailAddress: string
  title: string
  image?: string
  notes?: string
}

export interface IUser extends IUserModel {
  id: string
}
