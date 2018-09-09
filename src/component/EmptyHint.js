import React from 'react';
import './EmptyHint.css'

function EmptyHint({ content }) {
    return (
        <div className="hint-empty">{content}</div>
    );
}

export default EmptyHint;