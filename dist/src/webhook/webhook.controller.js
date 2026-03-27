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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhook_service_1 = require("./webhook.service");
const yampi_webhook_dto_1 = require("./dto/yampi-webhook.dto");
let WebhookController = WebhookController_1 = class WebhookController {
    webhookService;
    logger = new common_1.Logger(WebhookController_1.name);
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    async receberWebhook(payload) {
        this.logger.log(`Webhook recebido para pedido: ${payload.pedido_id}`);
        try {
            const resultado = await this.webhookService.processarWebhook(payload);
            return resultado;
        }
        catch (error) {
            this.logger.error(`Erro ao processar webhook: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                success: false,
                message: 'Erro ao processar webhook',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('yampi'),
    (0, swagger_1.ApiOperation)({ summary: 'Receber webhook da Yampi' }),
    (0, swagger_1.ApiBody)({ type: yampi_webhook_dto_1.YampiWebhookDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Webhook processado com sucesso',
        schema: {
            example: {
                success: true,
                message: 'Webhook processado',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro ao processar webhook',
        schema: {
            example: {
                success: false,
                message: 'Erro ao processar webhook',
                error: 'Detalhes do erro',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [yampi_webhook_dto_1.YampiWebhookDto]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "receberWebhook", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhook'),
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map