import { IsString, IsNumber, IsArray, IsNotEmpty, ValidateNested, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ClienteDto } from './cliente.dto';
import { ProdutoDto } from './produto.dto';

export class YampiWebhookDto {
  @ApiProperty({ example: '12345', description: 'ID do pedido na Yampi' })
  @IsString()
  @IsNotEmpty()
  pedido_id: string;

  @ApiProperty({ example: 'created', enum: ['created', 'paid', 'canceled'], description: 'Status do pedido' })
  @IsString()
  @IsIn(['created', 'paid', 'canceled'])
  status: string;

  @ApiProperty({ example: 799, description: 'Valor total do pedido' })
  @IsNumber()
  @Min(0)
  valor_total: number;

  @ApiProperty({ type: ClienteDto, description: 'Dados do cliente' })
  @ValidateNested()
  @Type(() => ClienteDto)
  @IsNotEmpty()
  cliente: ClienteDto;

  @ApiProperty({ type: [ProdutoDto], description: 'Array de produtos do pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos: ProdutoDto[];
}
