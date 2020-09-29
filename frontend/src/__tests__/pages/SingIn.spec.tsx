import React from 'react';
import { render } from '@testing-library/react';
import SingIn from '../../pages/SingIn';

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
        Link: ({ children }: { children: React.ReactNode }) => children,
    }
});

describe('SingIn pages', () => {
    it('Espera-se que seja possivel logar a aplicação', () => {

        const { debug } = render(<SingIn />);

        debug();
    })
})