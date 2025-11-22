// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cfg: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // accepts "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log(
      JSON.stringify(process.env.JWT_SECRET),
      'processs JWT_SECRET in jwt.strategy.ts',
    );
  }

  // payload is what you signed (see below). You should return the "user" object or minimal info.
  async validate(payload: any) {
    //
    return {
      userId: payload.sub,
      phone: payload.phoneNumber,
    }; // attaches to request.user
  }
}
