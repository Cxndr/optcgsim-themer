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

  const badgeClassName = "indicator-item badge text-xs right-0 -top-2 lg:translate-x-[110%] top-0 lg:top-2 px-1 py-0 lg:px-1.5 lg:py-0 shadow-black/70 shadow-sm";

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
          <div className="indicator text-xs lg:text-base">
            Playmats
            { getPlaymatCount() 
            ? 
              <span className={`${badgeClassName} ${
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
          <div className="indicator text-xs lg:text-base">
            Menus
            { getMenusCount() 
              ? 
                <span className={`${badgeClassName} ${
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
          <div className="indicator text-xs lg:text-base">
            Card Backs
            { getCardBacksCount() 
                ? 
                <span className={`${badgeClassName} ${
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
          <div className="indicator text-xs lg:text-base">
            Don
            { getDonCardsCount()
                ?
                  <span className={`${badgeClassName} ${
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
          <div className="indicator text-xs lg:text-base">
            Cards
            { getCardsCount()
                ?
                  <span className={`${badgeClassName} badge-success`}>
                  {getCardsCount()}
                </span>
                : ""}
          </div>
        </li>

      </ul>

      <div className="flex-grow flex flex-col lg:flex-row gap-2 lg:gap-12 justify-between lg:mr-4">
        <div className="join">
          <button 
            className={`${buttonClassName} btn-secondary join-item text-xs lg:text-base`}
            onClick={prevStep}
            disabled={prevDisabled}
          >
            Prev
          </button>

          <button
            className={`${buttonClassName} btn-secondary join-item  text-xs lg:text-base`}
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