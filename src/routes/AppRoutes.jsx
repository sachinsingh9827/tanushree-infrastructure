import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../private/guards/ProtectedRoute.jsx";
import Contacts from "../private/pages/Contacts.jsx";
import AdminDashboard from "../private/pages/Dashboard.jsx";
import AdminLogin from "../private/pages/Login.jsx";
import PageEditor from "../private/pages/PageEditor.jsx";
import ResourceList from "../private/pages/ResourceList.jsx";
import Settings from "../private/pages/Settings.jsx";
import SupportTickets from "../private/pages/SupportTickets.jsx";
import About from "../website/pages/About.jsx";
import Contact from "../website/pages/Contact.jsx";
import Gallery from "../website/pages/Gallery.jsx";
import Home from "../website/pages/Home.jsx";
import NotFound from "../website/pages/NotFound.jsx";
import Projects from "../website/pages/Projects.jsx";
import Services from "../website/pages/Services.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/support" element={<Navigate to="/contact" replace />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="about" element={<Navigate to="/admin/pages/about" replace />} />
        <Route path="projects" element={<ResourceList key="admin-projects" type="projects" />} />
        <Route path="services" element={<ResourceList key="admin-services" type="services" />} />
        <Route path="gallery" element={<ResourceList key="admin-gallery" type="gallery" />} />
        <Route path="pages" element={<Navigate to="/admin/pages/about" replace />} />
        <Route path="pages/:slug" element={<PageEditor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="support" element={<SupportTickets />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
