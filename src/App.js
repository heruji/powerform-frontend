import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import FormBuilder from './FormBuilder/FormBuilder';
import SubmitSuccess from './FormBuilder/SubmitSuccess';
import FormDisplay from './FormDisplay/FormDisplay';
import FormResult from './FormResult/FormResult';
import Home from './Home/Home';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <Router basename="/powerform">
                <Switch>
                    {/* 主页 */}
                    <Route path="/" exact component={Home} />
                    {/* 表单构建器 */}
                    <Route path="/builder" exact component={FormBuilder} />
                    {/* 构建表单提交成功 */}
                    <Route path="/builder/submitSuccess" component={SubmitSuccess} />
                    {/* 表单反馈展示 */}
                    <Route path="/result/:id" component={FormResult} />
                    {/* 填表页面 */}
                    <Route path="/display/:id" component={FormDisplay} />
                    {/* 错误页面 */}
                    <Route component={() => (
                        <h1 style={{ margin: '0', lineHeight: '50vh', textAlign: 'center' }}>
                            ERROR
                        </h1>
                    )} />
                </Switch>
            </Router>
        );
    }
}

export default App;