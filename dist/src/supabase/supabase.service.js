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
var SupabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
let SupabaseService = SupabaseService_1 = class SupabaseService {
    configService;
    supabase;
    logger = new common_1.Logger(SupabaseService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('SUPABASE_URL and SUPABASE_KEY must be configured');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.logger.log('Supabase client initialized successfully');
    }
    getClient() {
        return this.supabase;
    }
    async buscarProdutoPorSku(sku) {
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
    async atualizarEstoque(id, estoqueTotal, estoqueReservado) {
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
    async buscarClientePorEmail(email) {
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
    async criarCliente(clienteData) {
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
    async atualizarCliente(id, clienteData) {
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
    async buscarVendaPorPedidoId(pedidoIdYampi) {
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
    async criarVenda(vendaData) {
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
    async atualizarVenda(id, vendaData) {
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
    async criarWebhookLog(logData) {
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
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = SupabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map