import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderPanel.css';

function HeaderPanel({ slim, children }) {
    return (
        <div className="header">
            <div className={`header-inner ${slim ? 'slim' : ''}`}>
                <h2 className="header-banner">
                    <Link to="/">PowerForm</Link>
                </h2>
                {children && children.length ? (
                    <ul>
                        {children.map((item, index) => (<li key={index}>{item}</li>))}
                    </ul>
                ) : children}
            </div>
        </div>
    );
}

export default HeaderPanel;