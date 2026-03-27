import { WebhookService } from './webhook.service';
import { YampiWebhookDto } from './dto/yampi-webhook.dto';
export declare class WebhookController {
    private readonly webhookService;
    private readonly logger;
    constructor(webhookService: WebhookService);
    receberWebhook(payload: YampiWebhookDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
