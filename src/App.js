import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
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
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/media/photos" element={<Photos />} />
        <Route path="/media/videos" element={<Videos />} />
        <Route path="/talent" element={<TalentHome />} />
        <Route path="/talent/jobs" element={<Jobs />} />
        <Route path="/talent/opportunities" element={<Opportunities />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/media/flyers" element={<Flyers />} />
      </Routes>
      <Footer />
<BackToTop />
<WhatsAppButton />
</Router>
  );
}

export default App;