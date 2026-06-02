import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan path ke PrismaService sudah sesuai dengan struktur foldermu

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: number, 
    username: string, 
    items: { menuId: number; quantity: number }[]
  ) {
    return await this.prisma.$transaction(async (tx) => {
      
      const itemsWithPrice = await Promise.all(
        items.map(async (item) => {
          const menu = await tx.menu.findUnique({
            where: { id: item.menuId },
          });

          if (!menu) {
            throw new NotFoundException(`Menu dengan ID ${item.menuId} tidak ditemukan.`);
          }

          return {
            menuId: item.menuId,
            quantity: item.quantity,
            price: menu.price,
            subTotal: menu.price * item.quantity,
          };
        })
      );

      const totalCalculated = itemsWithPrice.reduce((sum, item) => sum + item.subTotal, 0);

      const order = await tx.order.create({
        data: {
          userId: userId,
          username: username,
          totalPrice: totalCalculated,
        },
      });

      const orderDetailsData = itemsWithPrice.map((item) => ({
        orderId: order.id,
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderDetail.createMany({
        data: orderDetailsData,
      });

      return {
        statusCode: 201,
        message: 'Order berhasil dibuat!',
        data: {
          orderId: order.id,
          username: order.username,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
        },
      };
    });
  }

  async findAllByUser(userId: number) {
    return await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderDetails: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

}