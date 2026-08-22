import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, RoleBasedRoute } from './ProtectedRoute'

import LandingPage from '../pages/landing/LandingPage'
import AuthPage from '../pages/auth/AuthPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import CommunityDashboardPage from '../pages/community/DashboardPage'
import CollectorDashboardPage from '../pages/collector/CollectorDashboardPage'
import SetoranPage from '../pages/community/SetoranPage'
import RiwayatPage from '../pages/community/RiwayatPage'
import InteractiveMapPage from '../pages/community/InteractiveMapPage'
import PengajuanHENPage from '../pages/collector/PengajuanHENPage'
import ValidationPage from '../pages/collector/ValidationPage'
import CollectorApplicationPage from '../pages/stakeholder/CollectorApplicationPage'
import DistributionMapPage from '../pages/stakeholder/DistributionMapPage'
import CollectorHistoryPage from '../pages/collector/HistoryPage'
import StakeholderDashboardPage from '../pages/stakeholder/StakeholderDashboardPage'
import LabPage from '../pages/stakeholder/LabPage'
import PrediksiDanaPage from '../pages/stakeholder/PrediksiDanaPage'
import MapPage from '../pages/collector/MapPage'
import CommunitySettingsPage from '../pages/community/SettingsPage'
import CollectorSettingsPage from '../pages/collector/SettingsPage'
import StakeholderSettingsPage from '../pages/stakeholder/SettingsPage'
import PriceReferencePage from '../pages/stakeholder/PriceReferencePage'
import AuditLogPage from '../pages/stakeholder/AuditLogPage'
import TraceabilityPage from '../pages/public/TraceabilityPage'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Public Traceability Passport Routes (No Auth Required) */}
      <Route path="/trace/:code" element={<TraceabilityPage />} />
      <Route path="/traceability" element={<TraceabilityPage />} />

      {/* Community Routes */}
      <Route path="/community/dashboard" element={<RoleBasedRoute element={<CommunityDashboardPage />} allowedRoles={['COMMUNITY']} />} />
      <Route path="/community/map" element={<RoleBasedRoute element={<InteractiveMapPage />} allowedRoles={['COMMUNITY']} />} />
      <Route path="/community/submissions" element={<RoleBasedRoute element={<SetoranPage />} allowedRoles={['COMMUNITY']} />} />
      <Route path="/community/history" element={<RoleBasedRoute element={<RiwayatPage />} allowedRoles={['COMMUNITY']} />} />
      <Route path="/community/settings" element={<RoleBasedRoute element={<CommunitySettingsPage />} allowedRoles={['COMMUNITY']} />} />

      {/* Collector Routes */}
      <Route path="/collector/dashboard" element={<RoleBasedRoute element={<CollectorDashboardPage />} allowedRoles={['COLLECTOR']} />} />
      <Route path="/collector/map" element={<RoleBasedRoute element={<MapPage />} allowedRoles={['COLLECTOR']} />} />
      <Route path="/collector/batch" element={<RoleBasedRoute element={<PengajuanHENPage />} allowedRoles={['COLLECTOR']} />} />
      <Route path="/collector/validation" element={<RoleBasedRoute element={<ValidationPage />} allowedRoles={['COLLECTOR']} />} />
      <Route path="/collector/history" element={<RoleBasedRoute element={<CollectorHistoryPage />} allowedRoles={['COLLECTOR']} />} />
      <Route path="/collector/settings" element={<RoleBasedRoute element={<CollectorSettingsPage />} allowedRoles={['COLLECTOR']} />} />

      {/* Stakeholder Routes */}
      <Route path="/stakeholder/dashboard" element={<RoleBasedRoute element={<StakeholderDashboardPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/approve" element={<RoleBasedRoute element={<CollectorApplicationPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/lab-test" element={<RoleBasedRoute element={<LabPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/map" element={<RoleBasedRoute element={<DistributionMapPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/prediction" element={<RoleBasedRoute element={<PrediksiDanaPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/price-reference" element={<RoleBasedRoute element={<PriceReferencePage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/audit-logs" element={<RoleBasedRoute element={<AuditLogPage />} allowedRoles={['STAKEHOLDER']} />} />
      <Route path="/stakeholder/settings" element={<RoleBasedRoute element={<StakeholderSettingsPage />} allowedRoles={['STAKEHOLDER']} />} />
    </Routes>
  )
}
