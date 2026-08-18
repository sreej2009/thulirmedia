import SectionHeading from '../../../components/ui/SectionHeading'
import ServiceBlock from '../../shared/components/ServiceBlock'
import { whatWeDo } from '../data'

export default function WhatWeDo() {
  return (
    <section id="dm-whatwedo" className="relative bg-void py-24 md:py-32">
      <div className="container-px">
        <SectionHeading eyebrow={whatWeDo.eyebrow} title={whatWeDo.title} description={whatWeDo.description} />
      </div>

      <div className="mt-14">
        {whatWeDo.categories.map((category, i) => (
          <ServiceBlock key={category.id} service={category} index={i} ctaHref="#dm-cta" />
        ))}
      </div>
    </section>
  )
}
