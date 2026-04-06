import { useId, useRef, useState } from 'react'
import { uploadImage } from '../../services/adminService'

const ACCEPT = 'image/jpeg,image/png,image/webp'

type Props = {
  kind: 'menu' | 'news'
  value: string | null
  onChange: (path: string | null) => void
  onError?: (message: string) => void
  label?: string
  /** Ошибка валидации (обязательное фото и т.п.) */
  error?: boolean
}

export default function AdminImageUpload({
  kind,
  value,
  onChange,
  onError,
  label = 'Изображение',
  error = false,
}: Props) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0]
    ev.target.value = ''
    if (!f) return
    setUploading(true)
    try {
      const path = await uploadImage(f, kind)
      onChange(path)
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const previewSrc = value ? (value.startsWith('/') || value.startsWith('http') ? value : `/${value}`) : null

  function openPicker() {
    if (!uploading) fileRef.current?.click()
  }

  return (
    <div>
      <span
        className={`block text-sm mb-2 leading-[22px] ${error ? 'text-input-border-error' : 'text-cream-dark'}`}
      >
        {label}
      </span>
      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-invalid={error}
        onChange={(e) => void handleFile(e)}
        disabled={uploading}
      />

      <div className="w-full max-w-[400px]">
        <label
          htmlFor={inputId}
          className={`
            flex w-full cursor-pointer flex-col overflow-hidden rounded-[10px] border-2 border-dashed
            bg-input-bg/80 aspect-video min-h-[100px] items-center justify-center text-center text-sm text-cream-dark
            transition-colors hover:bg-input-bg
            ${error ? 'border-input-border-error hover:border-input-border-error' : 'border-cream/20 hover:border-cream/35'}
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {previewSrc ? (
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-4">
              Нет фото — нажмите здесь или выберите файл кнопкой ниже
            </span>
          )}
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={openPicker}
          className="
            h-11 min-w-[160px] rounded-[10px] bg-brown-button px-6 text-sm font-medium uppercase tracking-wider
            text-brown-dark transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {uploading ? 'Загрузка…' : 'Выбрать изображение'}
        </button>
        {value ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => onChange(null)}
            className="
              h-11 rounded-[10px] border border-cream/30 px-6 text-sm text-cream transition-colors
              hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
              disabled:opacity-60
            "
          >
            Убрать
          </button>
        ) : null}
      </div>
    </div>
  )
}
