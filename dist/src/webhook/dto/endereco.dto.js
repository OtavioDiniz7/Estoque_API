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
exports.EnderecoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class EnderecoDto {
    cep;
    rua;
    numero;
    bairro;
    cidade;
}
exports.EnderecoDto = EnderecoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '36420000', description: 'CEP do endereço' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rua A', description: 'Nome da rua' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "rua", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123', description: 'Número do endereço' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "numero", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Centro', description: 'Bairro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ouro Branco', description: 'Cidade' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "cidade", void 0);
//# sourceMappingURL=endereco.dto.js.map