import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat item menu baru',
    description: 'Endpoint ini digunakan untuk membuat item menu baru. Hanya dapat diakses oleh admin.'
   })
  @ApiResponse({ status: 201, description: 'Menu item telah berhasil dibuat.',
    schema: {
      example: {
        id: 12,
        name: 'Nasi Goreng Spesial',
        price: 15000,
        category: 'FOOD',
        createdAt: '2026-05-31T03:00:00.000Z',
        updatedAt: '2026-05-31T03:00:00.000Z'
      }
    }
   })
  @ApiResponse({ status: 403, description: 'Ditolak. Hanya admin yang dapat membuat item menu.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
   })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil semua item menu',
    description: 'Endpoint ini digunakan untuk mengambil semua item menu yang tersedia.'
   })
  @ApiResponse({ status: 200, description: 'Return all menu items.',
    schema: {
      example: [
        {
          id: 12,
          name: 'Nasi Goreng Spesial',
          price: 15000,
          category: 'FOOD',
          createdAt: '2026-05-31T03:00:00.000Z',
          updatedAt: '2026-05-31T03:00:00.000Z'
        },
        {
          id: 15,
          name: 'Es Teh Manis',
          price: 5000,
          category: 'DRINK',
          createdAt: '2026-05-31T03:00:00.000Z',
          updatedAt: '2026-05-31T03:00:00.000Z'
        }
      ]
    }
   })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil item menu berdasarkan ID',
    description: 'Endpoint ini digunakan untuk menemukan item menu berdasarkan ID-nya.'
  })
  @ApiResponse({ status: 200, description: 'Mengembalikan item menu yang ditemukan.',
    schema: {
      example: {
        id: 12,
        name: 'Nasi Goreng Spesial',
        price: 15000,
        category: 'FOOD',
        createdAt: '2026-05-31T03:00:00.000Z',
        updatedAt: '2026-05-31T03:00:00.000Z'
      }
    }
   })
  @ApiResponse({ status: 404, description: 'Item menu tidak ditemukan.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Menu with ID 999 not found',
        error: 'Not Found'
      }
    }
   })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Mengambil item menu berdasarkan kategori',
    description: 'Endpoint ini digunakan untuk menemukan item menu berdasarkan kategorinya.'
   })
  @ApiResponse({ status: 200, description: 'Mengembalikan item menu dalam kategori yang ditentukan.',
    schema: {
      example: [
        {
          id: 12,
          name: 'Nasi Goreng Spesial',
          price: 15000,
          category: 'FOOD',
          createdAt: '2026-05-31T03:00:00.000Z',
          updatedAt: '2026-05-31T03:00:00.000Z'
        },
        {
          id: 15,
          name: 'Es Teh Manis',
          price: 5000,
          category: 'DRINK',
          createdAt: '2026-05-31T03:00:00.000Z',
          updatedAt: '2026-05-31T03:00:00.000Z'
        }
      ]
    }
   })
  findByCategory(@Param('category') category: string) {
    return this.menuService.findByCategory(category);
}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item',
    description: 'Endpoint ini digunakan untuk memperbarui item menu. Hanya dapat diakses oleh admin.'
   })
  @ApiResponse({ status: 200, description: 'Menu item telah berhasil diperbarui.',
    schema: {
      example: {
        id: 12,
        name: 'Nasi Goreng Spesial',
        price: 15000,
        category: 'FOOD',
        createdAt: '2026-05-31T03:00:00.000Z',
        updatedAt: '2026-05-31T03:00:00.000Z'
      }
    }
   })
  @ApiResponse({ status: 403, description: 'Ditolak. Hanya admin yang dapat memperbarui item menu.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
   })
  @ApiResponse({ status: 404, description: 'Item menu tidak ditemukan.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Menu with ID 999 not found',
        error: 'Not Found'
      }
    }
   })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus item menu',
    description: 'Endpoint ini digunakan untuk menghapus item menu. Hanya dapat diakses oleh admin.'
   })
  @ApiResponse({ status: 200, description: 'Menu item telah berhasil dihapus.',
    schema: {
      example: {
        message: 'Menu with ID 12 has been deleted successfully'
      }
    }
   })
  @ApiResponse({ status: 403, description: 'Ditolak. Hanya admin yang dapat menghapus item menu.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
   })
  @ApiResponse({ status: 404, description: 'Item menu tidak ditemukan.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Menu with ID 999 not found',
        error: 'Not Found'
      }
    }
   })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
