import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID menu yang dipesan' })
  @IsInt()
  @IsNotEmpty()
  menuId!: number;

  @ApiProperty({ example: 2, description: 'Jumlah item yang dipesan' })
  @IsInt()
  @IsNotEmpty()
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: [
      {
        menuId: 1,
        quantity: 2
      }
    ],
    description: 'Daftar item yang dipesan'
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}