import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password minimal harus 6 karakter' })
    password!: string;

    @IsEnum(UserRole, { message: 'Role harus ADMIN atau CUSTOMER' })
    @IsNotEmpty()
    role!: UserRole;
}