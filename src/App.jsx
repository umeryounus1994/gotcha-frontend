import "./App.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { MantineProvider } from "@mantine/core";
import CustomAppShell from "./components/layout/app-shell";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Drop from "./pages/Drop";
import Live from "./pages/Live";
import Claimed from "./pages/Claimed";
import Users from "./pages/Users";
import OfferTypes from "./pages/Offers";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Coupons from "./pages/Coupons";
import Signin from "./pages/Siginin";
import Park from "./pages/Park";
import Company from "./pages/Companies";
import ViewParks from "./pages/Park/ViewParks";
import ViewDrops from "./pages/Drop/ViewDrops";
import Packages from "./pages/Packages";
import Versions from "./pages/Versions/index";
import PrizePool from "./pages/PrizePool";
import RegulatorLogin from "./pages/Regulator/Login";
import RegulatorShell from "./components/layout/regulator-shell";
import RegulatorDashboard from "./pages/Regulator/Dashboard";
import Regulators from "./pages/Regulators";
import AffiliateLogin from "./pages/Affiliate/Login";
import AffiliateShell from "./components/layout/affiliate-shell";
import AffiliateDashboard from "./pages/Affiliate/Dashboard";
import Affiliates from "./pages/Affiliates";
import AffiliateSales from "./pages/AffiliateSales";
import GenerateDrop from "./pages/PrizeDrop/GenerateDrop";
import PrizePoolData from "./pages/PrizePoolData";
import RNGData from "./pages/RNGData";
  
function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/regulator/login" element={<RegulatorLogin />} />
          <Route path="/regulator" element={<RegulatorShell />}>
            <Route path="dashboard" element={<RegulatorDashboard />} />
          </Route>
          <Route path="/affiliate/login" element={<AffiliateLogin />} />
          <Route path="/affiliate" element={<AffiliateShell />}>
            <Route path="dashboard" element={<AffiliateDashboard />} />
          </Route>
          <Route path="/" element={<CustomAppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-park" element={<Park />} />
            <Route path="/park" element={<ViewParks />} />
            {/* <Route path="/add-drop" element={<Drop />} /> */}
            <Route path="/drop" element={<Drop />} />
            <Route path="/live" element={<Live />} />
            <Route path="/claimed" element={<Claimed />} />
            <Route path="/users" element={<Users />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/offers" element={<OfferTypes />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/prize-pool" element={<PrizePool />} />
            <Route path="/generate-drop" element={<GenerateDrop />} />
            <Route path="/prize-pool-data" element={<PrizePoolData />} />
            <Route path="/rng-data" element={<RNGData />} />
            <Route path="/regulators" element={<Regulators />} />
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/affiliate-sales" element={<AffiliateSales />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
