import React from 'react';
import HeaderPanel from '../component/HeaderPanel';
import Container from '../component/Container';
import Panel from '../component/Panel';
import { Link } from 'react-router-dom';
import './Home.css';
import MyFormPanel from './MyFormPanel';

class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                <HeaderPanel />
                <Container>
                    <Panel
                        title="主页"
                        content={
                            <div className="home">
                                <h1>欢迎使用 PowerForm 在线表单制作</h1>
                                <hr />
                                <p>
                                    PowerForm 是一个在线表单制作工具，
                                    通过该工具可以快速完成一些简单的信息收集工作，
                                    如活动报名、意见反馈、信息登记等等
                                </p>
                                <p>主要功能：</p>
                                <ul>
                                    <li>使用内置控件制作表单</li>
                                    <li>通过链接或二维码发布表单</li>
                                    <li>在线查看表单反馈结果</li>
                                </ul>
                                <hr />
                                <Link className="home-btn-link" to="/builder">
                                    开始制作表单
                                </Link>
                            </div>
                        }
                    />
                    <MyFormPanel />
                </Container>
            </React.Fragment>
        );
    }
}

export default Home;