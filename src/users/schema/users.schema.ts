import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true })
  phone: number;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  date_of_birth: Date;

  @Prop({ required: true })
  time_of_birth: string;

  @Prop({ required: true, trim: true })
  place_of_birth: string;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Prop({ required: true, minLength: 6 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
