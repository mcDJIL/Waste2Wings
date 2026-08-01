import { useState } from 'react'

const feedItems = [
  {
    id: 1,
    title: 'Truck #08 arriving',
    location: 'Surabaya Central Hub',
    time: 'IN 12 MIN',
    timeType: 'incoming',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <path d="M5 16C4.16667 16 3.45833 15.7083 2.875 15.125C2.29167 14.5417 2 13.8333 2 13H0V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16V4H19L22 8V13H20C20 13.8333 19.7083 14.5417 19.125 15.125C18.5417 15.7083 17.8333 16 17 16C16.1667 16 15.4583 15.7083 14.875 15.125C14.2917 14.5417 14 13.8333 14 13H8C8 13.8333 7.70833 14.5417 7.125 15.125C6.54167 15.7083 5.83333 16 5 16ZM5 14C5.28333 14 5.52083 13.9042 5.7125 13.7125C5.90417 13.5208 6 13.2833 6 13C6 12.7167 5.90417 12.4792 5.7125 12.2875C5.52083 12.0958 5.28333 12 5 12C4.71667 12 4.47917 12.0958 4.2875 12.2875C4.09583 12.4792 4 12.7167 4 13C4 13.2833 4.09583 13.5208 4.2875 13.7125C4.47917 13.9042 4.71667 14 5 14ZM2 11H2.8C3.08333 10.7 3.40833 10.4583 3.775 10.275C4.14167 10.0917 4.55 10 5 10C5.45 10 5.85833 10.0917 6.225 10.275C6.59167 10.4583 6.91667 10.7 7.2 11H14V2H2V11ZM17 14C17.2833 14 17.5208 13.9042 17.7125 13.7125C17.9042 13.5208 18 13.2833 18 13C18 12.7167 17.9042 12.4792 17.7125 12.2875C17.5208 12.0958 17.2833 12 17 12C16.7167 12 16.4792 12.0958 16.2875 12.2875C16.0958 12.4792 16 12.7167 16 13C16 13.2833 16.0958 13.5208 16.2875 13.7125C16.4792 13.9042 16.7167 14 17 14ZM16 9H20.25L18 6H16V9Z" fill="#006C49" />
      </svg>
    ),
    iconBg: 'bg-brand-mint/30',
  },
  {
    id: 2,
    title: 'Collection complete',
    location: 'Gubeng Industrial Area',
    time: '2 MINS AGO',
    timeType: 'past',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M0 16V14H2.75L2.35 13.65C1.48333 12.8833 0.875 12.0083 0.525 11.025C0.175 10.0417 0 9.05 0 8.05C0 6.2 0.554167 4.55417 1.6625 3.1125C2.77083 1.67083 4.21667 0.716667 6 0.25V2.35C4.8 2.78333 3.83333 3.52083 3.1 4.5625C2.36667 5.60417 2 6.76667 2 8.05C2 8.8 2.14167 9.52917 2.425 10.2375C2.70833 10.9458 3.15 11.6 3.75 12.2L4 12.45V10H6V16H0ZM10 15.75V13.65C11.2 13.2167 12.1667 12.4792 12.9 11.4375C13.6333 10.3958 14 9.23333 14 7.95C14 7.2 13.8583 6.47083 13.575 5.7625C13.2917 5.05417 12.85 4.4 12.25 3.8L12 3.55V6H10V0H16V2H13.25L13.65 2.35C14.4667 3.16667 15.0625 4.05417 15.4375 5.0125C15.8125 5.97083 16 6.95 16 7.95C16 9.8 15.4458 11.4458 14.3375 12.8875C13.2292 14.3292 11.7833 15.2833 10 15.75Z" fill="#3F4945" />
      </svg>
    ),
    iconBg: 'bg-[#DEE8FF]',
  },
  {
    id: 3,
    title: 'New batch refinery',
    location: 'Surabaya Refinery Facility',
    time: '18 MINS AGO',
    timeType: 'past',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H2V10H1C0.716667 10 0.479167 9.90417 0.2875 9.7125C0.0958333 9.52083 0 9.28333 0 9C0 8.71667 0.0958333 8.47917 0.2875 8.2875C0.479167 8.09583 0.716667 8 1 8H2V2H1C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H16V8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H16V16H17C17.2833 16 17.5208 16.0958 17.7125 16.2875C17.9042 16.4792 18 16.7167 18 17C18 17.2833 17.9042 17.5208 17.7125 17.7125C17.5208 17.9042 17.2833 18 17 18H1ZM4 16H14V10C13.7167 10 13.4792 9.90417 13.2875 9.7125C13.0958 9.52083 13 9.28333 13 9C13 8.71667 13.0958 8.47917 13.2875 8.2875C13.4792 8.09583 13.7167 8 14 8V2H4V8C4.28333 8 4.52083 8.09583 4.7125 8.2875C4.90417 8.47917 5 8.71667 5 9C5 9.28333 4.90417 9.52083 4.7125 9.7125C4.52083 9.90417 4.28333 10 4 10V16ZM9 13C9.83333 13 10.5417 12.7125 11.125 12.1375C11.7083 11.5625 12 10.8667 12 10.05C12 9.4 11.8125 8.84167 11.4375 8.375C11.0625 7.90833 10.25 6.95 9 5.5C7.75 6.93333 6.9375 7.8875 6.5625 8.3625C6.1875 8.8375 6 9.4 6 10.05C6 10.8667 6.29167 11.5625 6.875 12.1375C7.45833 12.7125 8.16667 13 9 13Z" fill="#004536" />
      </svg>
    ),
    iconBg: 'bg-brand-dark/20',
  },
]

