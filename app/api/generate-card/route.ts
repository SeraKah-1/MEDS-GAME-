import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { supabase } from '@/lib/supabase';
import { DiseaseCardContentSchema } from '@/lib/schemas';

// Allow this API to run for up to 60 seconds (karena AI mikirnya agak lama)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return new Response('Topic is required', { status: 400 });
    }

    console.log(`🤖 Generating card for: ${topic}...`);

    // 1. Panggil OpenAI dengan Schema yang ketat
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'), // atau gpt-3.5-turbo kalau mau hemat
      schema: DiseaseCardContentSchema,
      prompt: `Buat materi medis lengkap dan logika simulasi game untuk penyakit: "${topic}".
      
      PENTING:
      - Gunakan Bahasa Indonesia untuk semua teks narasi.
      - Pastikan data medis akurat (range TTV dan Lab).
      - Untuk 'chief_complaint_pool', gunakan bahasa pasien awam yang natural (contoh: 'Dok, perut saya melilit').`,
    });

    console.log("✅ AI Generation Success!");

    // 2. Simpan hasil ke Supabase (Status: draft)
    const { data, error } = await supabase
      .from('disease_cards')
      .insert({
        title: topic, // Sementara judulnya sama dengan topik request
        category: 'Uncategorized', // Nanti diedit admin
        difficulty: 'Medium',      // Default
        status: 'draft',
        content: object,           // JSON hasil AI
      })
      .select()
      .single();

    if (error) {
      console.error("DB Error:", error);
      throw new Error(error.message);
    }

    // 3. Kembalikan hasil ke user
    return Response.json({ success: true, cardId: data.id, data: object });

  } catch (error: any) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
