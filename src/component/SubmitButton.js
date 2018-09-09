import React from 'react';
import Loading from './Loading';
import './SubmitButton.css'

function SubmitButton({ onSubmit, isLoading }) {
    return (
        <button
            onClick={onSubmit}
            className="btn-submit"
            disabled={isLoading}
        >
            {isLoading ? (<Loading />) : '提交'}
        </button>
    );
}

export default SubmitButton;