const cityOptions = ['City', 'Province', 'National']

export default function IntelligencePanel({ isOpen, onClose }) {
  const [selectedCity, setSelectedCity] = useState('City')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'flex flex-col bg-[#F9F9FF] border-l border-[#BEC9C3]/30 overflow-y-auto',
          'transition-transform duration-300 ease-in-out',
          /* Mobile: slide up from bottom as a sheet */
          'fixed bottom-0 left-0 right-0 z-30 max-h-[80vh] rounded-t-2xl',
          'lg:static lg:max-h-none lg:rounded-none lg:z-auto lg:w-[300px] lg:flex-shrink-0',
          isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0',
        ].join(' ')}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 lg:hidden">
          <div className="w-10 h-1 rounded-full bg-[#BEC9C3]" />
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-5 animate-intelligence-panel-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-brand-dark font-bold text-sm sm:text-base leading-[19px]">
              Distribution<br />Intelligence
            </h2>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0F3FF] text-[#051C37] text-sm font-normal leading-6 hover:bg-[#e4e9ff] transition-colors duration-200"
              >
                {selectedCity}
                <svg width="14" height="14" viewBox="0 0 24 25" fill="none">
                  <path d="M7 10L11.8 14.8L16.6 10" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 flex flex-col rounded-xl bg-white shadow-lg border border-[#BEC9C3]/30 overflow-hidden animate-tooltip-pop">
                  {cityOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedCity(opt); setDropdownOpen(false) }}
                      className={[
                        'px-4 py-2 text-sm text-left transition-colors duration-150',
                        opt === selectedCity
                          ? 'bg-brand-dark/10 text-brand-dark font-semibold'
                          : 'text-[#051C37] hover:bg-[#F0F3FF]',
                      ].join(' ')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tank Capacity card */}
          <div className="rounded-xl border-t-4 border-brand-gold bg-[#F0F3FF] overflow-hidden transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex items-center justify-between px-4 sm:px-8 py-5">
              <div>
                <p className="text-[#051C37] font-bold text-sm leading-6">Tank<br />Capacity</p>
              </div>
              <div>
                <p className="text-brand-text text-sm font-normal leading-6">Active<br />Monitoring</p>
              </div>
            </div>

            {/* Animated capacity gauge */}
            <div className="px-4 sm:px-6 pb-5">
              <div className="w-full h-2 rounded-full bg-brand-dark/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-gold transition-all duration-1000"
                  style={{ width: '92%' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-brand-text/60 font-medium">0%</span>
                <span className="text-[10px] text-brand-gold font-bold">92% capacity</span>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-dark/20 bg-brand-dark/10 p-5 sm:p-6 transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex items-center gap-3">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path d="M15 6.66667L13.9583 4.375L11.6667 3.33333L13.9583 2.29167L15 0L16.0417 2.29167L18.3333 3.33333L16.0417 4.375L15 6.66667ZM15 18.3333L13.9583 16.0417L11.6667 15L13.9583 13.9583L15 11.6667L16.0417 13.9583L18.3333 15L16.0417 16.0417L15 18.3333ZM6.66667 15.8333L4.58333 11.25L0 9.16667L4.58333 7.08333L6.66667 2.5L8.75 7.08333L13.3333 9.16667L8.75 11.25L6.66667 15.8333Z" fill="#004536" />
              </svg>
              <span className="text-brand-dark font-bold text-sm leading-6">AI Insight</span>
            </div>
            <p className="text-[#005140] text-xs sm:text-sm italic font-normal leading-[26px]">
              &ldquo;Stok di Jawa Timur meningkat 15%, rekomendasikan pengerahan armada tambahan untuk menjaga efisiensi penyimpanan di Surabaya Hub.&rdquo;
            </p>
          </div>

          {/* Live Logistics Feed */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#051C37] font-bold text-sm leading-6">Live Logistics Feed</h3>
              <button className="flex items-center gap-1 text-brand-dark text-xs sm:text-sm font-normal leading-6 hover:opacity-70 transition-opacity duration-200">
                View All
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z" fill="#004536" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {feedItems.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-feed-item-in flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-[#BEC9C3]/30 hover:bg-white/60 transition-all duration-200 cursor-pointer group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="text-[#051C37] font-bold text-xs sm:text-sm leading-6">{item.title}</p>
                    <p className="text-brand-text text-xs sm:text-sm font-normal leading-6">{item.location}</p>
                    {item.timeType === 'incoming' ? (
                      <span className="inline-flex self-start items-center px-2 py-0.5 rounded-full bg-brand-mint/50 text-brand-light-green text-[10px] font-bold leading-[15px]">
                        {item.time}
                      </span>
                    ) : (
                      <span className="text-brand-text/60 text-[10px] font-normal leading-[15px]">
                        {item.time}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
