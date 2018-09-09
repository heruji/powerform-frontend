import React from 'react';
import update from 'immutability-helper';
import shortid from 'shortid';
import { Redirect } from 'react-router-dom/';
import Container from '../component/Container';
import HeaderPanel from '../component/HeaderPanel';
import Button from '../component/Button';
import Blocker from '../component/Blocker';
import Loading from '../component/Loading';
import postFormData from '../common/postFormData';
import MenuItems from './MenuItems';
import ItemPanel from './ItemPanel';
import FormPanel from './FormPanel';
import PropertyPanel from './PropertyPanel';

// 提交状态: 0 - 默认, 1 - 提交中, 2 - 提交成功
const STATUS = Object.freeze({
    DEFAULT: 0,
    LOADING: 1,
    SUCCESS: 2
});

// 本地存储表单元素集合的key
const STORE_KEY = 'form_elements';

// 提交地址
const SUBMIT_URL = 'http://api.heruji.me/powerform/form';
// 提交成功跳转地址
const SUCCESS_URL = '/builder/submitSuccess';

// 默认表单标题元素
const DEFAULT_FORM_TITLE = {
    elemKey: 'f-0',
    title: '表单标题',
    hint: '在此书写表单信息\n例如: 填表说明、活动描述、报名须知、等等',
    type: 'form'
};

// 表单构建器
class FormBuilder extends React.Component {
    constructor(props) {
        super(props);
        // 尝试从localstorage中读取表单元素集合, 若未读到, 使用默认值
        let formElements;
        try {
            const stored = localStorage.getItem(STORE_KEY);
            formElements = stored ? JSON.parse(stored) : [DEFAULT_FORM_TITLE];
        } catch (e) {
            formElements = [DEFAULT_FORM_TITLE]
        }
        // 设置初始状态
        this.state = {
            // 表单元素集合
            formElements: formElements,
            // 当前选中的表单项的key
            selectedElemKey: null,
            // 提交状态
            status: STATUS.DEFAULT
        };
    }

    // ===============================事件处理===============================

    // 新增表单元素
    handleAdd = newElem => {
        newElem.elemKey = shortid.generate();
        const { formElements, selectedElemKey } = this.state;
        const insertIndex = this.findIndexByElemKey(selectedElemKey) + 1;
        const newList = update(formElements, { $splice: [[insertIndex, 0, newElem]] });
        this.tryStoreFormElements(newList);
        this.setState({
            formElements: newList,
            selectedElemKey: newElem.elemKey
        });
    };

    // 删除表单元素
    handleRemove = elemKey => {
        const { formElements, selectedElemKey } = this.state;
        const index = this.findIndexByElemKey(elemKey);
        const newList = update(formElements, { $splice: [[index, 1]] });
        this.tryStoreFormElements(newList);
        let newState = {
            formElements: newList
        };
        if (selectedElemKey === elemKey) {
            newState.selectedElemKey = null
        };
        this.setState(newState);
    };

    // 切换表单项的选中状态
    handleToggleSelect = elemKey => {
        this.setState(prevState => ({
            selectedElemKey: prevState.selectedElemKey === elemKey ? null : elemKey
        }));
    };

    // 更新表单元素
    handleChangeElement = newElem => {
        const { formElements } = this.state;
        const index = this.findIndexByElemKey(newElem.elemKey);
        const newList = update(formElements, { [index]: { $set: newElem } });
        this.tryStoreFormElements(newList);
        this.setState({
            formElements: newList
        });
    };

    // 表单提交
    handleSubmit = () => {
        const { formElements } = this.state;
        // 如果元素列表中没有除表头和分割线以外的其他元素, 则表示表单是空的, 不提交
        const reducer = (acc, curr) => acc + !['form', 'sep'].includes(curr.type);
        if (formElements.reduce(reducer, 0) === 0) {
            alert('尚未添加表单项');
            return;
        }
        // 向 SUBMIT_URL 提交当前的表单元素集合
        postFormData(SUBMIT_URL, formElements, this.handleSubmitResult,
            () => {
                alert('表单提交失败, 请稍后重试');
                this.setState({
                    status: STATUS.DEFAULT
                });
            }
        );
        // 修改状态为 "正在提交"
        this.setState({
            status: STATUS.LOADING
        });
    };

    // 处理提交成功后返回的表单数据
    handleSubmitResult = form => {
        this.form = form;
        // 提交成功后删除暂存的表单元素集合
        this.tryRemoveFormElements();
        // 修改状态为 "提交成功"
        this.setState({
            status: STATUS.SUCCESS
        });
    };

    // 处理表单重置
    handleReset = () => {
        if (window.confirm('您确定要重置吗?')) {
            this.tryRemoveFormElements();
            this.setState({
                formElements: [DEFAULT_FORM_TITLE],
                selectedElemKey: null
            });
        }
    };

    // ========================================================================

    // 根据key查找元素索引
    findIndexByElemKey = elemKey => {
        const formElements = this.state.formElements;
        const index = formElements.findIndex(elem => elem.elemKey === elemKey);
        return index === -1 ? formElements.length : index;
    };

    // 根据key查找元素
    findElementByElemKey = elemKey => {
        return this.state.formElements.find(elem => elem.elemKey === elemKey);
    };

    // 尝试保存表单元素集合
    tryStoreFormElements = formElements => {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(formElements));
        } catch (e) { }
    };

    tryRemoveFormElements = () => {
        try {
            localStorage.removeItem(STORE_KEY);
        } catch (e) { }
    };

    // ========================================================================

    render() {
        const { formElements, selectedElemKey, status } = this.state;
        // 表单数据提交成功, 则跳转成功页面
        if (status === STATUS.SUCCESS) {
            return (
                <Redirect push to={{
                    pathname: SUCCESS_URL,
                    state: { form: this.form }
                }} />
            );
        }
        // 渲染页面
        return (
            <React.Fragment>
                <HeaderPanel>
                    <Button
                        onClick={this.handleReset}
                        content="重置"
                        disabled={status === STATUS.LOADING}
                    />
                    <Button
                        onClick={this.handleSubmit}
                        content={status === STATUS.LOADING ? (<Loading />) : '提交'}
                        disabled={status === STATUS.LOADING}
                        fixedWidth={true}
                    />
                </HeaderPanel>
                <Container type="grid">
                    <ItemPanel
                        items={MenuItems}
                        onClick={this.handleAdd}
                    />
                    <FormPanel
                        formElements={formElements}
                        selectedElemKey={selectedElemKey}
                        onRemove={this.handleRemove}
                        onClick={this.handleToggleSelect}
                    />
                    <PropertyPanel
                        element={this.findElementByElemKey(selectedElemKey)}
                        onChange={this.handleChangeElement}
                    />
                </Container>
                {status === STATUS.LOADING && (<Blocker />)}
            </React.Fragment>
        );
    }
}

export default FormBuilder;