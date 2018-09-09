import React from 'react';
import './TextItem.css';

class TextItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || ''
        };
    }

    handleChange = e => {
        const onChange = this.props.onChange;
        const value = e.target.value;
        this.setState({ value: value });
        if (onChange) {
            onChange(value);
        }
    };

    render() {
        const { element, disabled } = this.props;
        const InputType = element.multiLine ? 'textarea' : 'input';
        const inputProps = {
            id: element.elemKey,
            className: element.multiLine ? 'item-text-multi' : 'item-text-single',
            name: element.elemKey,
            placeholder: element.hint,
            onClick: e => e.stopPropagation(),
            value: this.state.value,
            onChange: this.handleChange,
            disabled: disabled
        }
        return (
            <React.Fragment>
                <span>{`${element.title}:`}</span>
                <InputType {...inputProps} />
            </React.Fragment>
        );
    }
}

export default TextItem;