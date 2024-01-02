import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"
import { ApolloDriverConfig, ApolloFederationDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { MongooseModule } from "@nestjs/mongoose"

import UsersModule, { IUsersService, USERS_SERVICE } from "./users"

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [UsersModule],
      inject: [USERS_SERVICE],
      useFactory: async (usersService: IUsersService) => ({
        context: () => ({
          usersService,
        }),
        path: "/api/graphql",
        playground: false,
        plugins: [
          ApolloServerPluginInlineTraceDisabled(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        typePaths: ["./**/*.graphql"],
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
