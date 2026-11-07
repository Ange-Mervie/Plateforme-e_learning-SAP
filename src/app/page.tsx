import Hero from "@/components/site/hero";
import Domains from "@/components/site/domains";
import PopularCourses from "@/components/site/popular-courses";
import Paths from "@/components/site/paths";
import Stats from "@/components/site/stats";
import Testimonials from "@/components/site/testimonials";
import Certifications from "@/components/site/certifications";
import Footer from "@/components/site/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy">
      <main className="flex-1">
        <Hero />
        <Domains />
        <PopularCourses />
        <Stats />
        <Paths />
        <Testimonials />
        <Certifications />
      </main>
      <Footer />
    </div>
  );
}
