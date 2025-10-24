/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Twilio from 'twilio';
import * as dotenv from 'dotenv';
import { randomInt } from 'crypto';
dotenv.config();

@Injectable()
export class UsersService {
  private readonly twilioClient: any;

  constructor() {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = Twilio(accountSid, authToken);
  }

  // Method to generate OTP
  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }

  // Method to send OTP via SMS using Twilio
  async sendOtpToMobile(phoneNumber: string): Promise<string> {
    const otp = this.generateOtp();

    try {
      // Send OTP via SMS using Twilio
      await this.twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return otp; // Return OTP to save it for verification
    } catch (error) {
      console.error('Error sending OTP via SMS', error);
      throw new Error('Failed to send OTP via SMS');
    }
  }

  // Method to generate and send OTP to both mobile and email
  async sendOtp(phoneNumber: string): Promise<{ otp: string }> {
    const otp = await this.sendOtpToMobile(phoneNumber);
    // Store OTP in a cache, database, or memory for verification (with expiry)
    return { otp };
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
