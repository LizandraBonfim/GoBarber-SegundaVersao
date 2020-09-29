import React from 'react';
import {
    Route as ReactDOMRouter,
    RouteProps as ReactDOMRouterProps,
    Redirect
} from 'react-router-dom';

import { useAuth } from '../context/authContext';

interface RouteProps extends ReactDOMRouterProps {
    isPrivate?: boolean;
    component: React.ComponentType;
}

const Router: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {

    const { user } = useAuth();

    return (

        <ReactDOMRouter
            {...rest}
            render={({location}) => {
                return isPrivate === !!user
                    ? (<Component />)
                    : (<Redirect to={{
                        pathname: isPrivate ? '/' : '/dashboard',
                        state: { from: location }
                    }} /> );
            }}
        />
    )
}

export default Router;