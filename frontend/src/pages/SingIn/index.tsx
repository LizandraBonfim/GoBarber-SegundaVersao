import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, Animation } from './styles';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';

import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/ToastContext';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import * as Yup from 'yup';

import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

interface SingInFormData {
    email: string;
    password: string;
}

function SingIn() {

    const formRef = useRef<FormHandles>(null);

    const { singIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();


    const handleSubmit = useCallback(async (data: SingInFormData) => {
        try {
            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatorio').email('Digite um email valido'),
                password: Yup.string().min(6, 'Minimo 6 digitos')
            });

            await schema.validate(data, {
                abortEarly: false
            });

            console.log('front email senha', data)

            await singIn({
                email: data.email,
                password: data.password
            });

            history.push('/dashboard');

        } catch (error) {

            if (error instanceof Yup.ValidationError) {

                const err = getValidationErrors(error);

                console.log(error);
                formRef.current?.setErrors(err);

                return;
            }

            //toast
            addToast({
                type: 'error',
                title: 'Erro na autenticacao',
                description: 'Favor verificar suas credenciais.'
            });

        }

    }, [singIn, addToast, history]);


    return (
        <Container>
            <Content>
                <Animation>

                    <img src={logo} alt="Logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faca seu logon</h1>

                        <Input type="email" icon={FiMail} placeholder="E-mail" name="email" />
                        <Input type="password" icon={FiLock} placeholder="Senha" name="password" />

                        <Button type="submit">Entrar</Button>

                        <Link to="forgot-password">Esqueci minha senha</Link>
                    </Form>

                    <Link to="/singup">
                        <FiLogIn />
                     Criar cadastro
                </Link>

                </Animation>

            </Content>

            <Background />
        </Container>
    )
}

export default SingIn;