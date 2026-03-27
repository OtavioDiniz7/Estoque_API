import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnderecoDto {
  @ApiProperty({ example: '36420000', description: 'CEP do endereço' })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({ example: 'Rua A', description: 'Nome da rua' })
  @IsString()
  @IsNotEmpty()
  rua: string;

  @ApiProperty({ example: '123', description: 'Número do endereço' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({ example: 'Ouro Branco', description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  cidade: string;
}
