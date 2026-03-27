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
exports.ClienteDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const endereco_dto_1 = require("./endereco.dto");
class ClienteDto {
    nome;
    email;
    telefone;
    endereco;
}
exports.ClienteDto = ClienteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva', description: 'Nome completo do cliente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClienteDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@email.com', description: 'Email do cliente' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClienteDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '319999999', description: 'Telefone do cliente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClienteDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: endereco_dto_1.EnderecoDto, description: 'Endereço do cliente' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => endereco_dto_1.EnderecoDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", endereco_dto_1.EnderecoDto)
], ClienteDto.prototype, "endereco", void 0);
//# sourceMappingURL=cliente.dto.js.map