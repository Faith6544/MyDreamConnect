import React, { lazy, Suspense } from 'react';
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
/* ---------- Student (protected) ---------- */

/* ---------- Admin ---------- */

import { Analytics } from "@vercel/analytics/react";

/* ---------- Pages load on demand, so a visitor only downloads the page they open ---------- */
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const MediaHome = lazy(() => import('./pages/MediaHome'));
const Photos = lazy(() => import('./pages/Photos'));
const PhotoAlbum = lazy(() => import('./pages/PhotoAlbum'));
const Videos = lazy(() => import('./pages/Videos'));
const Flyers = lazy(() => import('./pages/Flyers'));
const TalentHome = lazy(() => import('./pages/TalentHome'));
const TalentMarketplace = lazy(() => import('./pages/TalentMarketplace'));
const TalentProfile = lazy(() => import('./pages/TalentProfile'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Donate = lazy(() => import('./pages/Donate'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Partnership = lazy(() => import('./pages/Partnership'));
const Terms = lazy(() => import('./pages/Terms'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Scholarship = lazy(() => import('./pages/Scholarship'));
const Team = lazy(() => import('./pages/Team'));
const AdminTeamList = lazy(() => import('./pages/AdminTeamList'));
const AdminTeamEditor = lazy(() => import('./pages/AdminTeamEditor'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const MyCoursePlayer = lazy(() => import('./pages/MyCoursePlayer'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminScholarships = lazy(() => import('./pages/AdminScholarships'));
const AdminPostsList = lazy(() => import('./pages/AdminPostsList'));
const AdminPostEditor = lazy(() => import('./pages/AdminPostEditor'));
const AdminPostCategoriesList = lazy(() => import('./pages/AdminPostCategoriesList'));
const AdminPostCategoryEditor = lazy(() => import('./pages/AdminPostCategoryEditor'));
const AdminPostTagsList = lazy(() => import('./pages/AdminPostTagsList'));
const AdminPostTagEditor = lazy(() => import('./pages/AdminPostTagEditor'));
const AdminCoursesList = lazy(() => import('./pages/AdminCoursesList'));
const AdminCourseEditor = lazy(() => import('./pages/AdminCourseEditor'));
const AdminLessonsList = lazy(() => import('./pages/AdminLessonsList'));
const AdminLessonEditor = lazy(() => import('./pages/AdminLessonEditor'));
const AdminCategoriesList = lazy(() => import('./pages/AdminCategoriesList'));
const AdminCategoryEditor = lazy(() => import('./pages/AdminCategoryEditor'));
const AdminPhotosList = lazy(() => import('./pages/AdminPhotosList'));
const AdminPhotoEditor = lazy(() => import('./pages/AdminPhotoEditor'));
const AdminAlbumPhotos = lazy(() => import('./pages/AdminAlbumPhotos'));
const AdminVideosList = lazy(() => import('./pages/AdminVideosList'));
const AdminVideoEditor = lazy(() => import('./pages/AdminVideoEditor'));
const AdminFlyersList = lazy(() => import('./pages/AdminFlyersList'));
const AdminFlyerEditor = lazy(() => import('./pages/AdminFlyerEditor'));
const AdminJobsList = lazy(() => import('./pages/AdminJobsList'));
const AdminJobEditor = lazy(() => import('./pages/AdminJobEditor'));
const AdminOpportunitiesList = lazy(() => import('./pages/AdminOpportunitiesList'));
const AdminOpportunityEditor = lazy(() => import('./pages/AdminOpportunityEditor'));
const AdminTalentList = lazy(() => import('./pages/AdminTalentList'));
const AdminTalentEditor = lazy(() => import('./pages/AdminTalentEditor'));
const AdminInstructorsList = lazy(() => import('./pages/AdminInstructorsList'));
const AdminInstructorEditor = lazy(() => import('./pages/AdminInstructorEditor'));
const AdminTestimonialsList = lazy(() => import('./pages/AdminTestimonialsList'));
const AdminTestimonialEditor = lazy(() => import('./pages/AdminTestimonialEditor'));
const AdminEnrollments = lazy(() => import('./pages/AdminEnrollments'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminSubscribers = lazy(() => import('./pages/AdminSubscribers'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminPartnerships = lazy(() => import('./pages/AdminPartnerships'));
const AdminVolunteers = lazy(() => import('./pages/AdminVolunteers'));




function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />

        <Suspense fallback={<div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#0a4711' }}>Loading...</div>}>
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
        </Suspense>

        <Footer />
        <WhatsAppButton />
      </Router>
       <Analytics />
    </AuthProvider>
  );
}

export default App;