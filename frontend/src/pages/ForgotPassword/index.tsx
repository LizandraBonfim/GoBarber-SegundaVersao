import React, { useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';

import { useToast } from '../../context/ToastContext';

import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background, Animation } from './styles';
import logo from '../../assets/logo.svg';

import Button from '../../components/Button/index';
import Input from '../../components/Input/index';

interface ForgotPasswordData {
    email: string;
}


function ForgotPassword() {

    const formRef = useRef<FormHandles>(null);

    const [loading, setLoading] = useState(false);

    const { addToast } = useToast();

    // const history = useHistory();

    const handleSubmit = useCallback(async (data: ForgotPasswordData) => {
        try {

            setLoading(true);
            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatorio').email('Digite um email valido'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            //recuperacao de senha
            await api.post('/password/forgot', {
                email: data.email
            });

            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description: 'Favor verificar seu e-mail'
            });

            // history.push('/');

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
                title: 'Erro ao atualizar cadastro',
                description: 'Favor, tente mais tarde.'
            });

        } finally {
            setLoading(false);
        }

    }, [addToast])

    return (
        <Container>

            <Background />

            <Content>
                <Animation>

                    <img src={logo} alt="Logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperação de senha</h1>

                        <Input type="email" icon={FiMail} placeholder="E-mail" name="email" />


                        <Button loading={loading} type="submit">Recuperar</Button>


                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                     Voltar para logon
                </Link>

                </Animation>
            </Content>

        </Container>
    )
}

export default ForgotPassword;