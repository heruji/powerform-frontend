import React from 'react';
import './SubContainer.css'

function SubContainer({ fit, children }) {
    return (
        <div className={`subcontainer ${fit ? 'fit' : ''}`}>
            {children}
        </div>
    );
}

export default SubContainer;