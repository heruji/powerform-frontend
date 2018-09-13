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

// 表单反馈加载状态
const STATUS = Object.freeze({
    LOADING: 0, // 正在加载
    SUCCESS: 1, // 加载成功
    ERROR: 2 // 加载失败
});

// 展示表单反馈信息
class FormResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STATUS.LOADING,
            selected: null
        };
    }

    // 页面渲染后加载数据
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

    // 处理fetch返回数据
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

    // 处理fetch返回数据
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

    // 处理加载失败
    handleError = () => {
        if (this.state.status === STATUS.ERROR) {
            return;
        }
        this.setState({ status: STATUS.ERROR })
    };

    // 处理选择反馈事件
    handleSelect = (index) => {
        this.setState({
            selected: index
        });
    };

    // 渲染反馈列表
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

    // 渲染反馈表单
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
        // 加载失败跳转错误页面
        if (status === STATUS.ERROR) {
            return (<Redirect to="/error" />);
        }
        // 是否显示正在加载
        const resultPanelContent = status === STATUS.LOADING ? (
            <div style={{ marginTop: '45%' }}>
                <Loading dark />
            </div>
        ) : this.renderResultList();
        // 当前表单填写链接, 用于分享
        const url = `http://demo.heruji.me/powerform/display/${this.props.match.params.id}`;
        return (
            <React.Fragment>
                <HeaderPanel>
                    <Tooltip
                        content={<QRCode value={url} />}
                        display={<QRCode size={35} value="display" />}
                    />
                    <CopyButton copyText={url} />
                    {/* 导出表单链接 */}
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