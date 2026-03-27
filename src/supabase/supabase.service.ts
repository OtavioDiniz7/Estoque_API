import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_KEY must be configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized successfully');
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Produtos
  async buscarProdutoPorSku(sku: string) {
    const { data, error } = await this.supabase
      .from('produtos')
      .select('*')
      .eq('sku', sku)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.logger.error(`Erro ao buscar produto ${sku}: ${error.message}`);
      throw error;
    }

    return data;
  }

  async atualizarEstoque(id: string, estoqueTotal: number, estoqueReservado: number) {
    const { data, error } = await this.supabase
      .from('produtos')
      .update({
        estoque_total: estoqueTotal,
        estoque_reservado: estoqueReservado,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao atualizar estoque do produto ${id}: ${error.message}`);
      throw error;
    }

    return data;
  }

  // Clientes
  async buscarClientePorEmail(email: string) {
    const { data, error } = await this.supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.logger.error(`Erro ao buscar cliente ${email}: ${error.message}`);
      throw error;
    }

    return data;
  }

  async criarCliente(clienteData: any) {
    const { data, error } = await this.supabase
      .from('clientes')
      .insert([clienteData])
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao criar cliente: ${error.message}`);
      throw error;
    }

    return data;
  }

  async atualizarCliente(id: string, clienteData: any) {
    const { data, error } = await this.supabase
      .from('clientes')
      .update(clienteData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao atualizar cliente ${id}: ${error.message}`);
      throw error;
    }

    return data;
  }

  // Vendas
  async buscarVendaPorPedidoId(pedidoIdYampi: string) {
    const { data, error } = await this.supabase
      .from('vendas')
      .select('*')
      .eq('pedido_id_yampi', pedidoIdYampi)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.logger.error(`Erro ao buscar venda ${pedidoIdYampi}: ${error.message}`);
      throw error;
    }

    return data;
  }

  async criarVenda(vendaData: any) {
    const { data, error } = await this.supabase
      .from('vendas')
      .insert([vendaData])
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao criar venda: ${error.message}`);
      throw error;
    }

    return data;
  }

  async atualizarVenda(id: string, vendaData: any) {
    const { data, error } = await this.supabase
      .from('vendas')
      .update(vendaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao atualizar venda ${id}: ${error.message}`);
      throw error;
    }

    return data;
  }

  // Webhook Logs
  async criarWebhookLog(logData: any) {
    const { data, error } = await this.supabase
      .from('webhook_logs')
      .insert([logData])
      .select()
      .single();

    if (error) {
      this.logger.error(`Erro ao criar webhook log: ${error.message}`);
      throw error;
    }

    return data;
  }
}
