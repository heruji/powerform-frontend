import React from 'react';
import Separator from './Separator';
import './FormInfo.css'

function FormInfo({ element }) {
    return (
        <React.Fragment>
            <h2 className="form-title">{element.title}</h2>
            <div className="form-info">{element.hint}</div>
            <Separator />
        </React.Fragment>
    );
}

export default FormInfo;