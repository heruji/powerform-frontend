import React from 'react';
import { Redirect } from 'react-router-dom';
import HeaderPanel from '../component/HeaderPanel';
import Panel from '../component/Panel';
import Loading from '../component/Loading';
import Button from '../component/Button';
import Container from '../component/Container';
import ItemTypeMapper from '../common/ItemTypeMapper';
import Blocker from '../component/Blocker';
import './FormDisplay.css'

// 0 - 正在加载表单, 1 - 表单加载完成, 2 - 加载失败
const STATUS_LOADING = 0;
const STATUS_SUCCESS = 1;
const STATUS_LOAD_ERROR = 2;
// 3 - 正在提交, 4 - 提交成功, 5 - 提交失败
const STATUS_SUBMITTING = 3;
const STATUS_SUBMITTED = 4;
const STATUS_SUBMIT_ERROR = 5;

class FormDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STATUS_LOADING
        };
        this.result = [];
        this.formElements = [];
    }

    componentDidMount() {
        fetch(`http://api.heruji.me/powerform/form/${this.props.match.params.id}/element`, {
            method: 'get',
            mode: 'cors', // cors|no-cors|same-orgin
            credentials: 'same-origin', // same-orgin|omit|include
            cache: 'no-cache'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('failed to get form');
            })
            .then(this.handleFetchResult)
            .catch(() => this.setState({ status: STATUS_LOAD_ERROR }));
    }

    handleFetchResult = formElements => {
        this.formElements = formElements;
        this.setState({
            status: STATUS_SUCCESS,
        });
    };

    handleChange = (elemKey, value, isOption) => {
        const index = this.result.findIndex(item => item.elemKey === elemKey);
        const type = isOption ? 'optionIds' : 'value';
        if (index === -1) {
            this.result[this.result.length] = { elemKey: elemKey, [type]: value };
        } else {
            this.result[index][type] = value;
        }
        // console.debug(this.result);
    };

    handleSubmit = () => {
        if (this.result.length !== this.formElements
            .filter(elem => elem.type !== 'form' && elem.type !== 'sep').length) {
                
            alert('表单尚未填完');
            return;
        }
        this.setState({ status: STATUS_SUBMITTING });
        fetch(`http://api.heruji.me/powerform/form/${this.props.match.params.id}/result`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            mode: 'cors', // cors|no-cors|same-orgin
            credentials: 'same-origin', // same-orgin|omit|include
            cache: 'no-cache',
            body: JSON.stringify(this.result)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('failed to submit result');
                }
                alert('表单提交成功, 即将返回首页');
                this.setState({ status: STATUS_SUBMITTED });
            })
            .catch(() => {
                alert('提交表单失败, 请网站联系管理员');
                this.setState({ status: STATUS_SUBMIT_ERROR });
            });
    }

    renderList = () => {
        return (
            <ol>
                {this.formElements.map(element => {
                    const FormItem = ItemTypeMapper[element.type];
                    const elemKey = element.elemKey;
                    return (
                        <li key={elemKey}>
                            <FormItem
                                element={element}
                                onChange={(value) => this.handleChange(elemKey, value,
                                    element.type === 'option' || element.type === 'list')}
                            />
                        </li>
                    );
                })}
            </ol>
        );
    }

    render() {
        const { status } = this.state;
        let panelContent;
        let buttonContent = "提交";
        switch (status) {
            case STATUS_LOADING:
                panelContent = (
                    <div className="display-loading">
                        <Loading dark />
                    </div>
                );
                break;
            case STATUS_SUBMITTING:
                panelContent = this.renderList();
                buttonContent = (<Loading />);
                break;
            case STATUS_SUBMIT_ERROR:           // fall through
            case STATUS_SUCCESS:
                panelContent = this.renderList();
                break;
            case STATUS_SUBMITTED:
                return (<Redirect push to="/" />);
            default:
                return (<Redirect to="/error" />);
        }
        return (
            <React.Fragment>
                <HeaderPanel slim>
                    <Button
                        onClick={this.handleSubmit}
                        content={buttonContent}
                        fixedWidth={true}
                        disabled={status === STATUS_LOADING || status === STATUS_SUBMITTING}
                    />
                </HeaderPanel>
                <Container type="single">
                    <Panel
                        type="main"
                        fit={true}
                        content={panelContent}
                    />
                </Container>
                {status === STATUS_SUBMITTING && <Blocker />}
            </React.Fragment>
        );
    }
}

export default FormDisplay;