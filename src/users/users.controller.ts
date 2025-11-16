/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('send-otp')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
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
  constructor(private readonly usersService: UsersService) {}
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
  constructor(private readonly usersService: UsersService) {}

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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
