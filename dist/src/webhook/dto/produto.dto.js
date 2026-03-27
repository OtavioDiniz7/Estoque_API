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
exports.ProdutoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ProdutoDto {
    sku;
    nome_modelo;
    numeracao;
    quantidade;
    preco;
}
exports.ProdutoDto = ProdutoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AJV-42', description: 'SKU do produto' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProdutoDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Air Jordan Verde', description: 'Nome do modelo do produto' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProdutoDto.prototype, "nome_modelo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '42', description: 'Numeração do produto' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProdutoDto.prototype, "numeracao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Quantidade do produto' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProdutoDto.prototype, "quantidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 799, description: 'Preço do produto' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProdutoDto.prototype, "preco", void 0);
//# sourceMappingURL=produto.dto.js.map