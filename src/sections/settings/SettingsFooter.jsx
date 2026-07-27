const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'ESG Report']

export default function SettingsFooter() {
  return (
    <footer className="border-t border-[#BEC9C3]/30 bg-white px-4 xs:px-8 sm:px-12 py-6 sm:py-8">
      <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center justify-between gap-3 xs:gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#004536] text-sm sm:text-base font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            HEN Platform
          </span>
          <span className="text-[#6F7975] text-sm sm:text-base">|</span>
          <span className="text-[#3F4945] text-xs font-medium" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 xs:gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#3F4945] text-xs font-medium hover:text-[#004536] transition-colors duration-200"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
