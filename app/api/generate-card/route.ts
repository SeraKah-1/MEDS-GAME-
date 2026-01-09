import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    console.log("⚠️ MENGGUNAKAN MODE OFFLINE (DUMMY DATA)");

    // Data Palsu (Pura-pura dari AI)
    const dummyContent = {
      wiki: {
        definition: "Penyakit simulasi untuk testing game.",
        etiology: "Bug pada kodingan atau API Key habis.",
        clinical_signs: ["Pusing 7 keliling", "Keyboard ingin dibanting", "Layar dipelototi"],
        pathophysiology_summary: "Terjadi gangguan aliran data dari server ke klien.",
        treatment_guideline: "Istirahat sejenak dan minum kopi.",
      },
      simulation: {
        chief_complaint_pool: [
            "Dok, kepala saya pusing mikirin error ini.",
            "Badan saya lemas gara-gara koding error.",
            "Tolong dok, sembuhkan error saya."
        ],
        vital_signs_rules: {
          temperature: { min: 38.0, max: 40.0 },
          bp_systolic: { min: 90, max: 110 },
          heart_rate: { min: 100, max: 120 },
        },
        lab_rules: {
          thrombocytes: { min: 100000, max: 150000, unit: "/uL" },
          leukocytes: { min: 12000, max: 18000, unit: "/uL" },
          hemoglobin: { min: 10, max: 12, unit: "g/dL" },
        },
        diagnosis_answer: "Coding Fatigue Syndrome",
      }
    };

    // Simpan ke Supabase
    const { data, error } = await supabase
      .from('disease_cards')
      .insert({
        title: topic || "Kasus Test Offline",
        category: 'Test',
        difficulty: 'Easy',
        status: 'published',
        content: dummyContent,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return Response.json({ success: true, cardId: data.id });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
