import React from 'react';
import shortid from 'shortid';
import './PropertyInput.css'

// 用于修改表单元素属性值的输入组件
// props:
// title 输入框的标题, 用于label
// value 输入框的值
// onChange 输入框的值发生修改的回调
class PropertyInput extends React.PureComponent {
    constructor(props) {
        super(props);
        // this.id赋值给textarea页面元素的id属性, 主要用于label的for属性
        this.id = shortid.generate();
    }

    render() {
        const { title, value, onChange } = this.props;
        return (
            <React.Fragment>
                {/* 若title没有值, 则不显示label */}
                {title && (
                    <label htmlFor={this.id}>
                        {`${title}:`}
                    </label>
                )}
                <textarea
                    id={this.id}
                    className="property-input"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </React.Fragment>
        );
    }
}

export default PropertyInput;