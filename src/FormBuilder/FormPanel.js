import React from 'react';
import Panel from '../component/Panel';
import CornerButton from '../component/CornerButton'
import ItemTypeMapper from '../common/ItemTypeMapper';
import './FormPanel.css';

// 该面板展示表单制作效果预览
// props:
// formElements 表单元素列表
// selectedElemKey 当前选中表单项的key
// onRemove 表单项删除事件回调
// onClick 标单项点击事件回调
class FormPanel extends React.PureComponent {
    render() {
        const { formElements, selectedElemKey, onRemove, onClick } = this.props;
        // 将formElements中的元素映射为<li>
        const listItems = formElements.map((element, index) => {
            // 根据元素类型获得表单项组件
            const FormItem = ItemTypeMapper[element.type];
            // 选中后的样式
            const selected = selectedElemKey === element.elemKey ? 'selected' : '';
            return (
                <li key={element.elemKey}
                    className={`hoverable-corner-btn selectable ${selected}`}
                    onClick={() => onClick(element.elemKey)}
                >
                    <FormItem element={element} />
                    {index !== 0 && (
                        <CornerButton
                            type='close'
                            onClick={() => onRemove(element.elemKey)}
                        />)}
                </li>
            );
        });
        return (
            <Panel
                title="表单效果预览"
                type="main"
                fit={true}
                content={(<ol>{listItems}</ol>)}
                empty={formElements.length === 1}
                emptyHint="请点击左侧按钮添加表单项"
            />
        );
    }
}

export default FormPanel;