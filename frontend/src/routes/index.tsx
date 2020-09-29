import { Switch } from 'react-router-dom';
import React from 'react';
import Route from './Router';

import SingIn from '../pages/SingIn';
import SingUP from '../pages/SingUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Router: React.FC = () => {
    return (
        <Switch>
            <Route path="/" exact component={SingIn} />
            <Route path="/singup" component={SingUP} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />

            <Route path="/profile" component={Profile} isPrivate />
            <Route path="/dashboard" component={Dashboard} isPrivate />
        </Switch>
    )
}

export default Router;