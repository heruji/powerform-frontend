import React from 'react';
import update from 'immutability-helper';
import shortid from 'shortid';

import PropertyInput from './PropertyInput';
import OptionInputList from './OptionInputList';

import Panel from '../component/Panel';
import Separator from '../component/Separator';

// 该面板用于更新表单元素的各项属性
// props:
// element 当前选中的表单元素
// onChange 修改表单元素事件回调
class PropertyPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChangeProperty = this.handleChangeProperty.bind(this);
        this.handleChangeOption = this.handleChangeOption.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        // 为PropertyInput绑定回调函数
        // TODO: 须随renderContent方法修改
        this.onChangeTitle = value => this.handleChangeProperty('title', value);
        this.onChangeHint = value => this.handleChangeProperty('hint', value);
    }

    // 根据元素的类型渲染Panel中的内容
    // TODO: 须进一步拆分
    renderContent(element) {
        switch (element && element.type) {
            // form和text类型一致
            case 'form':
            case 'text':
                return (
                    <ul>
                        <li>
                            <PropertyInput
                                title="标题"
                                value={element.title}
                                onChange={this.onChangeTitle}
                            />
                        </li>
                        <li>
                            <PropertyInput
                                title="提示文字"
                                value={element.hint}
                                onChange={this.onChangeHint}
                            />
                        </li>
                    </ul>
                );
            // option和list类型一致
            case 'option':
            case 'list':
                return (
                    <React.Fragment>
                        <ul>
                            <li>
                                <PropertyInput
                                    title="标题"
                                    value={element.title}
                                    onChange={this.onChangeTitle}
                                />
                            </li>
                        </ul>
                        <Separator />
                        <OptionInputList
                            options={element.options}
                            onAdd={this.handleAddOption}
                            onChange={this.handleChangeOption}
                            onRemove={this.handleRemoveOption}
                        />
                    </React.Fragment>
                );
            default:
                return null;
        }
    }

    // 修改表单元素属性
    handleChangeProperty(targetProp, value) {
        const { element, onChange } = this.props;
        onChange(update(element, { [targetProp]: { $set: value } }));
    }

    // 修改表单元素的选项列表中的某个选项
    handleChangeOption(index, value) {
        const { element, onChange } = this.props;
        onChange(update(element, { options: { [index]: { title: { $set: value } } } }));
    }

    // 从表单元素的选项列表移除选项
    handleRemoveOption = index => {
        const { element, onChange } = this.props;
        onChange(update(element, { options: { $splice: [[index, 1]] } }));
    };

    // 向表单元素的选项列表添加选项
    handleAddOption() {
        const { element, onChange } = this.props;
        onChange(update(element, {
            options: { $push: [{ id: shortid.generate(), title: '新建选项' }] }
        }));
    }

    render() {
        const { element } = this.props;
        return (
            <Panel
                title="表单项属性"
                type="aside"
                content={this.renderContent(element)}
                emptyHint="未选中表单项"
            />
        );
    }
}

export default PropertyPanel;