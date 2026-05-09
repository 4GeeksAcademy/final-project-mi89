// Your current routes file (App.jsx or similar)

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { LandingPage } from "./pages/LandingPage";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import OwnerDashboard from "./pages/OwnerDashboard";
import { Login } from "./pages/Login";
import CustomerUpload from "./pages/CustomerUpload";
import { Profile } from "./pages/Profile";
import { CustomerProfile } from "./pages/CustomerProfile";
import { OwnerProfile } from "./pages/OwnerProfile";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/restaurant/:id/upload" element={<CustomerUpload />} />
      <Route path="/owner-profile" element={<OwnerProfile />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
    </Route>
  )
);  
