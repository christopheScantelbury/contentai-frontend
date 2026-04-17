'use client';

import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { GenerateResult } from '@/lib/api';

const CATEGORIES = [
  'Eletrônicos',
  'Moda',
  'Casa e Decoração',
  'Alimentos e Bebidas',
  'Beleza e Cuidados',
  'Esportes',
  'Brinquedos',
  'Automotivo',
  'Livros',
  'Outros',
] as const;

const MAX_IMAGE_SIZE_MB = 4;

const schema = z.object({
  name:       z.string().min(1, 'Nome é obrigatório').max(120),
  category:   z.string().min(1, 'Selecione uma categoria'),
  features:   z.string().min(1, 'Descreva as características').max(800),
});

type FormData = z.infer<typeof schema>;

export interface ProductFormHandle {
  fill: (data: { name: string; category: string; features: string }) => void;
}

interface Props {
  onResult:  (result: GenerateResult) => void;
  onLoading: (loading: boolean) => void;
  token:     string;
  fillRef?:  React.Ref<ProductFormHandle>;
}

function ProductFormInner({ onResult, onLoading, token, fillRef }: Props) {
  const fileRef               = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64,  setImageBase64]  = useState<string | undefined>();
  const [imageMime,    setImageMime]    = useState<string | undefined>();
  const [imageError,   setImageError]   = useState('');
  const [serverError,  setServerError]  = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Expõe método fill para pré-preencher via "Usar novamente"
  useImperativeHandle(fillRef, () => ({
    fill({ name, category, features }) {
      setValue('name',     name,     { shouldValidate: true });
      setValue('category', category, { shouldValidate: true });
      setValue('features', features, { shouldValidate: true });
    },
  }));

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError('');
    setImagePreview(null);
    setImageBase64(undefined);
    setImageMime(undefined);

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64  = dataUrl.split(',')[1];
      setImagePreview(dataUrl);
      setImageBase64(base64);
      setImageMime(file.type);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: FormData) {
    setServerError('');
    onLoading(true);

    try {
      const { generateContent } = await import('@/lib/api');
      const result = await generateContent(
        { name: data.name, category: data.category, features: data.features, imageBase64, imageMimeType: imageMime },
        token,
      );
      onResult(result);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo.');
    } finally {
      onLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Nome */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nome do produto <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Tênis Running Pro 3000"
          {...register('name')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Categoria */}
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">Selecione…</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
      </div>

      {/* Características */}
      <div>
        <label htmlFor="features" className="mb-1 block text-sm font-medium">
          Características <span className="text-red-500">*</span>
        </label>
        <textarea
          id="features"
          rows={4}
          placeholder="Descreva os principais atributos, diferenciais e benefícios do produto…"
          {...register('features')}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        {errors.features && <p className="mt-1 text-xs text-red-600">{errors.features.message}</p>}
      </div>

      {/* Foto (opcional) */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Foto do produto{' '}
          <span className="font-normal text-gray-500">(opcional, máx. {MAX_IMAGE_SIZE_MB} MB)</span>
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Pré-visualização" className="h-32 w-32 rounded-lg border border-gray-200 object-cover" />
            <button
              type="button"
              onClick={() => { setImagePreview(null); setImageBase64(undefined); setImageMime(undefined); if (fileRef.current) fileRef.current.value = ''; }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white hover:bg-red-600"
              aria-label="Remover imagem"
            >×</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-brand hover:text-brand"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Clique para adicionar foto
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
        {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Gerando…
          </span>
        ) : 'Gerar conteúdo'}
      </button>
    </form>
  );
}

const ProductForm = forwardRef<ProductFormHandle, Omit<Props, 'fillRef'>>((props, ref) => (
  <ProductFormInner {...props} fillRef={ref} />
));
ProductForm.displayName = 'ProductForm';

export default ProductForm;
