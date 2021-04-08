import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import AuthContexts from '../contexts/AuthContexts';

const PrivateRoute = ({path, component}) => {
    const {isAuthenticated } = useContext(AuthContexts);
    return isAuthenticated ? <Route path={path} component={component} /> : <Redirect to="/login" />
}

export default PrivateRoute;