import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

/* ---------- Public pages ---------- */
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import MediaHome from './pages/MediaHome';
import Photos from './pages/Photos';
import PhotoAlbum from './pages/PhotoAlbum';
import Videos from './pages/Videos';
import Flyers from './pages/Flyers';
import TalentHome from './pages/TalentHome';
import TalentMarketplace from './pages/TalentMarketplace';
import TalentProfile from './pages/TalentProfile';
import Jobs from './pages/Jobs';
import Opportunities from './pages/Opportunities';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Partnership from './pages/Partnership';
import Terms from './pages/Terms';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Scholarship from './pages/Scholarship';
import Team from './pages/Team';
import AdminTeamList from './pages/AdminTeamList';
import AdminTeamEditor from './pages/AdminTeamEditor';
/* ---------- Student (protected) ---------- */
import MyCourses from './pages/MyCourses';
import MyCoursePlayer from './pages/MyCoursePlayer';

/* ---------- Admin ---------- */
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminScholarships from './pages/AdminScholarships';

import AdminPostsList from './pages/AdminPostsList';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminPostCategoriesList from './pages/AdminPostCategoriesList';
import AdminPostCategoryEditor from './pages/AdminPostCategoryEditor';
import AdminPostTagsList from './pages/AdminPostTagsList';
import AdminPostTagEditor from './pages/AdminPostTagEditor';
import { Analytics } from "@vercel/analytics/react";
import AdminCoursesList from './pages/AdminCoursesList';
import AdminCourseEditor from './pages/AdminCourseEditor';
import AdminLessonsList from './pages/AdminLessonsList';
import AdminLessonEditor from './pages/AdminLessonEditor';
import AdminCategoriesList from './pages/AdminCategoriesList';
import AdminCategoryEditor from './pages/AdminCategoryEditor';

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

import AdminInstructorsList from './pages/AdminInstructorsList';
import AdminInstructorEditor from './pages/AdminInstructorEditor';
import AdminTestimonialsList from './pages/AdminTestimonialsList';
import AdminTestimonialEditor from './pages/AdminTestimonialEditor';

