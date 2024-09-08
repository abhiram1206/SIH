import React, { useContext } from "react";
import { Leaf, Sprout, BookOpen, Microscope } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

export default function LandingPage() {
  let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)

  const navigate = useNavigate();
  const navigateToExplore = () =>{ 
    navigate('/explore')
  }
  const navigateToVirtual = () =>{ 
    navigate('/virtualgardern')
  }
  return (
    <>
      {
        access_token ? 
        <div className="flex flex-col w-[1480px]">
      <Navbar/>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover the Healing Power of AYUSH
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Explore our Virtual Herbal Garden and immerse yourself in the world of Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy.
                </p>
                <div className="space-x-4">
                  <Button onClick={navigateToExplore}>Start Exploring</Button>
                  <Button onClick={navigateToVirtual} variant="outline">Virtual Garden</Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <img
                  src="https://image.lexica.art/full_jpg/95825743-76c1-4df6-bc5b-4ccbc0db6f77"
                  alt="Herbal Garden Illustration"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Features of Our Virtual Herbal Garden
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                <Sprout className="h-10 w-10 text-green-600" />
                <h3 className="text-xl font-bold">Interactive Plant Encyclopedia</h3>
                <p className="text-gray-600 text-center">
                  Explore detailed information about various medicinal plants used in AYUSH systems.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                <BookOpen className="h-10 w-10 text-green-600" />
                <h3 className="text-xl font-bold">Educational Resources</h3>
                <p className="text-gray-600 text-center">
                  Access comprehensive guides and articles about traditional healing practices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white shadow-sm">
                <Microscope className="h-10 w-10 text-green-600" />
                <h3 className="text-xl font-bold">Scientific Insights</h3>
                <p className="text-gray-600 text-center">
                  Discover the latest research and studies on medicinal plants and their properties.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center gap-3">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Embark on Your Herbal Journey
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Join our community of herbal enthusiasts and traditional medicine practitioners. Start exploring the Virtual Herbal Garden today!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2 gap-4">
                  <Input
                    className="flex-1"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>:navigate('/signin')
      }
    </>
    
  );
}
