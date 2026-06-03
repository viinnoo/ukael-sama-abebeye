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
  @UsePipes(new ValidationPipe())
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
  @ApiResponse({ status: 400, description: 'Permintaan tidak valid. Pastikan semua field diisi dengan benar dan stok menu mencukupi.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token akses tidak valid atau tidak disertakan.' })
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const user = req.user; 
    
    return await this.orderService.createOrder(user.id, user.username, createOrderDto.items);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil semua pesanan pengguna', description: 'Endpoint ini digunakan untuk mengambil semua pesanan yang dibuat oleh pengguna yang sedang login.' })
  @ApiResponse({ status: 200, description: 'Mengembalikan daftar semua pesanan pengguna.' })
  async findAll(@Req() req: any) {
    const user = req.user;

    if (user.role === 'ADMIN') {
      return await this.orderService.findAllByAdmin();
    }

    const finalUserId = user.id?? user.userId?? user.sub;
    return await this.orderService.findAllByUser(Number(finalUserId));
  }
}