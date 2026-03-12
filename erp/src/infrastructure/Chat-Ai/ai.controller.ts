import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from './ai.service';
import { ChatAiDto } from './dto/chat-ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatAiDto) {
    const rawReply = await this.geminiService.chatFlash(dto.message);

    // تنظيف النص: إزالة فراغات زائدة وتحويل Markdown إن حابب
    const formattedReply = this.formatReply(rawReply);

    return {
      reply: formattedReply,
    };
  }

  private formatReply(text: string) {
    if (!text) return "Sorry, I couldn't generate a reply.";

    // إزالة المسافات الزائدة أو الأسطر الجديدة في البداية والنهاية
    let cleanText = text.trim();

    // استبدال أسطر جديدة بـ <br> لو هتعرض في واجهة ويب
    cleanText = cleanText.replace(/\n/g, '<br>');

    return cleanText;
  }
}
