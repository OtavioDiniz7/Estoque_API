import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from './endereco.dto';

export class ClienteDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do cliente' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do cliente' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '319999999', description: 'Telefone do cliente' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ type: EnderecoDto, description: 'Endereço do cliente' })
  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsNotEmpty()
  endereco: EnderecoDto;
}
