import SEOHead from '../components/layout/SEOHead'
import Navbar from '../components/layout/Navbar'
import SectionNav from '../components/layout/SectionNav'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Services from '../sections/Services'
import Experience from '../sections/Experience'
import Contact from '../sections/Contact'

export default function Home() {
  return (
    <>
      <SEOHead
        path="/"
        title="Aether — Creative Developer"
        description="Portfolio — cinematic 3D web experiences, product design and engineering."
      />
      <SectionNav />
      <Navbar />
      <main className="relative bg-void">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
