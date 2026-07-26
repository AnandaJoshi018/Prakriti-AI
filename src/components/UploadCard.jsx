import { FileUp, Loader2 } from 'lucide-react'

export default function UploadCard({ onFileSelect, isUploading, selectedFileName, uploadStatus, uploadError }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <label className="flex h-full min-h-[110px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-[#b8c4ae] bg-[#f4f6f1] px-4 py-5 text-center transition hover:border-pa-green-2/50 hover:bg-[#eef3ea]">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={handleChange} />
      {isUploading ? (
        <Loader2 className="h-6 w-6 animate-spin text-pa-green-2" strokeWidth={1.5} />
      ) : (
        <FileUp className="h-6 w-6 text-pa-green-2" strokeWidth={1.5} />
      )}
      <span className="font-sans text-sm font-semibold text-pa-green-2">
        {isUploading ? 'Uploading prescription...' : 'Upload prescription'}
      </span>
      {selectedFileName ? (
        <span className="font-sans text-[11px] text-[#5f6f5f]">{selectedFileName}</span>
      ) : null}
      {uploadStatus ? (
        <span className="font-sans text-[11px] text-[#5f6f5f]">{uploadStatus}</span>
      ) : null}
      {uploadError ? (
        <span className="font-sans text-[11px] text-[#a3522b]">{uploadError}</span>
      ) : null}
    </label>
  )
}
