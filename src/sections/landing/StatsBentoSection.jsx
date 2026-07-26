import bg from '../../assets/images/network.png'

const statsData = [
  { value: '124', label: 'HUBS' },
  { value: '42', label: 'PARTNERS' },
  { value: '15M', label: 'GALLONS' },
  { value: '8k', label: 'CLIENTS' },
]

const ecoBars = [
  { pct: '20%', height: 'h-[57px]' },
  { pct: '40%', height: 'h-[113px]' },
  { pct: '60%', height: 'h-[140px]' },
  { pct: '80%', height: 'h-[170px]' },
  { pct: '100%', height: 'h-[210px]', active: true },
]

const BuildingIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 30V11.9625L10.5 7.5V10.5L18 7.5V12H30V30H0ZM3 27H27V15H15V11.925L7.5 14.925V12L3 13.9875V27ZM13.5 24H16.5V18H13.5V24ZM7.5 24H10.5V18H7.5V24ZM19.5 24H22.5V18H19.5V24ZM30 12H22.5L24 0H28.5L30 12ZM3 27H7.5H15H27H3Z" fill="#002D22" />
  </svg>
)

const FilterIcon = () => (
  <svg width="59" height="65" viewBox="0 0 59 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="59.0855" height="65" rx="29.5428" fill="#004536" />
    <path d="M19.0428 43C17.7678 43 16.8615 42.4313 16.324 41.2938C15.7865 40.1562 15.9178 39.1 16.7178 38.125L25.0428 28V19H23.5428C23.1178 19 22.7615 18.8562 22.474 18.5687C22.1865 18.2812 22.0428 17.925 22.0428 17.5C22.0428 17.075 22.1865 16.7188 22.474 16.4313C22.7615 16.1438 23.1178 16 23.5428 16H35.5428C35.9678 16 36.324 16.1438 36.6115 16.4313C36.899 16.7188 37.0428 17.075 37.0428 17.5C37.0428 17.925 36.899 18.2812 36.6115 18.5687C36.324 18.8562 35.9678 19 35.5428 19H34.0428V28L42.3678 38.125C43.1678 39.1 43.299 40.1562 42.7615 41.2938C42.224 42.4313 41.3178 43 40.0428 43H19.0428ZM19.0428 40H40.0428L31.0428 29.05V19H28.0428V29.05L19.0428 40Z" fill="#81F9C1" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="62" height="68" viewBox="0 0 62 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="62" height="68" rx="31" fill="#004536" />
    <path d="M31 46C28.925 46 26.975 45.6063 25.15 44.8188C23.325 44.0312 21.7375 42.9625 20.3875 41.6125C19.0375 40.2625 17.9688 38.675 17.1812 36.85C16.3937 35.025 16 33.075 16 31C16 28.925 16.3937 26.975 17.1812 25.15C17.9688 23.325 19.0375 21.7375 20.3875 20.3875C21.7375 19.0375 23.325 17.9688 25.15 17.1812C26.975 16.3937 28.925 16 31 16C33.075 16 35.025 16.3937 36.85 17.1812C38.675 17.9688 40.2625 19.0375 41.6125 20.3875C42.9625 21.7375 44.0312 23.325 44.8188 25.15C45.6063 26.975 46 28.925 46 31C46 33.075 45.6063 35.025 44.8188 36.85C44.0312 38.675 42.9625 40.2625 41.6125 41.6125C40.2625 42.9625 38.675 44.0312 36.85 44.8188C35.025 45.6063 33.075 46 31 46ZM29.5 42.925V40C28.675 40 27.9688 39.7062 27.3813 39.1187C26.7938 38.5312 26.5 37.825 26.5 37V35.5L19.3 28.3C19.225 28.75 19.1562 29.2 19.0938 29.65C19.0312 30.1 19 30.55 19 31C19 34.025 19.9937 36.675 21.9812 38.95C23.9688 41.225 26.475 42.55 29.5 42.925ZM39.85 39.1C40.875 37.975 41.6562 36.7188 42.1938 35.3312C42.7313 33.9437 43 32.5 43 31C43 28.55 42.3187 26.3125 40.9562 24.2875C39.5938 22.2625 37.775 20.8 35.5 19.9V20.5C35.5 21.325 35.2062 22.0312 34.6187 22.6188C34.0312 23.2063 33.325 23.5 32.5 23.5H29.5V26.5C29.5 26.925 29.3563 27.2812 29.0688 27.5688C28.7812 27.8563 28.425 28 28 28H25V31H34C34.425 31 34.7812 31.1437 35.0688 31.4312C35.3563 31.7188 35.5 32.075 35.5 32.5V37H37C37.65 37 38.2375 37.1937 38.7625 37.5812C39.2875 37.9688 39.65 38.475 39.85 39.1Z" fill="#81F9C1" />
  </svg>
)

