import React from 'react';
import Panel from '../component/Panel';

// 菜单面板, 点击其中元素创建表单项
// props:
// items: 菜单项元素列表
// onClick 菜单项点击事件回调
class ItemPanel extends React.PureComponent {
    render() {
        const { items, onClick } = this.props;
        const listItems = items.map(item => {
            return (
                <li key={item.id}
                    onClick={() => {onClick(Object.assign({}, item.elemProps))}}
                >
                    {item.title}
                </li>
            );
        });
        return (
            <Panel
                title="表单项"
                type="menu"
                content={(<ul>{listItems}</ul>)}
            />
        );
    }
}

export default ItemPanel;