import { PartialType } from '@nestjs/mapped-types';
import { CreateJwtAuthDto } from './create-jwt-auth.dto';

export class UpdateJwtAuthDto extends PartialType(CreateJwtAuthDto) {}
