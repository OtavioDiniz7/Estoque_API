import { OnModuleInit } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseService implements OnModuleInit {
    private configService;
    private supabase;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getClient(): SupabaseClient;
    buscarProdutoPorSku(sku: string): Promise<any>;
    atualizarEstoque(id: string, estoqueTotal: number, estoqueReservado: number): Promise<any>;
    buscarClientePorEmail(email: string): Promise<any>;
    criarCliente(clienteData: any): Promise<any>;
    atualizarCliente(id: string, clienteData: any): Promise<any>;
    buscarVendaPorPedidoId(pedidoIdYampi: string): Promise<any>;
    criarVenda(vendaData: any): Promise<any>;
    atualizarVenda(id: string, vendaData: any): Promise<any>;
    criarWebhookLog(logData: any): Promise<any>;
}
