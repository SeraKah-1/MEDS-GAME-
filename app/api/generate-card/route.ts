import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { supabase } from '@/lib/supabase';
import { DiseaseCardContentSchema } from '@/lib/schemas';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) return new Response('Topic required', { status: 400 });

    console.log(`🕵️‍♂️ Generating Detective Case: ${topic}...`);

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'), 
      schema: DiseaseCardContentSchema,
      prompt: `Buat kasus simulasi medis TIPE DETEKTIF untuk penyakit: "${topic}".
      
      INSTRUKSI GAMEPLAY:
      1. 'interview_questions': 
         - Buat dialog interaktif. Dokter harus memilih pertanyaan yang tepat.
         - Wajib ada pertanyaan JEBAKAN (misal: nanya hal gak penting) yang jawabannya bikin bingung.
      2. 'diagnosis_options': 
         - Berikan 4 pilihan diagnosa yang MIRIP. Jangan buat pilihan yang terlalu gampang.
         - Pemain harus mikir keras bedanya A dan B.
      3. Bahasa: Indonesia (Casual tapi sopan untuk pasien).`,
    });

    const { data, error } = await supabase
      .from('disease_cards')
      .insert({
        title: topic,
        category: 'Medical Detective',
        difficulty: 'Hard',
        status: 'published',
        content: object,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return Response.json({ success: true, cardId: data.id });

  } catch (error: any) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
