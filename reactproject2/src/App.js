import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { Login } from './modules/Login';
import { List } from './modules/List';
import {Templates} from './modules/Templates'
import { PrivateRoute } from './routes';

const App = () => (
     <MuiThemeProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <PrivateRoute path="/list" component={List} />
          <Route path="/login" render={(props) => <Login {...props}/>} />
          <PrivateRoute path="/template" component={Templates} />
        </Switch>
      </Router>
     </MuiThemeProvider> );
export default App;
