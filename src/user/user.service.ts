import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username sudah terdaftar!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        username: createUserDto.username,
        password: hashedPassword,
        role: createUserDto.role,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    if (!await this.prisma.user.findMany()) {
      throw new NotFoundException('Belum ada user yang dibuat');
    }

    return await this.prisma.user.findMany({
      select: { id: true, name: true, username: true, role: true },
    });
  }

async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {id: true, name: true, username: true, role: true, createdAt: true},
    });

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan!`);
    }

    return user;
  }
}