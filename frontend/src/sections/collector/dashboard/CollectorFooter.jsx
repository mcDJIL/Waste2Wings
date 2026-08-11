const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'ESG Report']

export default function CollectorFooter() {
  return (
    <footer className="border-t border-[#BEC9C3]/30 bg-white px-4 sm:px-12 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-full">
        {/* Brand */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#004536] text-base font-bold">
            Waste2Wings Platform
          </span>
          <span className="text-[#6F7975] text-base">
            |
          </span>
          <span className="text-[#3F4945] text-xs font-medium">
            © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#3F4945] text-xs font-medium hover:text-[#5A4199] transition-colors duration-200"
             
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
