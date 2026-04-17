'use client';

import { useState } from 'react';
import { postFeedback } from '@/lib/api';

interface Props {
  generationId: string;
  token:        string;
  onDone?:      () => void;
}

type Status = 'idle' | 'submitting' | 'done' | 'error';

export default function StarRating({ generationId, token, onDone }: Props) {
  const [hovered,  setHovered]  = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment,  setComment]  = useState('');
  const [status,   setStatus]   = useState<Status>('idle');

  async function handleSubmit(rating: number) {
    if (status !== 'idle') return;
    setSelected(rating);
    setStatus('submitting');

    try {
      await postFeedback({ generation_id: generationId, rating, comment: comment || undefined }, token);
      setStatus('done');
      onDone?.();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
        <span className="text-base">🙏</span>
        <span>Obrigado pelo feedback!</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-sm font-medium text-gray-700">
        O resultado foi útil? Avalie a geração:
      </p>

      {/* Estrelas */}
      <div
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || selected);
          return (
            <button
              key={star}
              type="button"
              disabled={status === 'submitting'}
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleSubmit(star)}
              aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
              className="text-2xl leading-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
            >
              <span className={filled ? 'text-amber-400' : 'text-gray-300'}>★</span>
            </button>
          );
        })}
        {status === 'submitting' && (
          <span className="ml-2 self-center text-xs text-gray-400">Enviando…</span>
        )}
      </div>

      {/* Comentário opcional — aparece após selecionar uma nota */}
      {selected > 0 && status === 'idle' && (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário opcional…"
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={() => handleSubmit(selected)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Enviar avaliação
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-500">
          Não foi possível enviar. Tente novamente.
          <button
            onClick={() => setStatus('idle')}
            className="ml-2 underline"
          >
            Tentar novamente
          </button>
        </p>
      )}
    </div>
  );
}
