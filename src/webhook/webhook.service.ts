import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { YampiWebhookDto } from './dto/yampi-webhook.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async processarWebhook(payload: YampiWebhookDto) {
    this.logger.log(`Processando webhook para pedido ${payload.pedido_id}`);

    const erros: string[] = [];

    try {
      // 1. Verificar venda existente para evitar duplicatas
      const vendaExistente = await this.supabaseService.buscarVendaPorPedidoId(payload.pedido_id);
      const statusAnterior = vendaExistente?.status;

      // 2. Criar ou atualizar cliente
      try {
        await this.processarCliente(payload.cliente);
      } catch (error) {
        const errorMsg = `Erro ao processar cliente: ${error.message}`;
        this.logger.error(errorMsg);
        erros.push(errorMsg);
      }
// RESERVA quando pedido criado
if (payload.status === 'created') {
  for (const produto of payload.produtos) {
    try {
      await this.reservarEstoque(produto.sku, produto.quantidade);
    } catch (error) {
      const errorMsg = `Erro ao reservar produto ${produto.sku}: ${error.message}`;
      this.logger.error(errorMsg);
      erros.push(errorMsg);
    }
  }
}

// DEVOLVE reserva quando cancelado
if (payload.status === 'canceled') {
  for (const produto of payload.produtos) {
    try {
      await this.devolverReserva(produto.sku, produto.quantidade);
    } catch (error) {
      const errorMsg = `Erro ao devolver reserva ${produto.sku}: ${error.message}`;
      this.logger.error(errorMsg);
      erros.push(errorMsg);
    }
  }
}
      // 3. Processar estoque (apenas se status = paid E ainda não foi pago antes)
      if (payload.status === 'paid' && statusAnterior !== 'paid') {
        for (const produto of payload.produtos) {
          try {
            await this.processarEstoque(produto.sku, produto.quantidade);
          } catch (error) {
            const errorMsg = `Erro ao processar produto ${produto.sku}: ${error.message}`;
            this.logger.error(errorMsg);
            erros.push(errorMsg);
          }
        }
      } else if (payload.status === 'paid' && statusAnterior === 'paid') {
        this.logger.warn(`Pedido ${payload.pedido_id} já foi marcado como 'paid' anteriormente. Estoque não será alterado novamente.`);
      }

      // 4. Criar ou atualizar venda
      try {
        await this.processarVenda(payload.pedido_id, payload.status, payload.valor_total);
      } catch (error) {
        const errorMsg = `Erro ao processar venda: ${error.message}`;
        this.logger.error(errorMsg);
        erros.push(errorMsg);
      }

      // 5. Salvar log do webhook
      const statusProcessamento = erros.length > 0 ? 'erro' : 'sucesso';
      const erroMsg = erros.length > 0 ? erros.join('; ') : null;

      await this.supabaseService.criarWebhookLog({
        pedido_id: payload.pedido_id,
        payload: payload,
        status_processamento: statusProcessamento,
        erro: erroMsg,
      });

      if (erros.length > 0) {
        throw new Error(erros.join('; '));
      }

      this.logger.log(`Webhook processado com sucesso para pedido ${payload.pedido_id}`);
      return { success: true, message: 'Webhook processado' };
    } catch (error) {
      this.logger.error(`Erro geral ao processar webhook: ${error.message}`);
      
      // Salvar log de erro se ainda não foi salvo
      try {
        await this.supabaseService.criarWebhookLog({
          pedido_id: payload.pedido_id,
          payload: payload,
          status_processamento: 'erro',
          erro: error.message,
        });
      } catch (logError) {
        this.logger.error(`Erro ao salvar log de webhook: ${logError.message}`);
      }

      throw error;
    }
  }

