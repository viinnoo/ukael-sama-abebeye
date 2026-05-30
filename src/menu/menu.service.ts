import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto
    });
  }

  async findAll() {
    return this.prisma.menu.findMany();
  }

  async findOne(id: number) {
    if (!await this.prisma.menu.findUnique({ where: { id } })) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return await this.prisma.menu.findUnique({
      where: {
        id: Number(id)
      }
    });
  }

  async findByCategory(category: string) {
    return await this.prisma.menu.findMany({
      where: {
        category: category
      }
    });
  }

  async updateStok(id: number, quantity: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id: Number(id) } });

    if (!menu) throw new Error('Menu tidak ditemukan');

    return await this.prisma.menu.update({
      where: { id: Number(id) },
      data: {
        stock: menu.stock + quantity, // quantity bisa positif (tambah) atau negatif (kurang)
      },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.prisma.menu.findUnique({ where: { id } });

    if (!existingMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    let isUpdated = false;
    for (const key in updateMenuDto) {
      if (updateMenuDto[key] !== undefined && updateMenuDto[key] !== existingMenu[key]) {
        isUpdated = true;
        break;
      }
    }

    if (!isUpdated) {
      throw new BadRequestException('No valid fields to update');
    }

    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto
    });
  }

  async remove(id: number) {
    if (!await this.prisma.menu.findUnique({ where: { id } })) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return this.prisma.menu.delete({
      where: { id }
    });
  }
}