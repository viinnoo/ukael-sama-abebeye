import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan!');
    }

    return {statusCode: 200, message: 'Profile user ditemukan!', data: user};
  }

  async updateProfile(userId: number, updateData: { username?: string; name?: string; email?: string }) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    }); 

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('Tidak ada data profil yang dikirim untuk diperbarui.');
    }

    if (!userExists) {
      throw new NotFoundException('User tidak ditemukan!');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
    });

    return { statusCode: 200, message: 'Profile user berhasil diperbarui!', data: updatedUser };
  }
}