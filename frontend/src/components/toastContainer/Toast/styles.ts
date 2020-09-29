import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
    type?: 'info' | 'success' | 'error';
    hasDescription: number;
}

const toastTypeVariable = {
    info: css`
    background: #ebf8ff;
    color: #3178b7;

    `,

    success: css`
    background: #e6ffaa;
    color: #2e656a;
    `,

    error: css`
    background: #fddede;
    color: #e53030;
`,

}

export const Container = styled(animated.div) <ToastProps>`
    width: 360px;
    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius: 10px;
    box-shadow: 2px 2px 2px 8px rgba(0,0,0,0.2);

    display: flex;

    ${(props) => toastTypeVariable[props.type || 'info']}

   
    > svg{
        margin: 4px 12px 0 0;
    }

    div{
        flex: 1;  
        
        p{
            margin-top: 4px;
            font-size: 12px;
            opacity: 0.8;
            line-height:20px;
        }

    }

    +div{
        margin-top: 10px;
    }

    button{
        background: transparent;
        position: absolute;
        top: 15px;
        right: 8px;
        border: 0;
        color:inherit;
    }
    ${(props) => !props.hasDescription && css`
        svg{
            margin-top: 0;

        }
    `}


`;