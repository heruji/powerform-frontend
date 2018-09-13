import React from 'react';
import { Link } from 'react-router-dom';
import { tryGetForms, tryRemoveForms } from '../common/MyFormStorage';
import Panel from '../component/Panel';
import Button from '../component/Button';
import './MyFormPanel.css';

// “我的表单”面板
class MyFormPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 从localstorage读取暂存表单数据
            forms: tryGetForms()
        };
    }

    // 处理清除表单事件
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
            // 将表单列表转成li
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
                    {/* 清空按钮用于清除我的表单数据 */}
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