import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  async getByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderDetailService.findByOrder(orderId);
  }
}