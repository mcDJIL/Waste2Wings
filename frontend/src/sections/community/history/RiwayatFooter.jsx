const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'ESG Report']

export default function RiwayatFooter() {
  return (
    <footer className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 px-4 sm:px-12 py-6 sm:py-8 border-t border-[#BEC9C3]/30 bg-white">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[#004536] text-sm font-bold leading-6">HEN Platform</span>
        <span className="text-[#6F7975] text-sm">|</span>
        <span className="text-[#3F4945] text-xs font-medium">
          © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
        </span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        {FOOTER_LINKS.map(link => (
          <a
            key={link}
            href="#"
            className="text-[#3F4945] text-xs font-medium hover:text-[#004536] transition-colors duration-150"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
