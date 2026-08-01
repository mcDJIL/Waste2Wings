const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'ESG Report']

export default function CollectorFooter() {
  return (
    <footer className="border-t border-[#BEC9C3]/30 bg-white px-12 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-full">
        {/* Brand */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#004536] text-base font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            HEN Platform
          </span>
          <span className="text-[#6F7975] text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            |
          </span>
          <span className="text-[#3F4945] text-xs font-medium" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#3F4945] text-xs font-medium hover:text-[#5A4199] transition-colors duration-200"
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
