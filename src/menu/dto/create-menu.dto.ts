import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}