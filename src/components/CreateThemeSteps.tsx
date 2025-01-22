import Link from "next/link";

type CreateThemeStepsProps = {
  downloadSet: () => void,
  setCurrentStep: (value:number) => void,
}

export default function CreateThemeSteps({downloadSet, setCurrentStep}: CreateThemeStepsProps) {

  function handleClick() {
    downloadSet();
  }

  return (
    <>
      <ul className="steps w-full">
        <li 
          className="step step-accent my-auto"
          onClick={() => setCurrentStep(1)}
        >
            Playmats
        </li>
        <li  
          className="step my-auto"
          onClick={() => setCurrentStep(2)}
        >
          Menus
        </li>
        <li 
          className="step my-auto" 
          onClick={() => setCurrentStep(3)}
        >
          Card Backs
        </li>
        <li 
          className="step my-auto"
          onClick={() => setCurrentStep(4)}
        >
          Don Cards
        </li>
        <li 
          className="step my-auto" 
          onClick={() => setCurrentStep(5)}
        >
          Cards
        </li>
      </ul>
      <button 
        className="btn btn-success my-auto text-xl shadow-sm shadow-black"
        onClick={handleClick}
      >
          Download Set
        </button>
    </>
  )
}