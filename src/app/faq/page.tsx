type faqEntry = {
  q: string,
  a: string,
}

import CustomScrollbars from "@/components/CustomScrollbars";

const faqEntries: faqEntry[] = [ // DO NOT move these into a database without removing the html parsing!!!
  {
    q: "I have discovered a bug / have a suggestion for a new feature, how can I contact you?",
    a: `You can email me at <a href='mailto:livewellandmakethings@gmail.com' target='_blank'>livewellandmakethings@gmail.com</a> or <a href='https://x.com/Cxndr_' target='_blank'>dm/@ me on twitter</a>.`
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
        Most modern websites try to do as much work on the server as possible, and then only send the results of that work to your computer in the form of web pages.
      </p></br>
      <p>
        Because generating a theme requires a lot of image processing - in order to prevent large server costs and still provide a free service; this website does most of the heavy lifting for generating the images for the theme on your computer.
      </p></br>
      <p>
        This is why you may notice your computer's fans spinning up and a large amount of computer resources used when creating themes. Much the same as if you were generating the images using GIMP or Photoshop.
      </p>
    `
  }
];


export default function FAQPage() {

  return (

    <div className="w-full h-full flex flex-col justify-center items-center">

      <div className="w-2/3 h-full overflow-y-auto flex flex-col justify-start items-center gap-12 m-8 rounded-3xl bg-zinc-800 bg-opacity-70 pt-12 pb-14 px-10 text-zinc-50 text-2xl shadow-2xl shadow-black">

        <CustomScrollbars>

          <h2 className="text-4xl font-bold text-center">Frequently Asked Questions</h2>

          {faqEntries.map((entry, index) => (
            <div key={index} className="flex flex-col gap-4 w-full">
              <h5 className="font-bold text-2xl mt-14 mb-2 text-accent">{entry.q}</h5>
              <p 
                dangerouslySetInnerHTML={{ __html: entry.a }}
                className="font-normal text-xl text-zinc-100"
              >
              </p>
            </div>
          ))}

        </CustomScrollbars>

      </div>

    </div>

  )
}