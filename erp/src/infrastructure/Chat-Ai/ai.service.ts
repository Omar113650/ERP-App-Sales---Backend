import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async chatFlash(prompt: string) {
    if (!prompt || prompt.trim().length === 0) {
      return "Please provide a valid message to chat.";
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL_FLASH || '',
      });

      const result = await model.generateContent(prompt);

      // بعض الموديلات ممكن ترجّع null أو undefined
      return result?.response?.text() || "I couldn't generate a response for that.";
    } catch (error) {
      console.error('Gemini Flash Error:', error);
      throw new InternalServerErrorException('AI service failed to respond.');
    }
  }
}