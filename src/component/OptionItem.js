import React from 'react';
import update from 'immutability-helper';
import './OptionItem.css';

class OptionItem extends React.Component {
    constructor(props) {
        super(props);
        let value;
        if (props.defaultValue && props.defaultValue.length !== 0) {
            value = props.element.singleSelect ? props.defaultValue[0] : props.defaultValue;
        } else {
            value = props.element.singleSelect ? '' : [];
        }
        this.state = {
            value: value
        };
    };

    handleChange = e => {
        const { element, onChange } = this.props;
        const value = e.target.value;
        if (element.singleSelect) {
            this.setState({ value: value });
            onChange && onChange([value]);
        } else {
            const prevValueList = this.state.value;
            const newValueList = e.target.checked ?
                update(prevValueList, { $push: [value] }) :
                update(prevValueList, { $splice: [[prevValueList.indexOf(value), 1]] });
            this.setState({ value: newValueList });
            onChange && onChange(newValueList);
        }
    };

    isChecked = optionId => {
        const { value } = this.state;
        if (this.props.singleSelect) {
            return value === optionId;
        } else {
            return value.indexOf(optionId) !== -1;
        }
    };

    render() {
        const { element, disabled } = this.props;
        const listItems = element.options.map(option => {
            const inputId = '' + element.elemKey + option.id;
            const type = element.singleSelect ? 'radio' : 'checkbox';
            return (
                <li key={option.id} className="item-option">
                    <input
                        id={inputId}
                        name={element.elemKey}
                        type={type}
                        value={option.id}
                        onClick={e => e.stopPropagation()}
                        onChange={this.handleChange}
                        checked={this.isChecked(option.id)}
                        disabled={disabled}
                    />
                    <label htmlFor={inputId} onClick={e => e.stopPropagation()}>
                        {option.title}
                    </label>
                </li>
            );
        });
        return (
            <React.Fragment>
                <span>{`${element.title}:`}</span>
                <ol className="item-option-list">{listItems}</ol>
            </React.Fragment>
        );
    }
}

export default OptionItem;