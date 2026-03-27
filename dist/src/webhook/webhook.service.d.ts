import { SupabaseService } from '../supabase/supabase.service';
import { YampiWebhookDto } from './dto/yampi-webhook.dto';
export declare class WebhookService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    processarWebhook(payload: YampiWebhookDto): Promise<{
        success: boolean;
        message: string;
    }>;
    private processarEstoque;
    private reservarEstoque;
    private devolverReserva;
    private processarCliente;
    private processarVenda;
}
