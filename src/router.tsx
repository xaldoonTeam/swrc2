import { createBrowserRouter, Outlet, Navigate, useParams } from "react-router-dom";

// Public site
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import ProgramDetailPage from "./pages/programDetailPage";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import StoriesPage from "./pages/StoriesPage";
import StoryDetail from "./pages/StoryDetail";
import Contact from "./pages/ContactPage";
import ReportsPage from "./pages/report";
// import publications from "./pages/report";
import MediaPage from "./pages/Media";
import NewsletterPage from "./pages/NewsletterPage";
import NewsletterDetail from "./pages/NewsletterDetail";

// Admin
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminResearch from "./pages/admin/AdminResearch";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminStories from "./pages/admin/AdminStories";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLanding from "./pages/admin/AdminLanding";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers";
import RequireRoleAdmin from "./pages/admin/RequireRoleAdmin";
import FullStoryPage from "./pages/fullStory";
import ApplyProgram from "./pages/applyForm";
import ResearchPage from "./pages/Research";

function LegacyNewsRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/news/${slug}` : "/news"} replace />;
}

const RootLayout = () => (
  <div>
    <Outlet />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "programs", element: <Programs /> },
          { path: "programs/:slug", element: <ProgramDetail /> },
          { path: "program-detail", element: <ProgramDetailPage /> },
          { path: "stories", element: <StoriesPage /> },
          { path: "stories/:slug", element: <StoryDetail /> },
          { path: "contact", element: <Contact /> },
          { path: "report", element: <ReportsPage /> },
          { path: "research", element: <ResearchPage /> },
          { path: "publications", element: <ReportsPage /> },
          { path: "fullstory", element: <FullStoryPage /> },
          { path: "news", element: <NewsletterPage /> },
          { path: "news/:slug", element: <NewsletterDetail /> },
          { path: "newsletters", element: <Navigate to="/news" replace /> },
          { path: "newsletters/:slug", element: <LegacyNewsRedirect /> },
          { path: "media", element: <MediaPage /> },
          { path: "apply", element: <ApplyProgram /> },


          { path: "*", element: <div className="p-8 text-center text-gray-500">Not Found</div> },
        ],
      },
      {
        path: "admin",
        children: [
          { path: "login", element: <AdminLogin /> },
          {
            element: (
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            ),
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "publications", element: <AdminPublications /> },
              { path: "news", element: <AdminNewsletter /> },
              { path: "newsletters", element: <Navigate to="/admin/news" replace /> },
              { path: "research", element: <AdminResearch /> },
              { path: "programs", element: <AdminPrograms /> },
              { path: "stories", element: <AdminStories /> },
              { path: "team", element: <AdminTeam /> },
              { path: "media", element: <AdminMedia /> },
              { path: "landing", element: <AdminLanding /> },
              { path: "settings", element: <AdminSettings /> },
              { path: "profile", element: <AdminProfile /> },
              { path: "users", element: <RequireRoleAdmin><AdminUsers /></RequireRoleAdmin> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">404 Not Found</div>,
  },
]);
