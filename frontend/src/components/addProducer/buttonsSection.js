import React from "react";

function ButtonsSection ({MAX_STEPS, formStep, setFormStep, setDroppedFiles, isValid}) {

    const completeFormStep = () => {
        setFormStep(cur => cur + 1);
    }

    const returnFormStep = () => {
        setDroppedFiles([]);
        setFormStep(cur => cur - 1);
    }

    const renderPrevButton = () => {
        if (formStep === 0) {
            return (
                <button type="button" className='btn cancel'>Cancelar</button>
            )
        } else {
            return (
                <button type="button" className='btn cancel' onClick={returnFormStep}>Anterior</button>
            )
        }
    }

    const renderNextButton = () => {
        if (formStep === MAX_STEPS-1) {
            return (
                undefined
            )
        } else {
            return (
                <button disabled={!isValid} type="button" className='btn continue' onClick={completeFormStep}>Continuar</button>
            )
        }
    }

    return (
        <div className='button-section'>
            {renderPrevButton()}
            {renderNextButton()}
            {(formStep === MAX_STEPS - 1) && (
                <button disabled={!isValid} type="submit" className='btn continue'>Finalizar</button>
            )}
        </div>
    )
}

export default ButtonsSection;