export default function SymptomInput({ value, onChange }) {
  return (
    <div className="relative">
      <label className="relative block">
        <span className="sr-only">Symptoms</span>
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter symptoms like dry skin, anxiety, digestion issues..."
          className="w-full resize-none rounded-[22px] border border-black/5 bg-[#eef0ea] px-5 py-4 font-sans text-sm text-[#2a2a2a] outline-none ring-0 placeholder:text-[#a5aea0] focus:border-pa-green-2/30 h-[176px] sm:h-[180px] lg:h-[178px]"
        />
      </label>
    </div>
  )
}
