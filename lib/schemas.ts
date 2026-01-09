import { z } from 'zod';

// 1. Schema untuk Materi Belajar (Wiki)
export const EducationSchema = z.object({
  definition: z.string().describe("Definisi singkat penyakit"),
  etiology: z.string().describe("Penyebab utama (virus, bakteri, gaya hidup, dll)"),
  clinical_signs: z.array(z.string()).describe("Daftar 3-5 tanda klinis utama"),
  pathophysiology_summary: z.string().describe("Ringkasan patofisiologi maks 2 kalimat"),
  treatment_guideline: z.string().describe("Prinsip penatalaksanaan utama"),
});

// 2. Schema untuk Logika Game (Simulation)
export const SimulationSchema = z.object({
  chief_complaint_pool: z.array(z.string()).describe("3 variasi keluhan utama pasien (pake bahasa awam)"),
  
  // Aturan TTV (Tanda Tanda Vital)
  vital_signs_rules: z.object({
    temperature: z.object({ min: z.number(), max: z.number() }),
    bp_systolic: z.object({ min: z.number(), max: z.number(), note: z.string().optional() }),
    heart_rate: z.object({ min: z.number(), max: z.number() }),
  }),

  // Aturan Lab (Kunci Jawaban Angka)
  lab_rules: z.object({
    thrombocytes: z.object({ min: z.number(), max: z.number(), unit: z.string() }).optional(),
    hemoglobin: z.object({ min: z.number(), max: z.number(), unit: z.string() }).optional(),
    leukocytes: z.object({ min: z.number(), max: z.number(), unit: z.string() }).optional(),
  }),

  diagnosis_answer: z.string().describe("Nama penyakit yang benar untuk diagnosis"),
  differential_diagnosis: z.array(z.string()).describe("2-3 penyakit lain yang mirip untuk mengecoh user"),
});

// 3. Schema Gabungan (Kartu Lengkap)
export const DiseaseCardContentSchema = z.object({
  education: EducationSchema,
  simulation: SimulationSchema,
});