private async processarEstoque(sku: string, quantidade: number) {
  const produto = await this.supabaseService.buscarProdutoPorSku(sku);

  if (!produto) {
    throw new Error(`Produto com SKU ${sku} não encontrado`);
  }

  // Calcular novos valores
  const novoEstoqueTotal = produto.estoque_total - quantidade;
  const novoReservado = produto.estoque_reservado - quantidade;

  // Validar que estoque não fique negativo
  if (novoEstoqueTotal < 0) {
    throw new Error(
      `Estoque insuficiente para SKU ${sku}. Estoque atual: ${produto.estoque_total}, Quantidade solicitada: ${quantidade}`,
    );
  }

  // Atualizar estoque (baixa total e reservado)
  await this.supabaseService.atualizarEstoque(
    produto.id,
    novoEstoqueTotal,
    novoReservado < 0 ? 0 : novoReservado,
  );

  this.logger.log(
    `[${sku}] BAIXA DEFINITIVA em ${quantidade}. Total: ${novoEstoqueTotal} | Reservado: ${novoReservado}`,
  );
}
private async reservarEstoque(sku: string, quantidade: number) {
  const produto = await this.supabaseService.buscarProdutoPorSku(sku);

  if (!produto) {
    throw new Error(`Produto com SKU ${sku} não encontrado`);
  }

  const estoqueDisponivel = produto.estoque_total - produto.estoque_reservado;

  if (estoqueDisponivel < quantidade) {
    throw new Error(
      `Estoque insuficiente para reservar SKU ${sku}. Disponível: ${estoqueDisponivel}`,
    );
  }

  const novoReservado = produto.estoque_reservado + quantidade;

  await this.supabaseService.atualizarEstoque(
    produto.id,
    produto.estoque_total,
    novoReservado,
  );

  this.logger.log(
    `[${sku}] Estoque RESERVADO em ${quantidade}. Reservado atual: ${novoReservado}`,
  );
}
private async devolverReserva(sku: string, quantidade: number) {
  const produto = await this.supabaseService.buscarProdutoPorSku(sku);

  if (!produto) {
    throw new Error(`Produto com SKU ${sku} não encontrado`);
  }

  const novoReservado = produto.estoque_reservado - quantidade;

  await this.supabaseService.atualizarEstoque(
    produto.id,
    produto.estoque_total,
    novoReservado < 0 ? 0 : novoReservado,
  );

  this.logger.log(
    `[${sku}] Reserva DEVOLVIDA em ${quantidade}. Reservado atual: ${novoReservado}`,
  );
}
  private async processarCliente(clienteData: any) {
    const clienteExistente = await this.supabaseService.buscarClientePorEmail(
      clienteData.email,
    );

    const dadosCliente = {
      nome: clienteData.nome,
      email: clienteData.email,
      telefone: clienteData.telefone,
      cep: clienteData.endereco.cep,
      rua: clienteData.endereco.rua,
      numero: clienteData.endereco.numero,
      bairro: clienteData.endereco.bairro,
      cidade: clienteData.endereco.cidade,
    };

    if (clienteExistente) {
      await this.supabaseService.atualizarCliente(clienteExistente.id, dadosCliente);
      this.logger.log(`Cliente atualizado: ${clienteData.email}`);
    } else {
      await this.supabaseService.criarCliente(dadosCliente);
      this.logger.log(`Cliente criado: ${clienteData.email}`);
    }
  }

  private async processarVenda(pedidoIdYampi: string, status: string, valorTotal: number) {
    const vendaExistente = await this.supabaseService.buscarVendaPorPedidoId(pedidoIdYampi);

    const dadosVenda = {
      pedido_id_yampi: pedidoIdYampi,
      status: status,
      valor_total: valorTotal,
    };

    if (vendaExistente) {
      await this.supabaseService.atualizarVenda(vendaExistente.id, {
        status: status,
        valor_total: valorTotal,
      });
      this.logger.log(`Venda atualizada: ${pedidoIdYampi}`);
    } else {
      await this.supabaseService.criarVenda(dadosVenda);
      this.logger.log(`Venda criada: ${pedidoIdYampi}`);
    }
  }
}
