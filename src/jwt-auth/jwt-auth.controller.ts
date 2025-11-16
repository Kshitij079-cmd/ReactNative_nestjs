/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { CreateJwtAuthDto } from './dto/create-jwt-auth.dto';
import { UpdateJwtAuthDto } from './dto/update-jwt-auth.dto';

@Controller('jwt-auth')
export class JwtAuthController {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  @Post()
  // create(@Body() createJwtAuthDto: CreateJwtAuthDto) {
  //   return this.jwtAuthService.create(createJwtAuthDto);
  // }
  @Get()
  findAll() {
    return this.jwtAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jwtAuthService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJwtAuthDto: UpdateJwtAuthDto) {
  //   return this.jwtAuthService.update(+id, updateJwtAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jwtAuthService.remove(+id);
  }
}
