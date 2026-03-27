import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { YampiWebhookDto } from './dto/yampi-webhook.dto';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('yampi')
  @ApiOperation({ summary: 'Receber webhook da Yampi' })
  @ApiBody({ type: YampiWebhookDto })
  @ApiResponse({
    status: 200,
    description: 'Webhook processado com sucesso',
    schema: {
      example: {
        success: true,
        message: 'Webhook processado',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao processar webhook',
    schema: {
      example: {
        success: false,
        message: 'Erro ao processar webhook',
        error: 'Detalhes do erro',
      },
    },
  })
  async receberWebhook(@Body() payload: YampiWebhookDto) {
    this.logger.log(`Webhook recebido para pedido: ${payload.pedido_id}`);

    try {
      const resultado = await this.webhookService.processarWebhook(payload);
      return resultado;
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`, error.stack);
      throw new HttpException(
        {
          success: false,
          message: 'Erro ao processar webhook',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
