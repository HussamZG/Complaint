import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Login from './pages/Login';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import AdminComplaints from './pages/admin/Complaints';
import ComplaintDetails from './pages/admin/ComplaintDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow pt-16 pb-8">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<Home />} />
              <Route path="/submit-complaint" element={<SubmitComplaint />} />
              <Route path="/track-complaint" element={<TrackComplaint />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* صفحات إدارة الشكاوى */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute>
                    <Routes>
                      <Route index element={<AdminComplaints />} />
                      <Route path="complaints" element={<AdminComplaints />} />
                      <Route path="complaints/:id" element={<ComplaintDetails />} />
                    </Routes>
                  </PrivateRoute>
                }
              />

              {/* صفحة 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;