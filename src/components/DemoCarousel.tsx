"use client";

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay';

export default function DemoCarousel() {

  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: false},
    [Autoplay()]
  )


  return (
    <div className="embla rounded-2xl shadow-md shadow-black" ref={emblaRef}>
      <div className="embla__container">

        <div className="embla__slide">
          <Image src="/img/demo/01.png" width={1920} height={1006} alt="demo image 01 - homepage" />
        </div>

        <div className="embla__slide"> 
          <Image src="/img/demo/02.png" width={1920} height={1006} alt="demo image 02 - deck editor" />
        </div>

        <div className="embla__slide">
          <Image src="/img/demo/03.png" width={1920} height={1006} alt="demo image 03 - deck editor cards" />
        </div>

        <div className="embla__slide">
          <Image src="/img/demo/04.png" width={1920} height={1006} alt="demo image 04 - gameplay" />
        </div>

        <div className="embla__slide">
          <Image src="/img/demo/05.png" width={1920} height={1006} alt="demo image 05 - gameplay cards" />
        </div>

      </div>
    </div>
  )
}