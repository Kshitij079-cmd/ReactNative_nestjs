import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true, default: 'New User' })
  name: string;

  @Prop({ unique: true, trim: true })
  username: string;

  @Prop({ unique: true })
  phoneNumber: number;

  @Prop({ unique: true, trim: true })
  email: string;

  @Prop({})
  date_of_birth: Date;

  @Prop({})
  time_of_birth: string;

  @Prop({ trim: true })
  place_of_birth: string;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({ minLength: 6 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