function NetworkExpansionCard() {
  return (
    <div className="relative flex flex-col justify-between gap-6 p-6 rounded-xl border-t-[5px] border-brand-gold bg-[rgba(255,255,255,0.10)] backdrop-blur-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden min-h-[300px] lg:min-h-[504px]">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-linear-to-br from-brand-medium/60 to-brand-darkest/80" style={{ backgroundImage: `url(${bg})` }} />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white text-xl sm:text-2xl font-semibold leading-tight mb-2">
            Network Expansion
          </h3>
          <p className="text-brand-blue-pale text-sm leading-6 max-w-[360px]">
            Our global collection and ensures 99.9% purity in waste oil reclamation across four continents.
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-mint shrink-0">
          <BuildingIcon />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsData.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-4 py-4 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(0,45,34,0.60)]"
          >
            <span className="text-brand-mint font-bold text-2xl sm:text-3xl leading-tight">{value}</span>
            <span className="text-brand-blue-pale font-bold text-xs tracking-[1.2px] uppercase">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EcoGrowthCard() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border-t-[5px] border-brand-gold bg-[rgba(255,255,255,0.20)] backdrop-blur-[10px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] min-h-[280px] lg:min-h-[504px]">
      <div>
        <h3 className="text-white text-xl sm:text-2xl font-semibold leading-tight mb-1">
          Ecological Growth
        </h3>
        <p className="text-brand-blue-pale text-sm leading-6">Real-time CO2 reduction metrics.</p>
      </div>

      <div className="flex items-end justify-between gap-1 flex-1 px-2 pb-4 min-h-[150px]">
        {ecoBars.map(({ pct, height, active }, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-brand-mint font-bold text-[10px] sm:text-xs tracking-widest">{pct}</span>
            <div
              className={`w-full rounded-t-md ${height} ${
                active ? 'bg-brand-mint' : 'bg-[rgba(0,69,54,0.40)]'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.10)]">
        <span className="text-brand-blue-pale text-xs sm:text-sm">Annual Target Met</span>
        <span className="text-brand-mint font-bold text-sm">+12.4%</span>
      </div>
    </div>
  )
}

function PrecisionCard() {
  return (
    <div className="flex items-center gap-6 p-6 rounded-xl border border-[rgba(129,249,193,0.10)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px]">
      <FilterIcon />
      <div>
        <h4 className="text-white text-lg sm:text-xl font-semibold leading-tight mb-1">
          Precision Refinement
        </h4>
        <p className="text-brand-blue-pale text-sm leading-6">
          Zero-loss filtration systems exceeding ISO standards.
        </p>
      </div>
    </div>
  )
}

function ComplianceCard() {
  return (
    <div className="relative flex items-center gap-6 p-6 rounded-xl border border-[rgba(129,249,193,0.10)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-brand-green via-brand-gold to-brand-mint rounded-xl pointer-events-none" />
      <GlobeIcon />
      <div className="relative">
        <h4 className="text-white text-lg sm:text-xl font-semibold leading-tight mb-1">
          Universal Compliance
        </h4>
        <p className="text-brand-blue-pale text-sm leading-6">
          Adhering to MARPOL and EU renewable directives.
        </p>
      </div>
    </div>
  )
}

export default function StatsBentoSection() {
  return (
    <section className="bg-[#004736] py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1184px] mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <NetworkExpansionCard />
          </div>
          <div className="lg:col-span-4">
            <EcoGrowthCard />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PrecisionCard />
          <ComplianceCard />
        </div>
      </div>
    </section>
  )
}
