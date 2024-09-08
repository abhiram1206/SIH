import React from 'react';
import Navbar from './Navbar';

const AboutUs = () => {
  return (
    <div className='w-[1528px]'>
        <Navbar/>
      {/* Header Section */}
      <header className="relative bg-[#6C9D6A] bg-cover bg-center h-[60vh] flex justify-center items-center text-white text-center">
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold mb-2">About Our Virtual Herbal Garden</h1>
          <p className="text-lg max-w-2xl">Discover the world of medicinal plants and the AYUSH systems through an interactive, educational, and immersive experience.</p>
        </div>
      </header>

      {/* About Section */}
      <section className="container mx-auto my-10 px-5 text-center">
        <h2 className="text-3xl text-[#6C9D6A] font-semibold mb-5">Our Mission</h2>
        <p className="text-lg text-[#555] mb-10">
          At Virtual Herbal Garden, our mission is to promote awareness and knowledge about medicinal plants used in Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy (AYUSH). We aim to connect people with the healing power of nature through immersive virtual experiences.
        </p>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto my-10 px-5 text-center">
        <h2 className="text-3xl text-[#6C9D6A] font-semibold mb-5">Our Vision</h2>
        <p className="text-lg text-[#555] mb-10">
          We envision a world where traditional knowledge of medicinal plants and their benefits is accessible to all, helping people lead healthier, more natural lives. Through technology, we bring the wonders of nature to your fingertips, empowering you to explore and grow your understanding of AYUSH systems.
        </p>
      </section>

      {/* Values Section */}
      <section className="bg-white py-12 px-5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-[#6C9D6A] font-semibold mb-5">Our Values</h2>
          <div className="flex flex-wrap justify-around gap-5">
            <div className="bg-[#f8f8f8] p-8 rounded-lg w-80 shadow-md">
              <h3 className="text-xl text-[#567D57] mb-2">Education</h3>
              <p className="text-base text-[#666]">
                We believe in the power of education and strive to provide comprehensive, easy-to-understand resources about the plants and principles of AYUSH.
              </p>
            </div>
            <div className="bg-[#f8f8f8] p-8 rounded-lg w-80 shadow-md">
              <h3 className="text-xl text-[#567D57] mb-2">Sustainability</h3>
              <p className="text-base text-[#666]">
                Our goal is to promote sustainable practices and preserve the biodiversity of medicinal plants for future generations.
              </p>
            </div>
            <div className="bg-[#f8f8f8] p-8 rounded-lg w-80 shadow-md">
              <h3 className="text-xl text-[#567D57] mb-2">Wellness</h3>
              <p className="text-base text-[#666]">
                We focus on holistic wellness, combining physical, mental, and spiritual health through the use of natural remedies and practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#567D57] text-white py-5 text-center">
        <p className="text-sm">&copy; 2024 Virtual Herbal Garden. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
