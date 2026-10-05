import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminEnrollments from './pages/AdminEnrollments';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import MyCourses from './pages/MyCourses';
import MyCoursePlayer from './pages/MyCoursePlayer';
import MediaHome from './pages/MediaHome';
import Photos from './pages/Photos';
import Videos from './pages/Videos';
import TalentHome from './pages/TalentHome';
import Jobs from './pages/Jobs';
import Opportunities from './pages/Opportunities';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Partnership from './pages/Partnership';
import Flyers from './pages/Flyers';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import WhatsAppButton from './components/WhatsAppButton';
import Search from './pages/Search';
import PhotoAlbum from './pages/PhotoAlbum';

// Admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostsList from './pages/AdminPostsList';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminCoursesList from './pages/AdminCoursesList';
import AdminCourseEditor from './pages/AdminCourseEditor';
import AdminPhotosList from './pages/AdminPhotosList';
import AdminPhotoEditor from './pages/AdminPhotoEditor';
import AdminAlbumPhotos from './pages/AdminAlbumPhotos';
import AdminVideosList from './pages/AdminVideosList';
import AdminVideoEditor from './pages/AdminVideoEditor';
import AdminFlyersList from './pages/AdminFlyersList';
import AdminFlyerEditor from './pages/AdminFlyerEditor';
import AdminJobsList from './pages/AdminJobsList';
import AdminJobEditor from './pages/AdminJobEditor';
import AdminOpportunitiesList from './pages/AdminOpportunitiesList';
import AdminOpportunityEditor from './pages/AdminOpportunityEditor';
import AdminTalentList from './pages/AdminTalentList';
import AdminTalentEditor from './pages/AdminTalentEditor';
import AdminLessonsList from './pages/AdminLessonsList';
import AdminLessonEditor from './pages/AdminLessonEditor';
import AdminInstructorsList from './pages/AdminInstructorsList';
import AdminInstructorEditor from './pages/AdminInstructorEditor';
import AdminTestimonialsList from './pages/AdminTestimonialsList';
import AdminTestimonialEditor from './pages/AdminTestimonialEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>

          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/media" element={<MediaHome />} />
          <Route path="/media/photos" element={<Photos />} />
          <Route path="/media/photos/:id" element={<PhotoAlbum />} />
          <Route path="/media/videos" element={<Videos />} />
          <Route path="/media/flyers" element={<Flyers />} />
          <Route path="/talent" element={<TalentHome />} />
          <Route path="/talent/jobs" element={<Jobs />} />
          <Route path="/talent/opportunities" element={<Opportunities />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/search" element={<Search />} />

          {/* Protected student routes */}
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses/:id"
            element={
              <ProtectedRoute>
                <MyCoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/posts" element={<AdminPostsList />} />
          <Route path="/admin/posts/new" element={<AdminPostEditor />} />
          <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />

          <Route path="/admin/courses" element={<AdminCoursesList />} />
          <Route path="/admin/courses/new" element={<AdminCourseEditor />} />
          <Route path="/admin/courses/edit/:id" element={<AdminCourseEditor />} />
          <Route path="/admin/courses/:courseId/lessons" element={<AdminLessonsList />} />
          <Route path="/admin/courses/:courseId/lessons/new" element={<AdminLessonEditor />} />
          <Route path="/admin/courses/:courseId/lessons/edit/:id" element={<AdminLessonEditor />} />

          <Route path="/admin/photos" element={<AdminPhotosList />} />
          <Route path="/admin/photos/new" element={<AdminPhotoEditor />} />
          <Route path="/admin/photos/edit/:id" element={<AdminPhotoEditor />} />
          <Route path="/admin/photos/:albumId/images" element={<AdminAlbumPhotos />} />

          <Route path="/admin/videos" element={<AdminVideosList />} />
          <Route path="/admin/videos/new" element={<AdminVideoEditor />} />
          <Route path="/admin/videos/edit/:id" element={<AdminVideoEditor />} />

          <Route path="/admin/flyers" element={<AdminFlyersList />} />
          <Route path="/admin/flyers/new" element={<AdminFlyerEditor />} />
          <Route path="/admin/flyers/edit/:id" element={<AdminFlyerEditor />} />

          <Route path="/admin/jobs" element={<AdminJobsList />} />
          <Route path="/admin/jobs/new" element={<AdminJobEditor />} />
          <Route path="/admin/jobs/edit/:id" element={<AdminJobEditor />} />

          <Route path="/admin/opportunities" element={<AdminOpportunitiesList />} />
          <Route path="/admin/opportunities/new" element={<AdminOpportunityEditor />} />
          <Route path="/admin/opportunities/edit/:id" element={<AdminOpportunityEditor />} />

          <Route path="/admin/talent" element={<AdminTalentList />} />
          <Route path="/admin/talent/new" element={<AdminTalentEditor />} />
          <Route path="/admin/talent/edit/:id" element={<AdminTalentEditor />} />

          <Route path="/admin/instructors" element={<AdminInstructorsList />} />
          <Route path="/admin/instructors/new" element={<AdminInstructorEditor />} />
          <Route path="/admin/instructors/edit/:id" element={<AdminInstructorEditor />} />

          <Route path="/admin/testimonials" element={<AdminTestimonialsList />} />
          <Route path="/admin/testimonials/new" element={<AdminTestimonialEditor />} />
          <Route path="/admin/testimonials/edit/:id" element={<AdminTestimonialEditor />} />

          {/* 404 — must be last */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        <Footer />
        <BackToTop />
        <WhatsAppButton />
      </Router>
    </AuthProvider>
  );
}

export default App;