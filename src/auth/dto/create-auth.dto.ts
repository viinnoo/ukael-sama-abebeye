import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'vinokazu',
    description: 'Username user yang sudah terdaftar',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    example: 'passwordRahasia123',
    description: 'Password minimal 6 karakter',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}