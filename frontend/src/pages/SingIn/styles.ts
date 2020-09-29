import styled, { keyframes } from 'styled-components';
import background from '../../assets/singIn.jpg';

const Container = styled.div`
    height: 100vh;
    display: flex;

    align-items: stretch;


`;


const Content = styled.div`
    
    width: 100%;
    max-width: 700px; 

    display: flex;
    flex-direction: column;
    place-content: center;
    align-items:center;
    justify-content: center;

`;


const appearFromLeft = keyframes`
    from{
        opacity: 0;
        transform: translateX(-50px);
    }
    to{
        opacity: 1;
        transform: translateX(0px);
    }
`

const Animation = styled.div`
    
    display: flex;
    flex-direction: column;
    place-content: center;
    align-items:center;
    justify-content: center;
    animation: ${appearFromLeft} 2s;

    form{
        /* display: grid; */
        margin: 80px 0;
        width: 340px;
        text-align: center;

        a{
            margin-top: 10px;
        }
    }

    h1{
        margin-bottom: 10px;
    }


    a{
        color: #fff;
        display: block;
        text-decoration: none;


        &:hover{
            color: #a25c00;
        }
    }

`

const Background = styled.div`
    flex: 1;
    background: url(${background}) no-repeat center;
    background-size: cover;
`;

export { Container, Content, Background, Animation }