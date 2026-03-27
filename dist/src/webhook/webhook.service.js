"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let WebhookService = WebhookService_1 = class WebhookService {
    supabaseService;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async processarWebhook(payload) {
        this.logger.log(`Processando webhook para pedido ${payload.pedido_id}`);
        const erros = [];
        try {
            const vendaExistente = await this.supabaseService.buscarVendaPorPedidoId(payload.pedido_id);
            const statusAnterior = vendaExistente?.status;
            try {
                await this.processarCliente(payload.cliente);
            }
            catch (error) {
                const errorMsg = `Erro ao processar cliente: ${error.message}`;
                this.logger.error(errorMsg);
                erros.push(errorMsg);
            }
            if (payload.status === 'created') {
                for (const produto of payload.produtos) {
                    try {
                        await this.reservarEstoque(produto.sku, produto.quantidade);
                    }
                    catch (error) {
                        const errorMsg = `Erro ao reservar produto ${produto.sku}: ${error.message}`;
                        this.logger.error(errorMsg);
                        erros.push(errorMsg);
                    }
                }
            }
            if (payload.status === 'canceled') {
                for (const produto of payload.produtos) {
                    try {
                        await this.devolverReserva(produto.sku, produto.quantidade);
                    }
                    catch (error) {
                        const errorMsg = `Erro ao devolver reserva ${produto.sku}: ${error.message}`;
                        this.logger.error(errorMsg);
                        erros.push(errorMsg);
                    }
                }
            }
            if (payload.status === 'paid' && statusAnterior !== 'paid') {
                for (const produto of payload.produtos) {
                    try {
                        await this.processarEstoque(produto.sku, produto.quantidade);
                    }
                    catch (error) {
                        const errorMsg = `Erro ao processar produto ${produto.sku}: ${error.message}`;
                        this.logger.error(errorMsg);
                        erros.push(errorMsg);
                    }
                }
            }
            else if (payload.status === 'paid' && statusAnterior === 'paid') {
                this.logger.warn(`Pedido ${payload.pedido_id} já foi marcado como 'paid' anteriormente. Estoque não será alterado novamente.`);
            }
            try {
                await this.processarVenda(payload.pedido_id, payload.status, payload.valor_total);
            }
            catch (error) {
                const errorMsg = `Erro ao processar venda: ${error.message}`;
                this.logger.error(errorMsg);
                erros.push(errorMsg);
            }
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
        }
        catch (error) {
            this.logger.error(`Erro geral ao processar webhook: ${error.message}`);
            try {
                await this.supabaseService.criarWebhookLog({
                    pedido_id: payload.pedido_id,
                    payload: payload,
                    status_processamento: 'erro',
                    erro: error.message,
                });
            }
            catch (logError) {
                this.logger.error(`Erro ao salvar log de webhook: ${logError.message}`);
            }
            throw error;
        }
    }
    async processarEstoque(sku, quantidade) {
        const produto = await this.supabaseService.buscarProdutoPorSku(sku);
        if (!produto) {
            throw new Error(`Produto com SKU ${sku} não encontrado`);
        }
        const novoEstoqueTotal = produto.estoque_total - quantidade;
        const novoReservado = produto.estoque_reservado - quantidade;
        if (novoEstoqueTotal < 0) {
            throw new Error(`Estoque insuficiente para SKU ${sku}. Estoque atual: ${produto.estoque_total}, Quantidade solicitada: ${quantidade}`);
        }
        await this.supabaseService.atualizarEstoque(produto.id, novoEstoqueTotal, novoReservado < 0 ? 0 : novoReservado);
        this.logger.log(`[${sku}] BAIXA DEFINITIVA em ${quantidade}. Total: ${novoEstoqueTotal} | Reservado: ${novoReservado}`);
    }
    async reservarEstoque(sku, quantidade) {
        const produto = await this.supabaseService.buscarProdutoPorSku(sku);
        if (!produto) {
            throw new Error(`Produto com SKU ${sku} não encontrado`);
        }
        const estoqueDisponivel = produto.estoque_total - produto.estoque_reservado;
        if (estoqueDisponivel < quantidade) {
            throw new Error(`Estoque insuficiente para reservar SKU ${sku}. Disponível: ${estoqueDisponivel}`);
        }
        const novoReservado = produto.estoque_reservado + quantidade;
        await this.supabaseService.atualizarEstoque(produto.id, produto.estoque_total, novoReservado);
        this.logger.log(`[${sku}] Estoque RESERVADO em ${quantidade}. Reservado atual: ${novoReservado}`);
    }
    async devolverReserva(sku, quantidade) {
        const produto = await this.supabaseService.buscarProdutoPorSku(sku);
        if (!produto) {
            throw new Error(`Produto com SKU ${sku} não encontrado`);
        }
        const novoReservado = produto.estoque_reservado - quantidade;
        await this.supabaseService.atualizarEstoque(produto.id, produto.estoque_total, novoReservado < 0 ? 0 : novoReservado);
        this.logger.log(`[${sku}] Reserva DEVOLVIDA em ${quantidade}. Reservado atual: ${novoReservado}`);
    }
    async processarCliente(clienteData) {
        const clienteExistente = await this.supabaseService.buscarClientePorEmail(clienteData.email);
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
        }
        else {
            await this.supabaseService.criarCliente(dadosCliente);
            this.logger.log(`Cliente criado: ${clienteData.email}`);
        }
    }
    async processarVenda(pedidoIdYampi, status, valorTotal) {
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
        }
        else {
            await this.supabaseService.criarVenda(dadosVenda);
            this.logger.log(`Venda criada: ${pedidoIdYampi}`);
        }
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map