import AdminEnrollments from './pages/AdminEnrollments';
import AdminUsers from './pages/AdminUsers';
import AdminSubscribers from './pages/AdminSubscribers';
import AdminMessages from './pages/AdminMessages';
import AdminPartnerships from './pages/AdminPartnerships';
import AdminVolunteers from './pages/AdminVolunteers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />

        <Routes>
          {/* ==================== Public ==================== */}
          <Route path="/" element={<Home />} />
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
          <Route path="/talent/all" element={<TalentMarketplace />} />
          <Route path="/talent/jobs" element={<Jobs />} />
          <Route path="/talent/opportunities" element={<Opportunities />} />
          <Route path="/talent/:id" element={<TalentProfile />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/search" element={<Search />} />
          <Route path="/scholarship" element={<Scholarship />} />

          {/* ==================== Student (protected) ==================== */}
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/my-courses/:id" element={<ProtectedRoute><MyCoursePlayer /></ProtectedRoute>} />

          {/* ==================== Admin ==================== */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Admin: Scholarships */}
          <Route path="/admin/scholarships" element={<AdminRoute><AdminScholarships /></AdminRoute>} />

          {/* Admin: Posts */}
          <Route path="/admin/posts" element={<AdminRoute><AdminPostsList /></AdminRoute>} />
          <Route path="/admin/posts/new" element={<AdminRoute><AdminPostEditor /></AdminRoute>} />
          <Route path="/admin/posts/edit/:id" element={<AdminRoute><AdminPostEditor /></AdminRoute>} />
          <Route path="/admin/post-categories" element={<AdminRoute><AdminPostCategoriesList /></AdminRoute>} />
          <Route path="/admin/post-categories/new" element={<AdminRoute><AdminPostCategoryEditor /></AdminRoute>} />
          <Route path="/admin/post-categories/edit/:id" element={<AdminRoute><AdminPostCategoryEditor /></AdminRoute>} />
          <Route path="/admin/post-tags" element={<AdminRoute><AdminPostTagsList /></AdminRoute>} />
          <Route path="/admin/post-tags/new" element={<AdminRoute><AdminPostTagEditor /></AdminRoute>} />
          <Route path="/admin/post-tags/edit/:id" element={<AdminRoute><AdminPostTagEditor /></AdminRoute>} />

          {/* Admin: Courses */}
          <Route path="/admin/courses" element={<AdminRoute><AdminCoursesList /></AdminRoute>} />
          <Route path="/admin/courses/new" element={<AdminRoute><AdminCourseEditor /></AdminRoute>} />
          <Route path="/admin/courses/edit/:id" element={<AdminRoute><AdminCourseEditor /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/lessons" element={<AdminRoute><AdminLessonsList /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/lessons/new" element={<AdminRoute><AdminLessonEditor /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/lessons/edit/:id" element={<AdminRoute><AdminLessonEditor /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesList /></AdminRoute>} />
          <Route path="/admin/categories/new" element={<AdminRoute><AdminCategoryEditor /></AdminRoute>} />
          <Route path="/admin/categories/edit/:id" element={<AdminRoute><AdminCategoryEditor /></AdminRoute>} />

          {/* Admin: Media */}
          <Route path="/admin/photos" element={<AdminRoute><AdminPhotosList /></AdminRoute>} />
          <Route path="/admin/photos/new" element={<AdminRoute><AdminPhotoEditor /></AdminRoute>} />
          <Route path="/admin/photos/edit/:id" element={<AdminRoute><AdminPhotoEditor /></AdminRoute>} />
          <Route path="/admin/photos/:albumId/images" element={<AdminRoute><AdminAlbumPhotos /></AdminRoute>} />
          <Route path="/admin/videos" element={<AdminRoute><AdminVideosList /></AdminRoute>} />
          <Route path="/admin/videos/new" element={<AdminRoute><AdminVideoEditor /></AdminRoute>} />
          <Route path="/admin/videos/edit/:id" element={<AdminRoute><AdminVideoEditor /></AdminRoute>} />
          <Route path="/admin/flyers" element={<AdminRoute><AdminFlyersList /></AdminRoute>} />
          <Route path="/admin/flyers/new" element={<AdminRoute><AdminFlyerEditor /></AdminRoute>} />
          <Route path="/admin/flyers/edit/:id" element={<AdminRoute><AdminFlyerEditor /></AdminRoute>} />
{/* Public Team Page */}
<Route path="/about/team" element={<Team />} />

{/* Admin Team Pages */}
<Route path="/admin/team" element={<AdminRoute><AdminTeamList /></AdminRoute>} />
<Route path="/admin/team/new" element={<AdminRoute><AdminTeamEditor /></AdminRoute>} />
<Route path="/admin/team/edit/:id" element={<AdminRoute><AdminTeamEditor /></AdminRoute>} />
          {/* Admin: Talent */}
          <Route path="/admin/jobs" element={<AdminRoute><AdminJobsList /></AdminRoute>} />
          <Route path="/admin/jobs/new" element={<AdminRoute><AdminJobEditor /></AdminRoute>} />
          <Route path="/admin/jobs/edit/:id" element={<AdminRoute><AdminJobEditor /></AdminRoute>} />
          <Route path="/admin/opportunities" element={<AdminRoute><AdminOpportunitiesList /></AdminRoute>} />
          <Route path="/admin/opportunities/new" element={<AdminRoute><AdminOpportunityEditor /></AdminRoute>} />
          <Route path="/admin/opportunities/edit/:id" element={<AdminRoute><AdminOpportunityEditor /></AdminRoute>} />
          <Route path="/admin/talent" element={<AdminRoute><AdminTalentList /></AdminRoute>} />
          <Route path="/admin/talent/new" element={<AdminRoute><AdminTalentEditor /></AdminRoute>} />
          <Route path="/admin/talent/edit/:id" element={<AdminRoute><AdminTalentEditor /></AdminRoute>} />
          <Route path="/admin/instructors" element={<AdminRoute><AdminInstructorsList /></AdminRoute>} />
          <Route path="/admin/instructors/new" element={<AdminRoute><AdminInstructorEditor /></AdminRoute>} />
          <Route path="/admin/instructors/edit/:id" element={<AdminRoute><AdminInstructorEditor /></AdminRoute>} />
          <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonialsList /></AdminRoute>} />
          <Route path="/admin/testimonials/new" element={<AdminRoute><AdminTestimonialEditor /></AdminRoute>} />
          <Route path="/admin/testimonials/edit/:id" element={<AdminRoute><AdminTestimonialEditor /></AdminRoute>} />

          {/* Admin: People & Submissions */}
          <Route path="/admin/enrollments" element={<AdminRoute><AdminEnrollments /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/subscribers" element={<AdminRoute><AdminSubscribers /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
          <Route path="/admin/partnerships" element={<AdminRoute><AdminPartnerships /></AdminRoute>} />
          <Route path="/admin/volunteers" element={<AdminRoute><AdminVolunteers /></AdminRoute>} />

          {/* ==================== 404 ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <WhatsAppButton />
      </Router>
       <Analytics />
    </AuthProvider>
  );
}

export default App;