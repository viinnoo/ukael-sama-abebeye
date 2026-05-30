import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async createOrder(createOrderDto: CreateOrderDto, user: any) {
    const { items } = createOrderDto;

    return await this.prisma.$transaction(async (tx) => {
      let total = 0;
      const detailRecords: any[] = [];

      for (const item of items) {
        // 1. Cek menu dan stoknya
        const menu = await tx.menu.findUnique({
          where: { id: item.menuId },
        });

        if (!menu || menu.stock < item.quantity) {
          throw new BadRequestException(
            `Stok menu dengan ID ${item.menuId} tidak mencukupi atau tidak ditemukan`
          );
        }

        await tx.menu.update({
          where: { id: item.menuId },
          data: { stock: menu.stock - item.quantity },
        });

        const itemTotal = menu.price * item.quantity;
        total += itemTotal;
        
        detailRecords.push({
          menuId: item.menuId,
          quantity: item.quantity,
          price: menu.price,
        });
      }

        const order = await tx.order.create({
          data: {
            userId: user.userId,      
            username: user.username,  
            totalPrice: total,
            orderDetails: {
              create: detailRecords,
            },
          },
          include: {
            orderDetails: true,
          },
        });

        return order;
      });
  }

  async getOrders(user: any) {
    if (user.role === 'CUSTOMER') {
      return await this.prisma.order.findMany({
        where: { userId: user.userId },
        include: {
          orderDetails: {
            include: {
              menu: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return await this.prisma.order.findMany({
      include: {
        orderDetails: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

}