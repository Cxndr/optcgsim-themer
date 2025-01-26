import DemoCarousel from "@/components/DemoCarousel"

export default function HomePage() {


  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full mx-4 lg:w-2/3 flex flex-col justify-center items-center gap-5 rounded-3xl bg-zinc-800 bg-opacity-70 p-6 shadow-2xl shadow-black">
        <h2 className="text-zinc-50 font text-2xl text-center">Download and create custom themes for OPTCG Sim.</h2>
        <DemoCarousel />
      </div>
    </div>
  )
}