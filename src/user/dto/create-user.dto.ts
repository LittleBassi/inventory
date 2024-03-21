import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    type: 'string',
    default: 'Foo Bar',
  })
  @IsNotEmpty({ message: 'Nome deve ser preenchido' })
  name: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: 'string',
    default: '123',
  })
  @IsNotEmpty({ message: 'Senha deve ser preenchida' })
  password: string;
}
