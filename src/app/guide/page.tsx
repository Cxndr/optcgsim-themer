
export const revalidate = 86400;

export default function GuidePage() {


  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full lg:w-2/3 flex flex-col justify-center items-center gap-6 lg:gap-12 m-2 lg:m-8 rounded-3xl bg-zinc-800 bg-opacity-70 pt-4 pb-4 lg:pt-12 lg:pb-14 px-4 lg:px-10 text-zinc-50 text-2xl shadow-2xl shadow-black">
        <h2 className="text-4xl font-bold">Installation Guide</h2>
        <ol className="pl-8 lg:pl-12 flex flex-col gap-8 list-decimal">
          <li>Create your theme or download the default theme above.</li>
          <li>Extract the contents of the zip file.</li>
          <li>Copy the contents of the extracted zip folder into the StreamingAssets folder of your OPTCG Sim installation, overwriting all the existing files. <br/></li>
        </ol>
        <p className="text-center w-auto text-zinc-700 bg-zinc-200 bg-opacity-70 rounded-2xl py-2 px-4 shadow-sm shadow-black">
            <span className="text-error">[YOUR OPTCGSIM INSTALL]</span> / Builds<span className="text-error">[OS]</span> / OPTCGSim_Data / StreamingAssets
        </p>
      </div>
    </div>
  )
}