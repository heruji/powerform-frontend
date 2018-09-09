import React from 'react';
import Container from '../component/Container';
import HeaderPanel from '../component/HeaderPanel';
import Panel from '../component/Panel';
import { Link, Redirect } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './SubmitSuccess.css';

const URL_PREFIX = 'http://demo.heruji.me/powerform';

function SubmitSuccess(props) {
    if (!props.location.state || !props.location.state.form) {
        return (<Redirect to="/error" />);
    }
    const { form } = props.location.state;
    const resultUrl = `/result/${form.id}`;
    const displayUrl = `/display/${form.id}`;
    const fullUrl = `${URL_PREFIX}${displayUrl}`;
    const content = (
        <div className="submit-success">
            <p>
                您的表单已经成功提交到服务器,&nbsp;&nbsp;
                <Link to={resultUrl}>点此</Link>
                &nbsp;可查看该表单提交情况;
            </p>
            <p>您也可以稍后通过“我的表单”模块查看所有表单提交详情。</p>
            <hr />
            <p>请将以下链接发送给需要填写表单的人员</p>
            <p>
                URL地址:<br />
                <Link to={displayUrl}>{fullUrl}</Link>
            </p>
            <hr />
            <p>也可以通过以下二维码进入填表页面：</p>
            <QRCode value={fullUrl} />
        </div>
    );
    return (
        <React.Fragment>
            <HeaderPanel />
            <Container type="default">
                <Panel
                    title="表单提交成功!"
                    type="default"
                    content={content}
                />
                <Panel
                    title="我的表单"
                    type="aside"
                    content={null}
                />
            </Container>
        </React.Fragment>
    );
}

export default SubmitSuccess;