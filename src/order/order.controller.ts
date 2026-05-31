import { Controller, Post, Body, UseGuards, Req, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat pesanan baru', description: 'Endpoint ini digunakan untuk membuat pesanan baru. Masukkan daftar item yang dipesan beserta jumlahnya.' })
  @ApiResponse({ status: 201, description: 'Pesanan berhasil dibuat.',
    schema: {
      example: {
        id: 1,
        userId: 1,
        username: 'johndoe',
        totalPrice: 30000,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        orderDetails: [
          {
            id: 1,
            menuId: 1,
            quantity: 2,
            price: 15000,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z'
          }
        ]
      }
    }
   })
  @ApiResponse({ status: 400, description: 'Permintaan tidak valid. Pastikan semua field diisi dengan benar dan stok menu mencukupi.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Stok menu dengan ID 1 tidak mencukupi atau tidak ditemukan',
        error: 'Bad Request'
      }
    }
   })
   @ApiResponse({ status: 401, description: 'Unauthorized. Token akses tidak valid atau tidak disertakan.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized resource',
        error: 'Unauthorized'
      }
    }
   })
  @UsePipes(new ValidationPipe())
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const user = req.user; 
    
    return await this.orderService.createOrder(createOrderDto, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil semua pesanan pengguna', description: 'Endpoint ini digunakan untuk mengambil semua pesanan yang dibuat oleh pengguna yang sedang login.' })
  @ApiResponse({ status: 200, description: 'Mengembalikan daftar semua pesanan pengguna.',
    schema: {
      example: [
        {
          id: 1,
          userId: 1,
          username: 'johndoe',
          totalPrice: 30000,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          orderDetails: [
            {
              id: 1,
              menuId: 1,
              quantity: 2,
              price: 15000,
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z'
            }
          ]
        }
      ]
    }
  })
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any) {
    const user = req.user;
    
    return await this.orderService.getOrders(user);
  }
}