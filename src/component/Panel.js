import React from 'react';
import SubContainer from './SubContainer';
import PanelTitle from './PanelTitle';
import EmptyHint from './EmptyHint';
import './Panel.css';

function Panel({ title, type, fit, content, empty, emptyHint }) {
    const showEmptyHint = empty === undefined ? !content : empty;
    return (
        <div className={`panel-${type}`}>
            <SubContainer fit={fit}>
                <PanelTitle content={title} />
                <div className="panel-content">{content}</div>
                {showEmptyHint && (<EmptyHint content={emptyHint || '空'} />)}
            </SubContainer>
        </div>
    );
}

export default Panel;