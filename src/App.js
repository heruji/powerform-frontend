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
                    <Route path="/" exact component={Home} />
                    <Route path="/builder" exact component={FormBuilder} />
                    <Route path="/builder/submitSuccess" component={SubmitSuccess} />
                    <Route path="/result/:id" component={FormResult} />
                    <Route path="/display/:id" component={FormDisplay} />
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