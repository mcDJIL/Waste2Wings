const footerLinks = ['Privacy Policy', 'Terms of Service', 'ESG Report']

export default function DashboardFooter() {
  return (
    <footer className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center px-6 md:px-10 py-6 border-t border-[#BEC9C3]/30 bg-white mt-auto">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[#004536] text-sm font-bold leading-6">HEN Platform</span>
        <span className="text-[#6F7975] text-sm">|</span>
        <span className="text-[#3F4945] text-xs font-medium leading-4">
          © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
        </span>
      </div>
      <div className="flex items-center gap-5">
        {footerLinks.map((link) => (
          <button
            key={link}
            className="text-[#3F4945] text-xs font-medium leading-4 hover:text-[#004536] transition-colors duration-200"
          >
            {link}
          </button>
        ))}
      </div>
    </footer>
  )
}
