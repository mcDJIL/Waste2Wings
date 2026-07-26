import bg from '../../assets/images/hero.png'

const impactBars = [
  { height: 'h-16', opacity: 'bg-[rgba(0,69,54,0.20)]' },
  { height: 'h-24', opacity: 'bg-[rgba(0,69,54,0.40)]' },
  { height: 'h-20', opacity: 'bg-[rgba(0,69,54,0.60)]' },
  { height: 'h-36', opacity: 'bg-[rgba(0,69,54,0.80)]' },
  { height: 'h-40', opacity: 'bg-[#004536]' },
]

function ImpactCard() {
  return (
    <div className="relative flex-1 min-w-0 rounded-3xl border-t-2 border border-[#C9A96E] bg-[rgba(255,255,255,0.70)] backdrop-blur-[10px] shadow-[0_10px_30px_-10px_rgba(0,69,54,0.10)] p-6 sm:p-8 overflow-hidden">
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[rgba(129,249,193,0.20)] blur-[32px] pointer-events-none" />

      <div className="relative flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <span className="text-brand-gold font-bold text-xs sm:text-sm tracking-[1.6px] uppercase">
            REAL-TIME IMPACT
          </span>
          <span className="px-3 py-1 rounded-full bg-brand-mint text-brand-light-green font-bold text-xs sm:text-sm">
            +12.4% MoM
          </span>
        </div>

        <div className="flex items-end justify-center gap-2 h-40">
          {impactBars.map((bar, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-lg ${bar.height} ${bar.opacity}`}
            />
          ))}
        </div>

        <div className="flex justify-between items-start pt-4 border-t border-[rgba(190,201,195,0.30)]">
          <div>
            <p className="text-brand-text text-sm leading-6">Carbon Offset</p>
            <p className="text-brand-dark font-bold text-sm leading-6">2.4k Ton</p>
          </div>
          <div className="text-right">
            <p className="text-brand-text text-sm leading-6">Active Points</p>
            <p className="text-brand-dark font-bold text-sm leading-6">8.5M IDR</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-[61px] flex items-center overflow-hidden">
      <img
        src={bg}
        alt="Green energy platform"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.84)] via-[rgba(28,80,69,0.84)] to-[rgba(0,69,54,0.84)]" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-[576px]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 self-start">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.8 10.9442C1.2375 10.3817 0.796875 9.73173 0.478125 8.99423C0.159375 8.25673 0 7.49423 0 6.70673C0 5.91923 0.15 5.14111 0.45 4.37236C0.75 3.60361 1.2375 2.88173 1.9125 2.20673C2.35 1.76923 2.89062 1.39423 3.53437 1.08173C4.17812 0.769231 4.94063 0.522356 5.82188 0.341106C6.70312 0.159856 7.70937 0.0504808 8.84062 0.0129808C9.97188 -0.0245192 11.2375 0.0192308 12.6375 0.144231C12.7375 1.46923 12.7688 2.68798 12.7312 3.80048C12.6937 4.91298 12.5906 5.91611 12.4219 6.80986C12.2531 7.70361 12.0156 8.48486 11.7094 9.15361C11.4031 9.82236 11.025 10.3817 10.575 10.8317C9.9125 11.4942 9.20937 11.9786 8.46562 12.2849C7.72187 12.5911 6.9625 12.7442 6.1875 12.7442C5.375 12.7442 4.58125 12.5849 3.80625 12.2661C3.03125 11.9474 2.3625 11.5067 1.8 10.9442Z" fill="#00734E" />
            </svg>
            <span className="text-brand-light-green text-sm leading-6">Revolusi Energi Terbarukan Indonesia</span>
          </div>

          <div>
            <h1 className="text-4xl min-[300px]:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-brand-dark">Dari Limbah Dapur ke </span>
              <span className="text-brand-gold">Langit Biru Indonesia</span>
            </h1>
          </div>

          <p className="text-brand-text font-semibold text-sm sm:text-base leading-6 max-w-[576px]">
            Transformasi minyak jelantah menjadi Sustainable Aviation Fuel (SAF) kelas dunia. Bergabunglah dalam ekosistem sirkular kami dan kurangi jejak karbon penerbangan global.
          </p>

          <div className="flex flex-col min-[380px]:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
            <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-4 rounded-xl bg-brand-dark text-white text-sm sm:text-base font-medium hover:bg-brand-green transition-colors">
              Mulai Berkontribusi
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
              </svg>
            </button>
            <button className="flex items-center justify-center px-6 sm:px-8 py-4 rounded-xl border border-[rgba(0,69,54,0.20)] bg-[rgba(255,255,255,0.70)] backdrop-blur-[10px] text-brand-dark text-sm sm:text-base font-medium shadow-[0_10px_30px_-10px_rgba(0,69,54,0.10)] hover:bg-white/90 transition-colors">
              Pelajari Teknologi Kami
            </button>
          </div>
        </div>

        <div className="w-full lg:flex-1 max-w-sm sm:max-w-md lg:max-w-none">
          <ImpactCard />
        </div>
      </div>
    </section>
  )
}
