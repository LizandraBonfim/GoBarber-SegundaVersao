import React from 'react';

import { AuthProvider } from './authContext';
import { ToastProvider } from './ToastContext';

const AppProvider: React.FC = ({ children }) => (

    <AuthProvider>
        <ToastProvider>
            {children}
        </ToastProvider>
    </AuthProvider>
)

export default AppProvider;