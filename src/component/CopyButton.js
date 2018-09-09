import React from 'react';
import Button from './Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './CopyButton.css';

class CopyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        };
    }

    handleCopy = () => {
        clearTimeout(this.timer);
        this.setState({
            copied: true
        });
        this.timer = setTimeout(() => this.setState({ copied: false }), 1000);
    };

    render() {
        const { copyText } = this.props;
        const { copied } = this.state;
        return (
            <CopyToClipboard text={copyText} onCopy={this.handleCopy}>
                <Button
                    content={copied ? '复制完成' : '复制链接'}
                    type={copied ? 'success' : 'default'}
                />
            </CopyToClipboard>
        );
    }
}

export default CopyButton;