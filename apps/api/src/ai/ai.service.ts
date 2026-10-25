import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AIRequestDto, AIResponseDto } from '@codepractice/shared-types';

@Injectable()
export class AIService {
  private dailyLimit = 30;

  constructor(private prisma: PrismaService) {}

  async handleAIRequest(studentId: string, dto: AIRequestDto): Promise<AIResponseDto> {
    // 1. Rate limiting tekshiruvi (kunlik 30 ta so'rov)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const usageCount = await this.prisma.aIInteraction.count({
      where: {
        studentId,
        createdAt: { gte: startOfDay },
      },
    });

    if (usageCount >= this.dailyLimit) {
      throw new HttpException(
        'Kunlik AI so‘rovlar chegarasiga yetdingiz (30/30). Ertaga qayta urinib ko‘ring.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Masala ma'lumotlarini olish
    const problem = await this.prisma.problem.findUnique({
      where: { id: dto.problemId },
    });

    if (!problem) {
      throw new BadRequestException('Masala topilmadi');
    }

    // 3. System prompt va kontekstni shakllantirish
    const systemPrompt = `Siz CodePractice platformasining o'quvchilarga yordam beruvchi do'stona va tajribali AI mentorisiz.
QOIDALAR:
1. Siz hech qachon to'liq tayyor yechim kodini bermaysiz! Agar o'quvchi "yechimni yozib ber" desa ham, rad etib, yo'l-yo'riq ko'rsating.
2. Faqat o'zbek tilida, tushunarli, aniq va dalda beruvchi ohangda javob bering.
3. Koddagi xatolarni ko'rsatganda, sintaksis yoki mantiqiy xatoning sababini tushuntiring, lekin tayyor to'liq kod blokini yozmang (faqat 1 qatorlik kichik sintaksis namunasi bo'lishi mumkin).
4. O'quvchini mustaqil fikrlashga, masalani qadam-baqadam yechishga undash asosiy vazifangiz.`;

    let userPrompt = `Masala nomi: "${problem.title}"\nMasala sharti: ${problem.statement}\nDasturlash tili: ${problem.language}\n`;

    switch (dto.requestType) {
      case 'explain_problem':
        userPrompt += `\nVazifa: Masala shartini, kiruvchi va chiquvchi ma'lumotlarni o'quvchiga juda sodda va hayotiy misol bilan tushuntirib bering.`;
        break;
      case 'explain_code':
        userPrompt += `\nO'quvchi yozgan kod:\n\`\`\`${problem.language}\n${dto.currentCode || '(kod kiritilmagan)'}\n\`\`\`\nVazifa: Ushbu kodni ko'rib chiqing va undagi asosiy algoritmik yoki mantiqiy kamchiliklarni tushuntiring. To'liq yechimni yozmang.`;
        break;
      case 'explain_error':
        userPrompt += `\nXatolik xabari:\n${dto.errorMessage || 'Xatolik matni yo‘q'}\nO'quvchi kodi:\n\`\`\`${problem.language}\n${dto.currentCode || ''}\n\`\`\`\nVazifa: Ushbu xatolik nimani anglatishini va uni qanday to'g'rilash mumkinligini tushuntiring.`;
        break;
      case 'hint':
        userPrompt += `\nO'quvchi savoli: ${dto.studentQuestion || 'Keyingi qadam bo‘yicha maslahat kerak'}\nO'quvchi kodi:\n\`\`\`${problem.language}\n${dto.currentCode || ''}\n\`\`\`\nVazifa: O'quvchiga keyingi to'g'ri qadam uchun kichik maslahat (hint) bering.`;
        break;
      case 'explain_test':
        userPrompt += `\nTest natijalari:\n${dto.testResultsSummary || 'Ba’zi testlardan o‘tmadi'}\nO'quvchi kodi:\n\`\`\`${problem.language}\n${dto.currentCode || ''}\n\`\`\`\nVazifa: Kod nega testdan o'tmagan bo'lishi mumkinligini (masalan: chekka holatlar, 0 ga bo'lish, bo'sh joylar) tushuntirib bering.`;
        break;
    }

    let aiText = '';
    const apiKey = process.env.AI_API_KEY;

    if (apiKey && apiKey !== 'mock_ai_key' && !apiKey.includes('your_')) {
      try {
        aiText = await this.callGeminiApi(apiKey, systemPrompt, userPrompt);
      } catch (err: any) {
        aiText = this.generateFallbackResponse(dto, problem);
      }
    } else {
      // Aqlli mahalliy pedagogik javob generatori
      aiText = this.generateFallbackResponse(dto, problem);
    }

    // 4. Server-side Guardrail: To'liq kod berilishini tekshirish va tozalash
    aiText = this.applySolutionGuardrail(aiText, problem.language);

    // 5. Interaction audit yozish
    await this.prisma.aIInteraction.create({
      data: {
        studentId,
        problemId: problem.id,
        requestType: dto.requestType,
        requestSummary: (dto.studentQuestion || dto.requestType).slice(0, 500),
        responseSummary: aiText.slice(0, 500),
      },
    }).catch(() => {});

    return {
      response: aiText,
      remainingDailyTokens: this.dailyLimit - (usageCount + 1),
    };
  }

  private async callGeminiApi(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private generateFallbackResponse(dto: AIRequestDto, problem: any): string {
    switch (dto.requestType) {
      case 'explain_problem':
        return `Ushbu masala: "${problem.title}".\n\nAsosiy maqsad: kiritilgan ma'lumotlarni o'qib olib, talab qilingan algoritm asosida qayta ishlash va natijani chiqarishdir.\n\nNamunaga e'tibor bering:\nInput: ${problem.sampleInput || 'bo‘sh'}\nOutput: ${problem.sampleOutput || 'bo‘sh'}\n\nAvval inputni to'g'ri o'qib oling, so'ng masalada berilgan asosiy shartni if/else yoki sikl yordamida tekshiring.`;

      case 'explain_code':
        return `Kodingizni tahlil qildim:\n\n1. O'zgaruvchilar va tiplar to'g'ri e'lon qilinganini tekshiring.\n2. Sikl chegaralari va shart operatorlari (if/else) to'g'ri qo'yilganiga ishonch hosil qiling.\n3. Natijani chiqarishda ortiqcha bo'sh joy yoki qator tashlashlar namunadagiga to'liq mos kelishiga e'tibor bering.\n\nEslatma: to'liq yechimni o'zingiz mustaqil yozishingiz dars samaradorligi uchun juda muhim!`;

      case 'explain_error':
        if (dto.errorMessage?.includes('SyntaxError') || dto.errorMessage?.includes('error:')) {
          return `Sintaktik xatolik yuz berdi: qavslar, ikki nuqta (:) yoki nuqta-vergul (;) to'g'ri yopilganini tekshiring.\n\nXato tafsiloti:\n${dto.errorMessage}`;
        }
        return `Dastur bajarilishida xatolik aniqlandi. Ko'pincha bu indeksdan chiqib ketish (IndexError/OutOfBounds) yoki noto'g'ri turdagi ma'lumotni hisoblashdan kelib chiqadi. Chiqarilgan xabar qator raqamini ko'rsatmoqda.`;

      case 'hint':
        return `Maslahat: Masalani kichik qismlarga bo'ling:\n1. Avval bitta namunaviy input uchun kod ishlayotganini tekshiring.\n2. Chekka holatlar (masalan 0, manfiy sonlar yoki bo'sh satr) qanday ishlashini o'ylab ko'ring.\n3. Murakkab ifodalarni bosqichma-bosqich o'zgaruvchilarga ajratib oling.`;

      case 'explain_test':
        return `Kodingiz namunaviy testlardan o'tgan bo'lsa-da, ba'zi maxsus testlardan o'tmadi.\nSabablar quyidagilar bo'lishi mumkin:\n- Chekka qiymatlar (katta sonlar, manfiy qiymatlar)\n- Output formati (katta-kichik harflar yoki ortiqcha probellar)\n- Vaqt chegarasi (cheksiz sikl yoki sekin algoritm)`;

      default:
        return 'Masala ustida ishlashda davom eting. Qiyinchilik tug‘ilsa, muammoni alohida bosqichlarga ajrating.';
    }
  }

  // Guardrail: agar javobda to'liq kod bloki (> 10 qator kod) aniqlansa, uni cheklaydi
  private applySolutionGuardrail(text: string, language: string): string {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return text.replace(codeBlockRegex, (block) => {
      const lines = block.split('\n');
      if (lines.length > 8) {
        return `\n> [!NOTE]\n> *To‘liq kod yechimi CodePractice qoidalariga ko‘ra yashirildi. Iltimos, o‘zingiz mustaqil yozib ko‘ring.*\n`;
      }
      return block;
    });
  }
}
