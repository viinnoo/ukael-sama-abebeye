import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Order Detail')
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get(':orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mengambil detail pesanan berdasarkan ID pesanan', 
    description: 'Endpoint ini digunakan untuk mengambil detail pesanan berdasarkan ID pesanan. Hanya dapat diakses oleh admin.' 
  })
  @ApiParam({ name: 'orderId', example: 1, description: 'ID pesanan yang ingin diambil detailnya' })
  @ApiResponse({ status: 200, description: 'Mengembalikan detail pesanan yang ditemukan.',
    schema: {
      example: [
        {
          id: 1,
          orderId: 1,
          menuId: 1,
          quantity: 2,
          price: 15000,
          menu: {
            id: 1,
            name: 'Nasi Goreng Spesial',
            category: 'MAKANAN'
          },
        },
        {
          id: 2,
          orderId: 1,
          menuId: 2,
          quantity: 1,
          price: 10000,
          menu: {
            id: 2,
            name: 'Es Teh Manis',
            category: 'MINUMAN'
          },
        }
      ]
    }
   })
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async findByOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() req: any) {
    const user = req.user;

    const finalUserId = user.id?? user.userId?? user.sub;

    return await this.orderDetailService.getByOrderId(orderId, Number(finalUserId), user.role);
  }
}