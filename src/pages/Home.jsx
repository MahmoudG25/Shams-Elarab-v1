import React from 'react';
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

import data from '../data/landing-page.json';

const Home = () => {
  return (
    <main>
      <Hero data={data.hero} />
      <Partners data={data.partners} />
      <Diagnosis data={data.diagnosis} />
      <Tracks />
      <Roadmap />
      <Pricing />
      <Testimonials />
      <CTA />
      <FAQ />
      <Mission data={data.mission} />
    </main>
  );
};

export default Home;
