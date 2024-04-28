'use client'

import Navbar from "@/components/navBar";

export default function AboutUs() {
  return (
    <div className="bg-fixed min-h-screen inset-0 overflow-auto bg-gradient-to-r pt-20 w-screen justify-center from-[#481d80] to-[#000000]">
      <Navbar />
      <h1 className="text-4xl text-center text-white font-bold mb-8">About Us</h1>
      <div>
        <h2 className="text-2xl text-center text-white font-bold mb-4">Our Story</h2>
        <p className="mb-4 justify-center text-white max-w-4xl text-center mx-auto">
          Nulla facilisi. Mauris quis condimentum odio, sit amet tempus libero.
          Cras aliquam at massa eget placerat. Curabitur vitae dui vulputate,
          pulvinar magna vel, sodales odio. Cras at posuere velit. Ut imperdiet
          velit non leo commodo, nec vulputate elit egestas. Curabitur
          condimentum, mauris non congue feugiat, leo est euismod eros, vel
          tincidunt lacus odio eget mauris. Sed magna dolor, posuere vel dolor
          sit amet, cursus iaculis libero. Duis scelerisque sapien mauris, et
          commodo eros blandit quis. Fusce ac sem eu lorem fermentum dignissim
          vel pharetra neque. Nunc cursus fringilla tempu
        </p>
        <h2 className="text-2xl text-center text-white font-bold mb-4">Our Mission</h2>
        <p className="mb-4 justify-center text-white max-w-4xl text-center mx-auto">
          mauris non congue feugiat, leo est euismod eros, vel tincidunt lacus
          odio eget mauris. Sed magna dolor, posuere vel dolor sit amet, cursus
          iaculis libero. Duis scelerisque sapien mauris, et commodo eros
          blandit quis. Fusce ac sem eu lorem fermentum dignissim vel pharetra
          neque. Nunc cursus fringilla tempu
        </p>
        <h2 className="text-2xl text-center text-white font-bold mb-4">Our Values</h2>
        <p className="mb-4 justify-center text-white max-w-4xl text-center mx-auto">
          Duis nisi erat, egestas nec tempor vel, accumsan sed enim. Ut
          porttitor elit eu nisi pretium commodo. Nam tempor dui quis faucibus
          bibendum. Pellentesque fringilla, nisl ut gravida venenatis, sapien
          arcu vehicula arcu, vitae laoreet justo risus id purus. Aliquam
          molestie pellentesque nisi, eget auctor diam rhoncus quis. Vivamus in
          pulvinar leo. Sed commodo posuere lacus. Cras sollicitudin ex purus.
          Aliquam eu rhoncus tortor, v
        </p>
      </div>
    </div>
  );
}
