export default function SymptomInput() {
  return (
    <div className="relative">
      <div className="pa-plant-watermark" aria-hidden />
      <h2 className="relative font-serif text-2xl italic text-pa-green-2 md:text-[1.65rem]">
        How are you feeling today?
      </h2>
      <p className="relative mt-2 max-w-xl font-sans text-sm text-[#6f7f6f]">
        Describe your physical or mental sensations to refine your daily Prakriti snapshot.
      </p>
      <label className="relative mt-6 block">
        <span className="sr-only">Symptoms</span>
        <textarea
          rows={5}
          placeholder="Enter symptoms like dry skin, anxiety, digestion issues..."
          className="w-full resize-none rounded-2xl border border-black/5 bg-[#eef0ea] px-5 py-4 font-sans text-sm text-[#2a2a2a] outline-none ring-0 placeholder:text-[#a5aea0] focus:border-pa-green-2/30"
        />
      </label>
    </div>
  )
}
