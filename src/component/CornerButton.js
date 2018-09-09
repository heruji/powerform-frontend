import React from 'react';
import './CornerButton.css'

function CornerButton({ type, onClick }) {
    return (
        <span
        className={`corner-btn corner-btn-${type}`}
        onClick={e => {
            e.stopPropagation();
            onClick();
        }}
        />
    );
}

export default CornerButton;