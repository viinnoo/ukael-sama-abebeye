import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { access } from 'fs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Endpoint ini digunakan untuk login pengguna. Masukkan username dan password untuk mendapatkan token akses.' })
  @ApiResponse({ status: 201, description: 'Login berhasil. Mengembalikan token akses.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
   })
  @ApiResponse({ status: 401, description: 'Login gagal. Username atau password salah.' })
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}