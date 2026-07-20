import { FileUp } from 'lucide-react'

export default function UploadCard() {
  return (
    <button
      type="button"
      className="flex h-full min-h-[110px] w-full flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-[#b8c4ae] bg-[#f4f6f1] px-4 py-5 text-center transition hover:border-pa-green-2/50 hover:bg-[#eef3ea]"
    >
      <FileUp className="h-6 w-6 text-pa-green-2" strokeWidth={1.5} />
      <span className="font-sans text-sm font-semibold text-pa-green-2">Upload prescription</span>
    </button>
  )
}
