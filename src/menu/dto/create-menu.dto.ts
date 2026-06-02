import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Spesial', description: 'Nama makanan atau minuman' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Nasi goreng dengan telur, ayam, dan sayuran', description: 'Deskripsi singkat tentang menu' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15000, description: 'Harga dalam satuan Rupiah' })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ example: 'MAKANAN', description: 'Kategori item (MAKANAN / MINUMAN)', enum: ['MAKANAN', 'MINUMAN', 'LAINNYA'] })
  @IsEnum(['MAKANAN', 'MINUMAN', 'LAINNYA'])
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'https://example.com/images/nasi-goreng.jpg', description: 'URL gambar untuk menu' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 10, description: 'Jumlah stok item menu' })
  @Min(0)
  @IsNumber()
  @IsOptional()
  stock?: number;
}