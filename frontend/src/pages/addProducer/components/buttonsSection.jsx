import React from "react";
import { Link } from "react-router-dom";

function ButtonsSection ({MAX_STEPS, formStep, setFormStep, setDroppedFiles, isValid, 
                            actualFairLocality, fairParticipationChecked, setActualFairLocality}) {

    const completeFormStep = () => {
        setFormStep(cur => cur + 1);
    }

    const returnFormStep = () => {
        setDroppedFiles([]);
        setActualFairLocality([]);
        setFormStep(cur => cur - 1);
    }

    const renderPrevButton = () => {
        if (formStep === 0) {
            return (
                <Link to={'/'} className='btn cancel'>Cancelar</Link>
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
                <button disabled={!isValid || !(fairParticipationChecked ? (actualFairLocality.length > 0) : true)} type="button" className='btn continue' onClick={completeFormStep}>Continuar</button>
            )
        }
    }

    return (
        <div className='button-section'>
            {renderPrevButton()}
            {renderNextButton()}
            {(formStep === MAX_STEPS - 1) && (
                <button disabled={!isValid || !(fairParticipationChecked ? (actualFairLocality.length > 0) : true)} type="submit" className='btn continue'>Finalizar</button>
            )}
        </div>
    )
}

export default ButtonsSection;