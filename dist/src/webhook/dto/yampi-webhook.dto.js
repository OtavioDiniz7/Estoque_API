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
Object.defineProperty(exports, "__esModule", { value: true });
exports.YampiWebhookDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const cliente_dto_1 = require("./cliente.dto");
const produto_dto_1 = require("./produto.dto");
class YampiWebhookDto {
    pedido_id;
    status;
    valor_total;
    cliente;
    produtos;
}
exports.YampiWebhookDto = YampiWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345', description: 'ID do pedido na Yampi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], YampiWebhookDto.prototype, "pedido_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'created', enum: ['created', 'paid', 'canceled'], description: 'Status do pedido' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['created', 'paid', 'canceled']),
    __metadata("design:type", String)
], YampiWebhookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 799, description: 'Valor total do pedido' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], YampiWebhookDto.prototype, "valor_total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: cliente_dto_1.ClienteDto, description: 'Dados do cliente' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => cliente_dto_1.ClienteDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", cliente_dto_1.ClienteDto)
], YampiWebhookDto.prototype, "cliente", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [produto_dto_1.ProdutoDto], description: 'Array de produtos do pedido' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => produto_dto_1.ProdutoDto),
    __metadata("design:type", Array)
], YampiWebhookDto.prototype, "produtos", void 0);
//# sourceMappingURL=yampi-webhook.dto.js.map