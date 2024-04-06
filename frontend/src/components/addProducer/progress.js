import React from "react";

function Progress({MAX_STEPS, formStep}){
    const progress = (formStep + 1) / MAX_STEPS * 100; // Calculate progress percentage

    const renderProgressIndicator = () => {
        const progressIndicator = [];
        for (let i = 0; i < MAX_STEPS; i++) {
            progressIndicator.push(
                <div key={i} className={`step ${formStep === i ? 'active' : ''}`}>
                    {i + 1}
                </div>
            );
        }

        return (
            <div className='progress-indicator'>
                {progressIndicator}
            </div>
        );
    };

    return (
        <div>
            {renderProgressIndicator()}
            <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}

export default Progress;