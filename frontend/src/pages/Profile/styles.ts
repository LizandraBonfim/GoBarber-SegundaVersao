import styled from 'styled-components';

const Container = styled.div`
   
    > header{
        height: 174px;
        background: #28262e;
        display: flex;
        align-items: center;

        div{
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;

            svg{
                color: #fff;
                height: 24px;
                width: 24px;
            }
        }
    }


`;

const AvatarInput = styled.figure`

    margin-bottom: 30px;
    position: relative;
    width: 186px;
    align-self: center;


    img{
        width: 186px;
        height: 186px;
        border-radius: 50%;
    }

    label{
        position: absolute;
        width: 48px;
        height: 48px;
        background: #ff9000;
        border: 0;
        border-radius: 50%;
        right: 0;
        bottom: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        :hover{
            background: #a25c00;
            cursor: pointer;
        }

        svg{
            width: 20px;
            height: 20px;
            color: #312e38;

        }

        input{
            display: none;
        }
    }
`;


const Content = styled.div`
    display: flex;
    flex-direction: column;
    place-content: center;
    align-items:center;
    margin: -174px auto 0;
    width: 100%;
    max-width: 700px;

    form{
        /* display: grid; */
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        width: 340px;
        text-align: center;

      
    }

    h1{
        margin-bottom: 10px;
        font-size: 18px;
        text-align: initial;
    }


    a{
        color: #fff;
        display: block;
        text-decoration: none;


        &:hover{
            color: #a25c00;
        }
    }

    form > div:nth-child(5) {
        margin-top: 24px;
    }


`;


   
export { Container, Content, AvatarInput }