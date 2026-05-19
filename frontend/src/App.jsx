import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./marketing/pages/Login";
import Signup from "./marketing/pages/Signup";
import LandingHeader from "./marketing/components/LandingHeader";
import About from "./marketing/components/About";
import DemoSection from "./marketing/components/DemoSection";
import HowTo from "./marketing/components/howTo/HowTo";
import Landing from "./marketing/pages/Landing";
import Dashboard from "./dashboard/pages/Dashboard";
import Account from "./account/pages/Account";
import Expenses from "./expenses/pages/Expenses";
import Trips from "./trips/pages/Trips";
import Analytics from "./analytics/pages/Analytics";
import Budgets from "./budgets/pages/Budgets";
import DashLayout from "./dashboard/layout/DashLayout";
import NewTrip from "./trips/components/NewTrip";
import Calc from "./calculator/Calc";
import BudgetSetup from "./onboarding/BudgetSetup";
import ProfilePictureSetup from "./onboarding/ProfilePictureSetup";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  // Get the current URL
  const loc = useLocation();

  // Header only shows on pages with these path names
  const showLandHeader = ["/about", "/how-to", "/demo-section", "/"].includes(
    loc.pathname
  );

  return (
    <>
      {/* Render Landing header on condition */}
      {showLandHeader && <LandingHeader />}
      <Routes>

        {/* Decides what component loads for each path (element={component_to_load})*/}
        <Route path="/about" element={<About />} />
        <Route path="/how-to" element={<HowTo />} />
        <Route path="/demo-section" element={<DemoSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/budget-setup" element={<BudgetSetup />} />
        <Route path="/profile-picture-setup" element={<ProfilePictureSetup />} />
        <Route path="/" element={<Landing />} />

        {/* Nested Route: All dashboard pages live inside the DashLayout component */}
        <Route path="/layout-dash" element={<DashLayout />}>

          {/* /layout-dash automatically means /layout-dash/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/new" element={<NewTrip />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calculator" element={<Calc />} />
          <Route path="budgets" element={<Budgets />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppWrapper;
