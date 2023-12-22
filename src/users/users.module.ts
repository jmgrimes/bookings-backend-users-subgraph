import { Module, Scope } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { UsersResolver } from "./users.resolver"
import { User, UserSchema } from "./users.schema"
import { USERS_SERVICE, UsersService } from "./users.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
      scope: Scope.DEFAULT,
    },
  ],
  providers: [
    UsersResolver,
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
      scope: Scope.DEFAULT,
    },
  ],
})
export class UsersModule {}
