import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class OrderDetailService {
  constructor(private prisma: PrismaService) {}

  async findByOrder(orderId: number) {
    if (!orderId) {
      throw new Error('orderId harus diberikan');
    }

    return await this.prisma.orderDetail.findMany({
      where: { orderId },
      include: { menu: true } 
    });
  }
}
