type faqEntry = {
  q: string,
  a: string,
}

const faqEntries: faqEntry[] = [ // DO NOT move these into a database without removing the html parsing!!!
  {
    q: "I have discovered a bug / have a suggestion for a new feature, how can I contact you?",
    a: `You can email me at <a href='mailto:livewellandmakethings@gmail.com'>livewellandmakethings@gmail.com<a> or <a href='https://x.com/Cxndr_'>dm/@ me on twitter</a>.`
  },
  {
    q: "How does this website work?",
    a: `
      <p>
        This website uses a javascript library called JIMP to generate images for themes.
      </p></br>
      <p>
        JIMP is an image processing library very similar to popular image editing software like GIMP and Photoshop, but instead of using a graphic user interface it is operated through code.
      </p></br>
      <p>
        You will need javascript turned on to be able to create your own themes, but not if you just want to download the default theme.
      </p>
    `
  },
  {
    q: "Why does this website use a lot of my computer's resources?",
    a: `
      <p>
        Most modern websites try and do as much work on the server as possible, and then only send the results of that work to your computer in the form of web pages.
      </p></br>
      <p>
        Because generating a theme requires a lot of image processing - in order to prevent large server costs and still provide a free service this website does most of the heavy lifting for generating the images for the theme on your computer.
      </p></br>
      <p>
        This is why you may notice your computer's fans spinning up and a large amount of computer resources used when creating themes. Much the same as if you were generating the images using GIMP or Photoshop.
      </p>
    `
  }
];


export default function FAQPage() {


  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-2/3 flex flex-col justify-center items-center gap-12 m-8 rounded-3xl bg-zinc-800 bg-opacity-70 pt-12 pb-14 px-10 text-zinc-50 text-2xl shadow-2xl shadow-black">
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        {faqEntries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-4 w-full">
            <h5 className="font-bold text-2xl">{entry.q}</h5>
            <p 
              dangerouslySetInnerHTML={{ __html: entry.a }}
              className="font-normal text-xl"
            >  
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}