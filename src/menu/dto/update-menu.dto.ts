import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  @ApiProperty({example: 'Nasi Goreng', description: 'Nama item menu' }) 
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Nasi goreng dengan telur dan sayuran', description: 'Deskripsi item menu' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 15000, description: 'Harga item menu' })
  price?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Makanan', description: 'Kategori item menu' })
  category?: string;

  @ApiProperty({ example: 'https://example.com/images/nasi-goreng.jpg', description: 'URL gambar untuk menu' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 10, description: 'Stok item menu' })
  stock?: number;
}