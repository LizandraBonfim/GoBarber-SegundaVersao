import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, Animation } from './styles';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';

import { useToast } from '../../context/ToastContext';

import { FiLock, FiLogIn } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

import * as Yup from 'yup';

import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

function ResetPassword() {

    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();
    const history = useHistory();
    const location = useLocation();

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try {
            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                password: Yup.string().min(6, 'Minimo 6 digitos'),
                password_confirmation: Yup.string().oneOf(
                    [Yup.ref('password')],
                    'Confirmacao incorreta',
                ),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const { password, password_confirmation } = data;
            const token = location.search.replace('?token=', '');

            if (!token) {
                addToast({
                    type: 'error',
                    title: 'Erro na autenticacao',
                    description: 'Favor tente novamente.'
                });

                return;
            }

            await api.post('/password/reset', {
                password,
                password_confirmation,
                token

            });

            addToast({
                type: 'success',
                title: 'Senha alterada',
                description: 'Favor logar.'
            });

            history.push('/');

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
                title: 'Erro ao resetar a senha',
                description: 'Favor tente novamente.'
            });

        }

    }, [addToast, history, location.search]);


    return (
        <Container>
            <Content>
                <Animation>

                    <img src={logo} alt="Logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Reset de senha</h1>

                        <Input type="password" icon={FiLock} placeholder="Nova senha" name="password" />
                        <Input type="password" icon={FiLock} placeholder="Confirme a nova senha" name="password_confirmation" />

                        <Button type="submit">Alterar senha</Button>

                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Voltar para login
                    </Link>
                </Animation>

            </Content>

            <Background />
        </Container>
    )
}

export default ResetPassword;