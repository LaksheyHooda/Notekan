import { Navbar } from '@nextui-org/react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <div className="overflow-auto h-screen">
      <Navbar />
      <div className="h-screen flex flex-col items-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mt-4">
          About Us
        </h1>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Story</h2>
        <p className="text-gray-200 mb-6 mx-auto px-16">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mattis
          magna consectetur ex gravida commodo. Curabitur id turpis vel massa
          cursus aliquet convallis ac magna. Proin sed libero eu tortor ultrices
          porta tincidunt eget lacus. Ut dictum euismod tincidunt. Duis posuere
          finibus urna, ut iaculis urna vehicula id. Phasellus rutrum molestie
          lectus, at malesuada quam hendrerit a. Nulla non risus eget magna
          varius vestibulum eu a mi.
        </p>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
        <p className="text-gray-200 mb-6 mb-6 mx-auto px-16">
          Phasellus rutrum molestie lectus, at malesuada quam hendrerit a. Nulla
          non risus eget magna varius vestibulum eu a mi. Duis in elit velit.
          Vestibulum sodales porttitor eros, tristique pretium metus interdum
          eu. Sed quis dui quis augue scelerisque ullamcorper consectetur nec
          velit. Curabitur id sapien a purus consectetur cursus a ac sapien. Ut
          odio libero, pulvinar nec blandit sed, efficitur ac arcu. Sed dui
          ligula, vulputate et metus quis, pretium accumsan justo.
        </p>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Team</h2>
        <p className="text-gray-200 mb-6 mb-6 mx-auto px-16">
          In enim orci, bibendum id ullamcorper et, interdum quis arcu. Nulla a
          purus pulvinar, pulvinar erat in, tempor elit. Integer cursus ornare
          lectus. Praesent diam ligula, ultrices et molestie nec, pulvinar vitae
          magna. Vestibulum eget mollis nisi, in fermentum turpis. Nulla purus
          nibh, tincidunt vitae fermentum ac, lacinia non magna. Mauris
          sollicitudin sagittis mauris vulputate gravida. Etiam id rhoncus
          purus, quis tincidunt nunc. Cras malesuada sem mi, at auctor justo
          placerat a.
        </p>
      </div>
    </div>
  );
}
