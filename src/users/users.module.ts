import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import {
  AuthController,
  UsersController,
  VerifyController,
} from './users.controller';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => JwtAuthModule),
  ],
  controllers: [UsersController, AuthController, VerifyController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
