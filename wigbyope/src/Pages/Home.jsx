import React from 'react';
import HeroBanner from '../Components/HeroBanner';
// import { Scissors, GraduationCap, Sparkles } from 'lucide-react';
import HomeService from './HomeService';
import FeaturedProducts from '../Components/FeaturedProduct';
import TrainingPreview from './TrainingPreview';
import AboutUs from './AboutUs.jsx';
import Testimonials from './Testimonials.jsx';
import ContactCTA from './ContactCTA.jsx';


const Home = () => (
  <>
    <HeroBanner />
    <HomeService/>
    <FeaturedProducts />
    <TrainingPreview />
    <AboutUs/>
    <Testimonials/>
    <ContactCTA/>
  </>
);

export default Home;
