import bg from '../../assets/images/hero.png'

export default function LeftPanel() {
  return (
    <div
      className="hidden lg:flex relative w-1/2 min-h-screen overflow-hidden flex-col justify-center"
      style={{ background: 'linear-gradient(135deg, #0B5E4B 0%, #1A2E4A 100%)' }}
    >
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none">
        <img
          src={bg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right-side dark gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(29,49,77,0) 0%, #1D314D 100%)' }}
      />

      {/* Text content */}
      <div className="relative z-10 px-16 xl:px-24 max-w-2xl animate-fade-slide-left">
        {/* Badge */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-1 rounded-full bg-[#FFDEA4]" />
          <span className="ml-4 text-[#FFDEA4] font-semibold text-sm tracking-[1.4px] uppercase">
            VISI BERKELANJUTAN
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-white font-normal leading-[1.25] mb-6 animate-fade-slide-left"
          style={{ fontSize: 'clamp(28px, 3vw, 44px)', animationDelay: '0.1s' }}
        >
          Masa Depan Energi<br />dari Limbah Minyak.
        </h1>

        {/* Description */}
        <p
          className="text-white/70 font-light leading-relaxed animate-fade-slide-left"
          style={{ fontSize: 'clamp(14px, 1.2vw, 18px)', animationDelay: '0.2s' }}
        >
          HEN Waste Oil Platform menghubungkan ekosistem pengelolaan minyak
          jelantah untuk solusi bahan bakar penerbangan berkelanjutan yang
          transparan dan bernilai tinggi.
        </p>
      </div>
    </div>
  )
}
