import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProdutoDto {
  @ApiProperty({ example: 'AJV-42', description: 'SKU do produto' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Air Jordan Verde', description: 'Nome do modelo do produto' })
  @IsString()
  @IsNotEmpty()
  nome_modelo: string;

  @ApiProperty({ example: '42', description: 'Numeração do produto' })
  @IsString()
  @IsNotEmpty()
  numeracao: string;

  @ApiProperty({ example: 1, description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiProperty({ example: 799, description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  preco: number;
}
