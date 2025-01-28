import { ImageSet } from "@/utils/imageSet";
import DownloadProgress from "./DownloadProgress";

type CreateThemeStepsProps = {
  imageSet: ImageSet,
  currentStep: number,
  setCurrentStep: (value:number) => void,
}

export default function CreateThemeSteps({imageSet, currentStep, setCurrentStep}: CreateThemeStepsProps) {
  function handleClick() {
    const modal = document.getElementById('download_modal') as HTMLDialogElement;
    modal.showModal();
  }

  const maxStep = 5;
  const minStep = 1;

  function nextStep() {
    if (currentStep >= maxStep) {
      setCurrentStep(maxStep);
      return;
    }
    setCurrentStep(currentStep+1);
  }

  function prevStep() {
    if (currentStep <= minStep) {
      setCurrentStep(minStep);
      return;
    }
    setCurrentStep(currentStep-1);
  }

  let prevDisabled = false;
  if (currentStep <= minStep) prevDisabled = true;

  let nextDisabled = false;
  if (currentStep >= maxStep) nextDisabled = true;

  const buttonClassName = "btn my-auto text-base lg:text-xl h-9 min-h-9 px-3 lg:px-4 lg:h-12 lg:min-h-12 shadow-sm shadow-black "
  

  const classNameBase = "h-full "
  const classNameOn = classNameBase + "step step-accent my-auto cursor-pointer";
  const classNameOff = classNameBase + "step my-auto cursor-pointer";

  return (
    <div className="flex w-full">

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

      <div className="flex-grow flex gap-12 justify-between mr-4">
        <div className="flex gap-2">
          <button 
            className={`${buttonClassName} btn-secondary`}
            onClick={prevStep}
            disabled={prevDisabled}
          >
            Prev
          </button>

          <button
            className={`${buttonClassName} btn-secondary`}
            onClick={nextStep}
            disabled={nextDisabled}
          >
            Next
          </button>
        </div>

        <button 
          className={`${buttonClassName} btn-success`}
          onClick={handleClick}
        >
          Download Set
        </button>

        <DownloadProgress imageSet={imageSet}/>

      </div>
      
    </div>
  )
}