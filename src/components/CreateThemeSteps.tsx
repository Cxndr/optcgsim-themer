

type CreateThemeStepsProps = {
  downloadSet: () => void,
  currentStep: number,
  setCurrentStep: (value:number) => void,
}

export default function CreateThemeSteps({downloadSet, currentStep, setCurrentStep}: CreateThemeStepsProps) {

  function handleClick() {
    downloadSet();
  }

  const classNameBase = "h-full "
  const classNameOn = classNameBase + "step step-accent my-auto cursor-pointer";
  const classNameOff = classNameBase + "step my-auto cursor-pointer";

  return (
    <>
      <ul className="steps w-full">
        <li 
          className={currentStep >= 0 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(1)}
        >
          Playmats
        </li>
        <li  
          className={currentStep >= 2 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(2)}
        >
          Menus
        </li> 
        <li 
          className={currentStep >= 3 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(3)}
        >
          Card Backs
        </li>
        <li 
          className={currentStep >= 4 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(4)}
        >
          Don Cards
        </li>
        <li 
          className={currentStep >= 5 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(5)}
        >
          Cards
        </li>
      </ul>
      <button 
        className="btn btn-success my-auto text-base lg:text-xl h-9 min-h-9 px-3 lg:px-4 lg:h-12 lg:min-h-12 shadow-sm shadow-black"
        onClick={handleClick}
      >
          Download Set
        </button>
    </>
  )
}