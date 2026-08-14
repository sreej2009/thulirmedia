import SectionHeading from '../../components/ui/SectionHeading'
import ServiceBlock from '../components/ServiceBlock'
import { services } from '../data'

export default function DMServices() {
  return (
    <section id="dm-services" className="relative bg-void py-28 md:py-40">
      <div className="container-px">
        <SectionHeading
          eyebrow="What We Do"
          title="Eight disciplines. One growth engine."
          description="Every channel run with its own strategy, creative language and reporting — connected by one system built around your numbers."
        />
      </div>

      <div className="mt-16">
        {services.map((service, i) => (
          <ServiceBlock key={service.id} service={service} index={i} />
        ))}
      </div>
    </section>
  )
}
