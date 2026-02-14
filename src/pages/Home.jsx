import React, { useState, useEffect } from 'react';

import Hero from '../components/home/Hero';
import Partners from '../components/home/Partners';
import Diagnosis from '../components/home/Diagnosis';
import Tracks from '../components/home/Tracks';
import Roadmap from '../components/home/Roadmap';
import Pricing from '../components/home/Pricing';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';
import Mission from '../components/home/Mission';
import FAQ from '../components/home/FAQ';

import { pageService } from '../services/pageService';

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await pageService.getPageData('home');
        setHomeData(data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  if (!homeData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main>
      <Hero data={homeData.hero} />
      <Partners data={homeData.partners} />
      {/* Diagnosis removed or needs data? Keeping placeholder if it doesn't crash, else remove. HomeEditPage doesn't manage it. */}
      <Diagnosis data={homeData.diagnosis} />
      <Tracks data={homeData.tracks} />
      <Roadmap data={homeData.homeRoadmap || { steps: [] }} />
      <Pricing data={homeData.pricing} />
      <Testimonials testimonials={homeData.testimonials} />
      <CTA data={homeData.ctaFinal} />
      <FAQ data={homeData.faq} />
    </main>
  );
};

export default Home;
