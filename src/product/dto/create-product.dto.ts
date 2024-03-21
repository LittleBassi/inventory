import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    type: 'string',
    default: 'Product',
  })
  @IsNotEmpty({ message: 'Nome deve ser preenchido' })
  name: string;

  @ApiProperty({
    description: 'Preço do produto',
    type: 'number',
    default: '1.99',
  })
  @IsNotEmpty({ message: 'Preço deve ser preenchido' })
  price: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    type: 'number',
    default: '1',
  })
  @IsNotEmpty({ message: 'Quantidade deve ser preenchida' })
  amount: number;
}
