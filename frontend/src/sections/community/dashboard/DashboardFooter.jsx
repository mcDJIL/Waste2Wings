const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'ESG Report', href: '#' },
]

export default function DashboardFooter() {
  return (
    <footer className="px-6 sm:px-12 py-6 sm:py-8 border-t border-[#BEC9C3]/30 bg-white shrink-0">
      <div className="flex flex-col xs:flex-row items-center justify-between gap-3 max-w-screen-xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 text-center xs:text-left">
          <span className="font-bold text-[#004536] text-sm sm:text-base">HEN Platform</span>
          <span className="text-[#6F7975] hidden xs:inline">|</span>
          <span className="text-[#3F4945] text-[11px] sm:text-xs font-medium">
            © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#3F4945] text-[11px] sm:text-xs font-medium
                hover:text-[#004536] transition-colors hover:underline underline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
