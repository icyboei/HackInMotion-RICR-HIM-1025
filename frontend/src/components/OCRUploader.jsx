import { useState, useRef } from 'react'

/**
 * OCRUploader — Prescription image upload with Tesseract.js (browser-side OCR)
 * Props:
 *   onExtracted(rawText, imageUrl) — called when OCR completes
 *   loading — whether processing is happening
 */
function OCRUploader({ onExtracted, loading }) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef(null)

  async function processFile(file) {
    if (!file) return
    setError('')
    setProgress(0)

    const imageUrl = URL.createObjectURL(file)
    setImagePreview(imageUrl)
    setScanning(true)

    try {
      // Dynamically import Tesseract.js to keep initial bundle small
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round((m.progress || 0) * 100))
          }
        },
      })
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      onExtracted(text, imageUrl)
    } catch (err) {
      setError('OCR failed. Please try a clearer image or enter medicines manually.')
      console.error('Tesseract error:', err)
    } finally {
      setScanning(false)
    }
  }

  function handleFilePick(e) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-teal-600 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFilePick}
          className="hidden"
          id="prescription-upload"
        />
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
        <p className="text-slate-300 text-sm font-medium">Drop prescription image here</p>
        <p className="text-slate-500 text-xs mt-1">or click to browse · JPG, PNG, PDF</p>
        <p className="text-xs text-teal-500/70 mt-2">Browser-side processing — image is NOT uploaded to a server</p>
      </div>

      {/* Progress */}
      {scanning && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Scanning prescription...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {imagePreview && !scanning && (
        <div className="rounded-xl overflow-hidden border border-slate-700 max-h-48 flex items-center justify-center bg-slate-900">
          <img src={imagePreview} alt="Prescription preview" className="max-h-48 object-contain" />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/50 rounded-xl px-4 py-3">{error}</p>
      )}
    </div>
  )
}

export default OCRUploader
