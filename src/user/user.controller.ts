import { Controller, Post, Body, Get, UsePipes, ValidationPipe, UseGuards, ParseIntPipe, Param, Req, Patch } from '@nestjs/common';
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

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mendapatkan data profil user yang sedang login', description: 'Endpoint ini digunakan untuk memunculkan data akun milik customer/admin yang sedang login berdasarkan token JWT.' })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token tidak valid.' })
  async getProfile(@Req() req: any) {
    const user = req.user;
    const finalId = user.id ?? user.userId ?? user.sub;
    return await this.userService.getProfile(Number(finalId)); 
  }

  @Patch('profile/update')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengupdate data profil user yang sedang login', description: 'Endpoint ini digunakan untuk mengedit data username atau nama milik user yang sedang aktif.' })
  @ApiResponse({ status: 200, description: 'Profil berhasil diperbarui.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Profile user ditemukan!',
        data: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          role: 'CUSTOMER',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      }
    }
   })
  @ApiResponse({ status: 400, description: 'Permintaan tidak valid. Pastikan data yang dikirim benar dan tidak kosong.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Tidak ada data profil yang dikirim untuk diperbarui.'
      }
    }
   })
  @ApiResponse({ status: 401, description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized. Token tidak valid.'
      }
    }
   })
  async updateProfile(
    @Req() req: any, 
    @Body() updateData: { username?: string; name?: string }
  ) {
    const user = req.user;
    const finalId = user.id ?? user.userId ?? user.sub;
    return await this.userService.updateProfile(Number(finalId), updateData);
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