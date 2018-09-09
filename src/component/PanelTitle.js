import React from 'react';
import './PanelTitle.css'

function PanelTitle({ content }) {
    return (
        <div className={`panel-title${!content ? '-none' : ''}`}>
            {content}
        </div>
    );
}

export default PanelTitle;