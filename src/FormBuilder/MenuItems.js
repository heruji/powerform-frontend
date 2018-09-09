// 默认选择项
const DEFAULT_OPTIONS = [
    { id: 'o-1', title: '新建选项' },
    { id: 'o-2', title: '新建选项' },
    { id: 'o-3', title: '新建选项' }
];

// 默认标题
const DEFAULT_TITLE = '新建表单项';

// 默认提示信息
const DEFAULT_HINT = '提示信息可修改';

// 默认菜单栏选项
const MenuItems = [{
    id: 'm-1',
    title: '单行文本框',
    elemProps: { title: DEFAULT_TITLE, hint: DEFAULT_HINT, type: 'text', multiLine: false }
}, {
    id: 'm-2',
    title: '多行文本框',
    elemProps: { title: DEFAULT_TITLE, hint: DEFAULT_HINT, type: 'text', multiLine: true }
}, {
    id: 'm-3',
    title: '单选控件',
    elemProps: {
        title: DEFAULT_TITLE,
        type: 'option',
        singleSelect: true,
        options: DEFAULT_OPTIONS
    }
}, {
    id: 'm-4',
    title: '多选控件',
    elemProps: {
        title: DEFAULT_TITLE,
        type: 'option',
        singleSelect: false,
        options: DEFAULT_OPTIONS
    }
}, {
    id: 'm-5',
    title: '下拉框',
    elemProps: {
        title: DEFAULT_TITLE,
        type: 'list',
        options: DEFAULT_OPTIONS
    }
}, {
    id: 'm-6',
    title: '分隔线',
    elemProps: { type: 'sep' }
}];

export default MenuItems;