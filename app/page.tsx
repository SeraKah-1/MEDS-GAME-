'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TestPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleGenerate() {
    if (!topic) return;
    setLoading(true);
    setResult(null);
    toast.info("Sedang menyuruh AI berpikir...");

    try {
      const res = await fetch('/api/generate-card', {
        method: 'POST',
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setResult(data);
      toast.success("Berhasil! Cek Supabase Anda.");
    } catch (e: any) {
      toast.error(`Gagal: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🛠️ Admin Generator Test</h1>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Contoh: Demam Berdarah Dengue" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Buat Kartu'}
        </Button>
      </div>

      {result && (
        <Card className="bg-slate-50">
          <CardHeader><CardTitle>Hasil Generate</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-[400px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
