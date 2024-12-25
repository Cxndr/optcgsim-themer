
type CreateThemeStepsProps = {
  downloadSet: () => void,
}

export default function CreateThemeSteps({downloadSet}: CreateThemeStepsProps) {

  function handleClick() {
    downloadSet();
  }

  return (
    <>
      <ul className="steps w-full">
        <li className="step step-accent my-auto">Playmats</li>
        <li className="step my-auto">Menus</li>
        <li className="step my-auto">Card Backs</li>
        <li className="step my-auto">Don Cards</li>
        <li className="step my-auto">Cards</li>
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