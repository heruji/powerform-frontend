import React from 'react';
import { Link } from 'react-router-dom';
import { tryGetForms, tryRemoveForms } from '../common/MyFormStorage';
import Panel from '../component/Panel';
import Button from '../component/Button';
import './MyFormPanel.css';

class MyFormPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: tryGetForms()
        };
    }

    handleRemove = () => {
        tryRemoveForms();
        this.setState({
            forms: []
        });
    }

    render() {
        const { forms } = this.state;
        let content;
        if (forms.length) {
            const listItems = forms.map(form => (
                <li key={form.id} style={{ padding: '0' }}>
                    <Link to={`/result/${form.id}`} className="my-form-link">
                        <span>{form.title}</span><br />
                        <span>{form.createTime}</span>
                    </Link>
                </li>
            ));
            content = (
                <React.Fragment>
                    <ul>{listItems}</ul>
                    <hr className="my-form-sep" />
                    <div className="my-form-control">
                        <Button
                            onClick={this.handleRemove}
                            content="清空"
                        />
                    </div>
                </React.Fragment>
            );
        }
        return (
            <Panel
                title="我的表单"
                type="menu"
                content={content}
                emptyHint="暂无数据"
            />
        );
    }
}

export default MyFormPanel;