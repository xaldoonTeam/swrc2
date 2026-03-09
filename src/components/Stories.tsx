

const AlumniStory = ({ name, story, image }: { name: string; story: string; image: string }) => (
  <div className="relative bg-white border border-orange-400 rounded-[4px] p-8 pt-16 max-w-md">
    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
      <img src={image} className="w-32 h-32 rounded-full border-4 border-orange-400 object-cover" alt={name} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2 text-center">Meet Our Alumni: <br/> {name}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{story}</p>
  </div>
);

const Stories = () => (
  <section className="py-20 bg-white px-6">
    <div className="text-center mb-20">
      <h2 className="text-3xl font-bold mb-4">Read the Stories of the Women We Serve</h2>
      <p className="text-gray-500 max-w-2xl mx-auto italic">Every woman has a unique voice and a journey. See what women have to say about our part in their story.</p>
    </div>
    <div className="flex flex-wrap justify-center gap-20 max-w-7xl mx-auto">
      <AlumniStory 
        name="Muna" 
        image="../../public/single.jpg"
        story="Muna, an SWRC graduate, gained essential job-hunting skills, from building a strong CV to mastering interviews..."
      />
      <AlumniStory 
        name="Fihiima Abdirahman" 
        image="../../public/single3.jpg"
        story="Fihiima is a resilient entrepreneur and dedicated professional. After completing the Employability Skills Training Program..."
      />
    </div>
  </section>
);

export default Stories;