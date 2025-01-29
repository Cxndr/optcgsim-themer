import { CardBackTypeValues, getCardBacksCount, getCardsCount, getDonCardsCount, getMenusCount, getPlaymatCount, ImageSet, isImageSetEmpty, LeaderColorValues, MenuTypeValues } from "@/utils/imageSet";
import DownloadProgress from "./DownloadProgress";
import { useEffect, useState } from "react";

type CreateThemeStepsProps = {
  imageSet: ImageSet,
  currentStep: number,
  setCurrentStep: (value:number) => void,
}

export default function CreateThemeSteps({imageSet, currentStep, setCurrentStep}: CreateThemeStepsProps) {

  const [showDownload, setShowDownload] = useState(!isImageSetEmpty(imageSet));
  const [tooltipClassName, setTooltipClassName] = useState(showDownload ? "" : "tooltip tooltip-warning");

  const imageSetString = JSON.stringify(imageSet);

  useEffect(() => {
    setShowDownload(!isImageSetEmpty(imageSet));
    setTooltipClassName(showDownload ? "" : "tooltip tooltip-error tooltip-bottom");
  }, [imageSet, imageSetString, showDownload]);
  
  const maxStep = 5;
  const minStep = 1;

  function handleDownloadClick() {
    if (!showDownload) return;
    const modal = document.getElementById('download_modal') as HTMLDialogElement;
    modal.showModal();
  }

  function nextStep() {
    if (currentStep >= maxStep) {
      setCurrentStep(maxStep);
      return;
    }
    if (currentStep <= minStep) {
      setCurrentStep(minStep+1);
      return;
    }
    setCurrentStep(currentStep+1);
  }

  function prevStep() {
    if (currentStep <= minStep) {
      setCurrentStep(minStep);
      return;
    }
    if (currentStep >= maxStep) {
      setCurrentStep(maxStep-1);
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
          <div className="indicator">
            Playmats
            { getPlaymatCount() 
            ? 
              <span className={`indicator-item badge text-xs -right-6 top-2 px-1.5 py-0 shadow-black/70 shadow-sm ${
                getPlaymatCount() === LeaderColorValues.length ? 'badge-success' : 'badge-error'
              }`}>
                {getPlaymatCount()}/{LeaderColorValues.length}
              </span>
            : ""}
          </div>
        </li>

        <li  
          className={currentStep >= 2 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(2)}
        >
          <div className="indicator">
            Menus
            { getMenusCount() 
              ? 
                <span className={`indicator-item badge text-xs -right-6 top-2 px-1.5 py-0 shadow-black/70 shadow-sm ${
                  getMenusCount() === MenuTypeValues.length ? 'badge-success' : 'badge-error'
                }`}>
                  {getMenusCount()}/{MenuTypeValues.length}
                </span>
              : ""}
          </div>
        </li> 

        <li 
          className={currentStep >= 3 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(3)}
        >
          <div className="indicator">
            Card Backs
            { getCardBacksCount() 
                ? 
                <span className={`indicator-item badge text-xs -right-6 top-2 px-1.5 py-0 shadow-black/70 shadow-sm ${
                    getCardBacksCount() === CardBackTypeValues.length ? 'badge-success' : 'badge-error'
                  }`}>
                  {getCardBacksCount()}/{CardBackTypeValues.length}
                </span>
                : ""}
          </div>
        </li>

        <li 
          className={currentStep >= 4 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(4)}
        >
          <div className="indicator">
            Don Cards
            { getDonCardsCount()
                ?
                  <span className={`indicator-item badge text-xs -right-5 top-2 px-1.5 py-0 shadow-black/70 shadow-sm ${
                    getDonCardsCount() === 1 ? 'badge-success' : 'badge-error'
                  }`}>
                  {getDonCardsCount()}/1
                </span>
                : ""}
          </div>
        </li>

        <li 
          className={currentStep >= 5 ? classNameOn : classNameOff}
          onClick={() => setCurrentStep(5)}
        >
          <div className="indicator">
            Cards
            { getCardsCount()
                ?
                  <span className={`indicator-item badge text-xs -right-5 top-2 px-1.5 py-0 shadow-black/70 shadow-sm badge-success`}>
                  {getCardsCount()}
                </span>
                : ""}
          </div>
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

        <span
          className={`flex justify-center ${tooltipClassName}`}
          data-tip="No customizations set!"
        >
          <button 
            className={`${buttonClassName} btn-success `}
            
            onClick={handleDownloadClick}
          >
            Download
          </button> 
        </span>

        <DownloadProgress imageSet={imageSet}/>

      </div>
      
    </div>
  )
}