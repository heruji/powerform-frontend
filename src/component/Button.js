import React from 'react';
import './Button.css'

function Button({ onClick, disabled, fixedWidth, content, type }) {
    return (
        <button
            onClick={onClick}
            className={`btn btn-type-${type || 'default'} ${fixedWidth ? 'btn-fix-width' : ''}`}
            disabled={disabled || type === 'success' || type === 'error'}
        >
            {content}
        </button>
    );
}

export default Button;