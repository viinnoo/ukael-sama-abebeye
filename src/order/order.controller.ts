import { Controller, Post, Body, UseGuards, Req, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const user = req.user; 
    
    return await this.orderService.createOrder(createOrderDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any) {
    const user = req.user;
    
    return await this.orderService.getOrders(user);
  }
}