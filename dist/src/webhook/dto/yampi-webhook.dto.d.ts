import { ClienteDto } from './cliente.dto';
import { ProdutoDto } from './produto.dto';
export declare class YampiWebhookDto {
    pedido_id: string;
    status: string;
    valor_total: number;
    cliente: ClienteDto;
    produtos: ProdutoDto[];
}
