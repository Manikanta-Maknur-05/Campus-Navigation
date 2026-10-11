import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import ExploreCampus from "./pages/ExploreCampus.jsx";
import BuildingDetails from "./pages/BuildingDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import AdminBuildings from "./pages/AdminBuildings.jsx";
import AddBuilding from "./pages/AddBuilding.jsx";
import EditBuilding from "./pages/EditBuilding.jsx";
import PathEditor from "./pages/PathEditor.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreCampus />} />
        <Route path="/buildings/:id" element={<BuildingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin pages: logged in AND role must be "admin" */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminBuildings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buildings/new"
          element={
            <ProtectedRoute adminOnly>
              <AddBuilding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buildings/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <EditBuilding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/paths"
          element={
            <ProtectedRoute adminOnly>
              <PathEditor />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;