export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[768px] mx-auto flex flex-col items-center gap-6 sm:gap-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-extrabold leading-[1.1]">
          <span className="text-[#002D22]">Ready to </span>
          <span className="text-brand-green">Refine</span>
          <span className="text-[#002D22]"> Your Impact?</span>
        </h2>

        <p className="text-[#404945] text-sm sm:text-base lg:text-lg leading-[1.6] max-w-xl">
          Join the global leaders securing their place in the new energy economy. High-volume industrial partnerships available for Q4.
        </p>

        <div className="flex flex-col min-[380px]:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full pt-2">
          <button className="w-full min-[380px]:w-auto px-6 sm:px-10 py-4 sm:py-5 rounded-full bg-[#002D22] text-white text-base sm:text-lg lg:text-xl font-semibold shadow-[0_20px_25px_-5px_rgba(0,45,34,0.20),0_8px_10px_-6px_rgba(0,45,34,0.20)] hover:brightness-110 transition-all">
            Register Your Facility
          </button>
          <button className="w-full min-[380px]:w-auto px-6 sm:px-10 py-4 sm:py-5 rounded-full border-2 border-[#002D22] bg-white text-[#002D22] text-base sm:text-lg lg:text-xl font-semibold hover:bg-[rgba(0,45,34,0.05)] transition-colors">
            Request a Consultation
          </button>
        </div>
      </div>
    </section>
  )
}
