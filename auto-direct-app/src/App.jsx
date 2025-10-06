// PA2506 Autos Direct Prototype
// This is a React application with Tailwind CSS that serves as a prototype for an online car dealership platform.

import { createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar";
import Dropzone from "./components/Dropzone";
import EditVehicleForm from "./components/edit-vehicle";
import BrowsePage from "./pages/browse-page";
import CarDetailPage from "./pages/car-detail-page";
import ContactPage from "./pages/contact-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import HomePage from "./pages/home-page";
import ProfilePage from "./pages/profile-page";
import PrivacyPolicyPage from "./pages/privacy-policy-page";
import GlossaryPage from "./pages/glossary-page";
import SavedCarsPage from "./pages/saved-cars-page";
import AddVehiclePage from "./pages/add-vehicle-page";
import ApproveVehiclesPage from "./pages/approve-vehicles-page";
import BookingTestDrive from "./pages/booking-test-drive";
import AdviceRequestQueue from "./pages/advice-request-queue";
import ManageUsersPage from "./pages/manage-users-page";
import ManageVehiclesPage from "./pages/manage-vehicles-page";
import ManageManufacturersPage from "./pages/manage-manufacturers-page";
import ManageDealershipsPage from "./pages/manage-dealerships-page";
import ManageMyRequestsPage from "./pages/manage-myrequests-page"; // this is a regular user page to view and manage sent requests and their status
import UserManagePurchasesPage from "./pages/user-manage-purchases-page"; // this is a regular user page to view and manage sent requests and their status
import DbConnectionTestPage from "./pages/db-connection-test-page"; // to be deleted before handover
import SAPDatabasePage from "./pages/sap-database-page"; // Admin-only SAP database management
import PurchaseVehiclePage from "./pages/PurchaseVehiclePage"; // Purchase vehicle form page
import PurchaseFlowPage from "./pages/PurchaseFlowPage"; // New dedicated purchase flow page

import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext"; // path may change based on your setup

// Main App component: Sets up routing and page layout structure
function App() {
  return (
    <UserProvider> {/* Wrap the app in UserProvider to manage user state */}
    <Router>
      <div className="min-h-screen bg-white font-sans">
        {/* Persistent Navigation Bar */}
        <Navbar />

        {/* Routing Logic */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={   <BrowsePage />  }  />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/saved-cars" element={<SavedCarsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manage-my-purchases" element={<UserManagePurchasesPage />} />
          <Route path="/purchase-flow" element={<PurchaseFlowPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />

{/* Add Vehicle: Only admin */}
            <Route
              path="/add-vehicle"
              element={
                <ProtectedRoute allowedRoles={["Administrator", "Manufacturer"]}>
                  <AddVehiclePage />
                </ProtectedRoute>
              }
            />
            
            {/* Approve Vehicles: Only admin */}
            <Route
              path="/approve"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ApproveVehiclesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/testDrive" element={<BookingTestDrive />} />

            {/* Advice Queue: Only admin */}
            <Route
              path="/advice-queue"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <AdviceRequestQueue />
                </ProtectedRoute>
              }
            />

            {/* Manage Users: Only admin */}
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />

            {/* Manage Vehicles: Only admin */}
            <Route
              path="/manage-vehicles"
              element={
                <ProtectedRoute allowedRoles={["Administrator", "Manufacturer"]}>
                  <ManageVehiclesPage />
                </ProtectedRoute>
              }
            />

            <Route path="manage-my-requests" element={<ManageMyRequestsPage />} />

            {/* Manage Manufacturers: Only admin */}
            <Route
              path="/manage-manufacturers"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ManageManufacturersPage />
                </ProtectedRoute>
              }
            />

            {/* Manage Dealerships: Only admin */}
            <Route
              path="/manage-dealerships"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <ManageDealershipsPage />
                </ProtectedRoute>
              }
            />

            {/* SAP Database: Only admin */}
            <Route
              path="/sap-database"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <SAPDatabasePage />
                </ProtectedRoute>
              }
            />

            {/* Placeholder/Admin-Only Routes */}
            <Route
              path="/add-vehicle"
              element={
                <ProtectedRoute allowedRoles={["Administrator", "Manufacturer"]}>
                  <Placeholder text="Add a Vehicle Placeholder" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-vehicle"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <Placeholder text="Edit a Vehicle Placeholder" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-listings-manufacturer"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <Placeholder text="Manufacturer Listings Placeholder" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-listings-admin"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <Placeholder text="Admin Listings Placeholder" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-approval"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
                  <Placeholder text="Admin Approval Page Placeholder" />
                </ProtectedRoute>
              }
            />

            {/* Unprotected/other placeholder routes */}
            <Route path="/purchase-vehicle" element={<PurchaseVehiclePage />} />
            <Route path="/bookings" element={<Placeholder text="Customer Booked Test Drives Placeholder" />} />
            <Route path="/received-bookings" element={<Placeholder text="Manufacturer Received Bookings Placeholder" />} />
            <Route path="/dealer-locator" element={<Placeholder text="Dealer Locator Placeholder" />} />
            <Route path="/employee-queue" element={<Placeholder text="Employee Advice Request Queue Placeholder" />} />
            <Route path="/purchase" element={<Placeholder text="Vehicle Purchase / Transaction Placeholder" />} />

          </Routes>

          <footer className="mt-16 py-6 text-center text-gray-600 text-sm font-sans">
            &copy; {new Date().getFullYear()} Autos Direct. All rights reserved. |{" "}
				<Link to="/contact" className="text-blue-700 hover:underline">
				Contact
				</Link>{" | "}
				<Link to="/privacy-policy" className="text-blue-700 hover:underline">
				Privacy Policy
				</Link>{" | "}
				<Link to="/glossary" className="text-blue-700 hover:underline">
				Glossary
				</Link>
          </footer>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </UserProvider>
  );
}

// Simple placeholder component for pages not yet implemented
function Placeholder({ text }) {
  return <div className="p-8 text-center text-gray-600 font-sans">{text}</div>;
}

export default App;
