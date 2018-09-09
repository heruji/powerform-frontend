import React from 'react';
import CornerButton from '../component/CornerButton';
import PropertyInput from './PropertyInput';
import './OptionInputList.css';

// 用于修改表单元素的选项列表
// props:
// options 表单元素的选项列表
// onChange 选项修改事件回调
// onRemove 删除选项事件回调
// onAdd 添加选项事件回调
class OptionInputList extends React.PureComponent {
    render() {
        const { options, onChange, onRemove, onAdd } = this.props;
        // 将表单元素的选项列表映射为<li>
        const listItems = options.map((option, index) => {
            return (
                <li key={option.id} className="hoverable-corner-btn">
                    <PropertyInput
                        value={option.title}
                        onChange={value => onChange(index, value)}
                    />
                    <CornerButton type="close" onClick={() => onRemove(index)} />
                </li>
            );
        });
        return (
            <div className="option-input-list">
                <span>选 项:</span>
                <ol>{listItems}</ol>
                <CornerButton type="add" onClick={onAdd} />
            </div>
        );
    }
}

export default OptionInputList;