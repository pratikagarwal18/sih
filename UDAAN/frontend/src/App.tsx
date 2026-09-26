import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { AirfareIndexPage } from './pages/AirfareIndexPage';
import { RoutesPage } from './pages/RoutesPage';
import { RouteDetailPage } from './pages/RouteDetailPage';
import { FareExplorerPage } from './pages/FareExplorerPage';
import { AirlinesPage } from './pages/AirlinesPage';
import { LeadTimePage } from './pages/LeadTimePage';
import { FestivalIntelligencePage } from './pages/FestivalIntelligencePage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ValidationPage } from './pages/ValidationPage';
import { MethodologyPage } from './pages/MethodologyPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/airfare-index" element={<AirfareIndexPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:routeId" element={<RouteDetailPage />} />
          <Route path="/fare-explorer" element={<FareExplorerPage />} />
          <Route path="/airlines" element={<AirlinesPage />} />
          <Route path="/lead-time" element={<LeadTimePage />} />
          <Route path="/festival-intelligence" element={<FestivalIntelligencePage />} />
          <Route path="/data-sources" element={<DataSourcesPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
