import styled, { css } from 'styled-components';

import Tooltip from '../../Tooltip/index';

interface ContainerProps {
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #232129;
    border-radius: 10px;
    border: 2px solid #232129;
    padding: 16px;
    width: 100%;

    align-items: center;
    display: flex;
    color: #666368;

    input{
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;

        &::placeholder{
          color: #666368;

        }

        & + input{
            margin-top: 8px;
        }


    }
    

    & + div{
        margin-top: 10px;
    }

    ${props => props.isErrored && css`
        color:#ff2157;
        border-color: #ff2157;
    `}
    ${props => props.isFocused && css`
        color:#ff9000;
        border-color: #ff9000;
    `}

    ${props => props.isFilled && css`
        color:#ff9000;
    `}



    svg{
        margin-right: 16px;
    }

`

export const Error = styled(Tooltip)`
margin-left: 16px;
height: 20px;
    svg{
        margin-right: 0px;
    }
`;