import React from 'react';
import './Loading.css';

function Loading({ dark }) {
    return (
        <div className={`loading ${dark ? 'loading-dark' : ''}`} />
    );
}

export default Loading;