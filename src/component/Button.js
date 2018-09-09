import React from 'react';
import './Button.css'

function Button({ onClick, disabled, fixedWidth, content }) {
    return (
        <button
            onClick={onClick}
            className={`btn ${fixedWidth ? 'btn-fix-width' : ''}`}
            disabled={disabled}
        >
            {content}
        </button>
    );
}

export default Button;