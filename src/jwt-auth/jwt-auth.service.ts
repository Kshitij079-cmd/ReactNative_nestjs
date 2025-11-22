import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) { }
  async createtokenForUser(user: any) {
    console.log({ user }, 'user in createtokenForUser');
    const payload = { phoneNumber: user.phoneNumber, sub: user._id };
    console.log({ payload }, 'payload');
    const accessToken = await this.jwtService.signAsync(payload);
    console.log({ accessToken }, 'accessToken');
    return {
      accessToken: accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '6000s',
    };
  }

  findAll() {
    return `This action returns all jwtAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jwtAuth`;
  }

  update() {
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} jwtAuth`;
  }
}
