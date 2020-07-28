import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  if (localStorage.getItem('loginToken')) {
    return (
      <Route
        {...rest}
        render={matchProps => (
            <Component {...matchProps} />
        )}
      />
    );
  }
  return <Redirect to="/login" />;
};
PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
