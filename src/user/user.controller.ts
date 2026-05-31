import { Controller, Post, Body, Get, UsePipes, ValidationPipe, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat pengguna baru', description: 'Endpoint ini digunakan untuk membuat pengguna baru. Masukkan nama, username, password, dan role (ADMIN atau CUSTOMER).' })
  @ApiResponse({ status: 201, description: 'Pengguna berhasil dibuat.',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        role: 'CUSTOMER',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
    }
   })

  @ApiResponse({ status: 400, description: 'Permintaan tidak valid. Pastikan semua field diisi dengan benar.' })
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil semua pengguna', description: 'Endpoint ini digunakan untuk mengambil semua pengguna yang terdaftar. Hanya dapat diakses oleh admin.' })
  @ApiResponse({ status: 200, description: 'Mengembalikan daftar semua pengguna.' })
  @ApiResponse({ status: 403, description: 'Ditolak. Hanya admin yang dapat mengakses daftar pengguna.' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil pengguna berdasarkan ID', description: 'Endpoint ini digunakan untuk menemukan pengguna berdasarkan ID-nya. Hanya dapat diakses oleh admin.' })
  @ApiResponse({ status: 200, description: 'Mengembalikan pengguna yang ditemukan.' })
  @ApiResponse({ status: 403, description: 'Ditolak. Hanya admin yang dapat mengakses data pengguna.' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan.' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

}