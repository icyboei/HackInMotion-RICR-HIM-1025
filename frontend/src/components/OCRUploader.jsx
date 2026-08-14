import { useState, useRef } from 'react'
import { FileTextIcon } from './ui/Icons'

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
        className="border-2 border-dashed border-[#DCE8E5] hover:border-[#0F766E] bg-[#EEF6F4]/30 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFilePick}
          className="hidden"
          id="prescription-upload"
        />
        <div className="w-12 h-12 rounded-2xl bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <FileTextIcon className="w-6 h-6" />
        </div>
        <p className="text-[#12302E] text-sm font-bold">Drop prescription image here</p>
        <p className="text-[#64748B] text-xs mt-1 font-medium">or click to browse · JPG, PNG, PDF</p>
        <p className="text-xs text-[#0F766E] font-semibold mt-2.5">Browser-side processing — image is NOT uploaded to a server</p>
      </div>

      {/* Progress */}
      {scanning && (
        <div className="bg-white border border-[#DCE8E5] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-1.5">
            <span>Scanning prescription...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-[#EEF6F4] rounded-full overflow-hidden border border-[#DCE8E5]">
            <div
              className="h-full bg-[#0F766E] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {imagePreview && !scanning && (
        <div className="rounded-2xl overflow-hidden border border-[#DCE8E5] max-h-48 flex items-center justify-center bg-white p-2 shadow-sm">
          <img src={imagePreview} alt="Prescription preview" className="max-h-44 object-contain rounded-xl" />
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 shadow-sm">{error}</p>
      )}
    </div>
  )
}

export default OCRUploader
