import React from 'react';
import update from 'immutability-helper';
import shortid from 'shortid';
import { Redirect } from 'react-router-dom/';

import Container from '../component/Container';
import SubmitButton from '../component/SubmitButton';
import HeaderPanel from '../component/HeaderPanel';
import Button from '../component/Button';
import Blocker from '../component/Blocker';
import postFormData from '../common/postFormData';

import MenuItems from './MenuItems';
import ItemPanel from './ItemPanel';
import FormPanel from './FormPanel';
import PropertyPanel from './PropertyPanel';

// 提交状态: 0 - 默认, 1 - 提交中, 2 - 提交成功
const STATUS_DEFAULT = 0;
const STATUS_LOADING = 1;
const STATUS_SUCCESS = 2;

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

// 构建表单的页面
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
            status: STATUS_DEFAULT
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
        if (formElements.length === 1) {
            alert('尚未添加标单项');
            return;
        }
        postFormData(SUBMIT_URL, formElements, this.handleSubmitResult,
            () => {
                alert('表单提交失败');
                this.setState({
                    status: STATUS_DEFAULT
                });
            }
        );
        this.setState({
            status: STATUS_LOADING
        });
    };

    // 处理提交成功后返回的表单数据
    handleSubmitResult = form => {
        this.form = form;
        try {
            localStorage.removeItem(STORE_KEY);
        } catch (e) { }
        this.setState({
            status: STATUS_SUCCESS
        });
    };

    // 处理表单重置
    handleReset = () => {
        if (window.confirm('您确定要重置吗?')) {
            try {
                localStorage.removeItem(STORE_KEY);
            } catch (e) { }
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
    }

    // 尝试保存表单元素集合
    tryStoreFormElements = formElements => {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(formElements));
        } catch (e) { }
    }

    // ========================================================================

    render() {
        const { formElements, selectedElemKey, status } = this.state;
        // 表单数据提交成功, 则跳转成功页面
        if (status === STATUS_SUCCESS) {
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
                        disabled={status === STATUS_LOADING}
                    />
                    <SubmitButton
                        onSubmit={this.handleSubmit}
                        isLoading={status === STATUS_LOADING}
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
                {status === STATUS_LOADING && (<Blocker />)}
            </React.Fragment>
        );
    }
}

export default FormBuilder;