import React from 'react';
import ReactDOM,{Route,Router,Switch} from 'react-dom';
import './index.css';
import Home from './components/Home';
import * as serviceWorker from './serviceWorker';
import History from './History';

ReactDOM.render(
<Router history={History}>
    <Switch>
        <Route exact path='/' component={Home}/>
    </Switch>

</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
