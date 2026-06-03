import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderDetailService {
  constructor(private prisma: PrismaService) {}

  async getByOrderId(orderId: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Pesanan dengan ID ${orderId} tidak ditemukan.`);
    }

    if (userRole === 'CUSTOMER' && order.userId !== userId) {
      throw new ForbiddenException('Kamu tidak berhak melihat detail pesanan orang lain!');
    }

    const details = await this.prisma.orderDetail.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        menu: true,
      },
    });

    return {
      statusCode: 200,
      message: `Detail untuk pesanan ID ${orderId} berhasil diambil.`,
      orderSummary: {
        id: order.id,
        username: order.username,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
      },
      items: details,
    };
  }
}