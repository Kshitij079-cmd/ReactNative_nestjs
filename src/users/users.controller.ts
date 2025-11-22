/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('send-otp')
export class AuthController {
  constructor(private readonly usersService: UsersService) { }
  @Post()
  async sentOTP(@Body('phoneNumber') phoneNumber: string) {
    //add twillio code to send OTP
    const result = await this.usersService.sendOtp(phoneNumber);
    console.log('OTP sent result:', result);
    return {
      phoneNumber: phoneNumber,
      response: `OTP sent successfully to ${phoneNumber}`,
    };
  }
}

@Controller('verify')
export class VerifyController {
  constructor(private readonly usersService: UsersService) { }
  @Post()
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('code') code: string,
  ) {
    const result = await this.usersService.verifyOtp(phoneNumber, code);
    console.log('called function verify otp######:', result);
    return {
      phoneNumber: phoneNumber,
      response: `OTP verification status: ${result?.msg || 'verified'}`,
    };
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const foundUserinfo = await this.usersService.findOne(id);
    console.log(foundUserinfo, 'user Found');
    return foundUserinfo;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    // req.user can be the user document or payload depending on your strategy
    const sessionUser = req.user;

    if (!sessionUser) {
      throw new BadRequestException('No authenticated user found in request.');
    }

    const sessionUserId = sessionUser._id
      ? sessionUser._id.toString()
      : sessionUser.sub?.toString();

    // allow update only if same user or admin role
    const isOwner = sessionUserId === id;
    const isAdmin = sessionUser.role && sessionUser.role === 'admin'; // adapt to your roles

    // if (!isOwner && !isAdmin) {
    //   throw new ForbiddenException('You are not allowed to update this user.');
    // }

    const updated = this.usersService.updateUserById(id, updateUserDto);
    console.log(' user updated ');

    if (!updated) throw new NotFoundException('User not found');
    const { ...safe } = updated;
    return { message: 'User updated', user: safe };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
