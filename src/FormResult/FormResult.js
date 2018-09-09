import React from 'react';
import { Redirect } from 'react-router-dom';
import QRCode from 'qrcode.react';
import HeaderPanel from '../component/HeaderPanel';
import Container from '../component/Container';
import Panel from '../component/Panel';
import Loading from '../component/Loading';
import Tooltip from '../component/Tooltip';
import CopyButton from '../component/CopyButton';
import ItemTypeMapper from '../common/ItemTypeMapper';
import './FormResult.css';

const STATUS = Object.freeze({
    LOADING: 0,
    SUCCESS: 1,
    ERROR: 2
});

class FormResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STATUS.LOADING,
            selected: null
        };
    }

    componentDidMount() {
        const init = {
            method: 'get',
            mode: 'cors', // cors|no-cors|same-orgin
            credentials: 'same-origin', // same-orgin|omit|include
            cache: 'no-cache'
        };
        const processResponse = response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('failed to get result');
        };

        fetch(`http://api.heruji.me/powerform/form/${this.props.match.params.id}/result`, init)
            .then(processResponse)
            .then(this.handleFetchResult)
            .catch(this.handleError);

        fetch(`http://api.heruji.me/powerform/form/${this.props.match.params.id}/element`, init)
            .then(processResponse)
            .then(this.handleFetchElement)
            .catch(this.handleError);
    }

    handleFetchResult = formResults => {
        if (this.state.status === STATUS.ERROR) {
            return;
        }
        this.formResults = formResults;
        if (this.formElements) {
            this.setState({
                status: STATUS.SUCCESS,
            });
        }
    };

    handleFetchElement = formElements => {
        if (this.state.status === STATUS.ERROR) {
            return;
        }
        this.formElements = formElements;
        if (this.formResults) {
            this.setState({
                status: STATUS.SUCCESS,
            });
        }
    };

    handleError = () => {
        if (this.state.status === STATUS.ERROR) {
            return;
        }
        this.setState({ status: STATUS.ERROR })
    };

    handleSelect = (index) => {
        this.setState({
            selected: index
        });
    };

    renderResultList = () => {
        if (this.formResults.length === 0) {
            return null;
        }
        return (
            <ul>
                {this.formResults.map((result, index) => {
                    return (
                        <li key={index}
                            onClick={() => this.handleSelect(index)}
                            style={index === this.state.selected ? {
                                backgroundColor: '#eee'
                            } : undefined}
                        >
                            <span style={{
                                display: 'inline-block', paddingLeft: '5%', width: '20%',
                                fontFamily: 'monospace'
                            }}>
                                {`# ${index + 1}`}
                            </span>
                            <span style={{
                                display: 'inline-block', paddingLeft: '5%',
                                fontFamily: 'monospace'
                            }}>
                                {result.createTime}
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderForm = () => {
        const { selected } = this.state;
        if (selected === null) {
            return null;
        }
        const result = this.formResults[selected];
        return (
            <ol style={{ padding: '0 15%' }}>
                {this.formElements.map(element => {
                    const FormItem = ItemTypeMapper[element.type];
                    const elemKey = element.elemKey;
                    const type = element.type === 'text' ? 'value' : 'optionIds';
                    const elemResult = result.elementResults.find(e => e.elemKey === elemKey);
                    return (
                        <li key={elemKey + selected}>
                            <FormItem
                                element={element}
                                defaultValue={elemResult && elemResult[type]}
                                disabled
                            />
                        </li>
                    );
                })}
            </ol>
        );
    };

    render() {
        const { status } = this.state;
        if (status === STATUS.ERROR) {
            return (<Redirect to="/error" />);
        }
        const resultPanelContent = status === STATUS.LOADING ? (
            <div style={{ marginTop: '45%' }}>
                <Loading dark />
            </div>
        ) : this.renderResultList();
        const url = `http://demo.heruji.me/powerform/display/${this.props.match.params.id}`;
        return (
            <React.Fragment>
                <HeaderPanel>
                    <Tooltip
                        content={<QRCode value={url} />}
                        display={<QRCode size={35} value="display" />}
                    />
                    <CopyButton copyText={url} />
                    <a className="export-btn-link" 
                        href={`http://api.heruji.me/powerform/form/${this.props.match.params.id}/result/xlsx`}>
                        导出 XLSX
                    </a>
                </HeaderPanel>
                <Container type="double">
                    <Panel
                        title="反馈列表"
                        fit={true}
                        type="menu"
                        content={resultPanelContent}
                        emptyHint="暂无记录"
                    />
                    <Panel
                        title="反馈详情"
                        fit={true}
                        type="main"
                        content={this.renderForm()}
                        emptyHint="请点击左侧反馈信息"
                    />
                </Container>
            </React.Fragment>
        );
    }
}

export default FormResult;