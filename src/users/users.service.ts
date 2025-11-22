/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
import { randomInt } from 'crypto';
import { User, UserDocument } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';
dotenv.config();

@Injectable()
export class UsersService {
  private readonly twilioClient: Twilio;
  private readonly verifyServiceSid: string;
  private readonly logger = new Logger(UsersService.name);
  // private readonly jwtAuthService: JwtAuthService;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => JwtAuthService))
    private readonly jwtAuthService: JwtAuthService
  ) {
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = new Twilio(accountSid, authToken);
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  }

  // Method to generate OTP
  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }
  async findPhone(phoneNumber: string) {
    // Implement logic to find if the phone number exists in your database
    const user = await this.userModel.findOne({ phone: phoneNumber });
    console.log('User found with phone number:', user);
    return user;
  }
  // Method to send OTP via SMS using Twilio
  async sendOtpToMobile(phoneNumber: string): Promise<void> {
    try {
      // Send OTP via SMS using Twilio
      const otpSender = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      console.log('OTP sent via SMS:', otpSender.sid);
      return;
      // Return OTP to save it for verification
    } catch (error) {
      console.error('Error sending OTP via SMS', error);
      throw new Error('Failed to send OTP via SMS');
    }
  }

  // Method to generate and send OTP to both mobile and email
  async sendOtp(phoneNumber: string): Promise<void> {
    await this.sendOtpToMobile(phoneNumber);
    // Store OTP in a cache, database, or memory for verification (with expiry)
    return;
  }
  async verifyOtp(phoneNumber: string, code: string) {
    console.log('verifyOtp called with:', phoneNumber, code);
    const verification = await this.twilioClient.verify.v2
      .services(this.verifyServiceSid)
      .verificationChecks.create({ code: code, to: phoneNumber });
    console.log('VERIFICATION:', verification);
    if (verification.status !== 'approved') {
      return { msg: 'not verified' };
    } else {
      const findPhoneQuery = { phoneNumber: phoneNumber }; // change to { phoneNumber: phoneNumber } if your schema uses phoneNumber
      const user = await this.userModel.findOne(findPhoneQuery).exec();
      console.log('User found during OTP verification:', user);
      if (!user) {
        console.log('User with this phone number does not exist');
        const newUser = new this.userModel({ phoneNumber: phoneNumber });
        await newUser.save();
        //give token with limited access
        // const tokenObj = await this.jwtAuthService.createtokenForUser(newUser);
        console.log('New user created with phone number:', phoneNumber);
        this.logger.log(`Created new user for ${phoneNumber}`);
        return { message: 'User created', user };
      } else if (user) {
        //then let user login in system with it real name and issue JWT token
        console.log(
          'User logged in successfully with phone number:',
          { user }
        );
      }
      const tokenObj = await this.jwtAuthService.createtokenForUser(user);
      console.log({ tokenObj }, 'tokenObj');
      return {
        message: 'OK',
        user,
        token: tokenObj.accessToken,
        expiresIn: tokenObj.expiresIn,
      };
    }
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true, runValidators: true })
      .exec();
    console.log("Inside User Service's update user function", updated)

    return updated;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: any) {
    const findUserInfo = await this.userModel.findById(id).exec();
    console.log('User found with ID:', findUserInfo);

    return findUserInfo;
  }



  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
