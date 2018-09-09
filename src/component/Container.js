import React from 'react';
import './Container.css'

function Container({ type, children }) {
    return (
        <div className={`container-${type || 'default'}`}>
            {children}
        </div>
    );
}

export default Container;