import Link from "next/link";



export default function NavMenu() {

  const downloadDefault = ()  => {
    // const zipFile = "/files/DefaultTheme.zip";
    const link = document.createElement("a");
    link.href = "https://utfs.io/f/tE0Y6OM99lGIqN3NOdv7U9jGWgMKR0upPJL8TYQS4CAemchi";
    link.download = "OPTCGSimThemer-DefaultTheme.zip"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <li>
        <button 
          className="btn btn-success text-success-content text-xl lg:text-xl 2xl:text-2xl font-medium shadow-sm shadow-black"
          onClick={downloadDefault}
        >
          Download Defaults
        </button>
      </li>

      <li>
        <Link href="/create">Create Your Own</Link>
      </li>

      <li>
        <Link href="/guide">Install Guide</Link>
      </li>

      <li>
        <Link href="/faq">FAQ</Link>
      </li>

    </>
  )
}