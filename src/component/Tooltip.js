import React from 'react';
import './Tooltip.css';

function Tooltip({ display, content, disabled }) {
    return (
        <div className="tooltip">
            {display}
            {!disabled && content &&
                <div className="tooltip-content">
                    {content}
                </div>}
        </div>
    );
}

export default Tooltip;