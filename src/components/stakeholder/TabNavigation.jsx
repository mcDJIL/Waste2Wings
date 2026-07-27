const TABS = ['Overview', 'Pengajuan', 'Lab', 'Peta', 'Prediksi', 'Harga Acuan']

export default function TabNavigation({ activeTab, onChange }) {
  return (
    <div className="flex items-end gap-6 border-b border-[#BEC9C3]/30 overflow-x-auto pb-0 scrollbar-none">
      {TABS.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={[
              'pb-4 text-sm font-normal leading-6 whitespace-nowrap transition-all duration-200 border-b-2 -mb-px',
              isActive
                ? 'border-[#004536] text-[#004536] font-bold'
                : 'border-transparent text-[#3F4945] hover:text-[#004536] hover:border-[#004536]/40',
            ].join(' ')}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
