import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

export class CreateUserDto {
    @ApiProperty({ example: 'Vinokazu', description: 'Nama lengkap pengguna' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'vinokazu', description: 'Username unik untuk login' })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ example: 'password123', description: 'Password untuk login' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password minimal harus 6 karakter' })
    password!: string;

    @ApiProperty({ example: 'CUSTOMER', description: 'Role pengguna', enum: ['ADMIN', 'CUSTOMER'] })
    @IsEnum(UserRole, { message: 'Role harus ADMIN atau CUSTOMER' })
    @IsNotEmpty()
    role!: UserRole;
}