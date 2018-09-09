import React from 'react';
import './SelectItem.css';

class SelectItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: (props.defaultValue && props.defaultValue[0]) || ''
        };
    };

    handleChange = e => {
        const onChange = this.props.onChange;
        const value = e.target.value;
        this.setState({ value: value });
        if (onChange) {
            onChange([value]);
        }
    };

    render() {
        const { element } = this.props;
        const optionList = element.options.map(option => {
            return (
                <option key={option.id} value={option.id}>
                    {option.title}
                </option>
            );
        });
        return (
            <React.Fragment>
                <span>{`${element.title}:`}</span>
                <select
                    name={element.elemKey}
                    className="item-select"
                    onClick={e => e.stopPropagation()}
                    value={this.state.value}
                    onChange={this.handleChange}
                    disabled={this.props.disabled}
                >
                    <option value="" />
                    {optionList}
                </select>
            </React.Fragment>
        );
    }
}

export default SelectItem;