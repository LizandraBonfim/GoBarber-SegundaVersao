import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
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

interface SingUpData {
    name: string;
    email: string;
    password: string;
}


function SingUp() {

    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const history = useHistory();

    const handleSubmit = useCallback(async (data: SingUpData) => {
        try {
            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                name: Yup.string().required('Nome e obrigatorio'),
                email: Yup.string().required('E-mail obrigatorio').email('Digite um email valido'),
                password: Yup.string().min(6, 'Minimo 6 digitos')
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await api.post('/users', data);

            addToast({
                type: 'success',
                title: 'Cadastro realizado',
                description: 'Favor realizar login'
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
                title: 'Erro ao realizar cadastro',
                description: 'Favor, tente mais tarde.'
            });
        }

    }, [addToast, history])

    return (
        <Container>

            <Background />

            <Content>
                <Animation>

                    <img src={logo} alt="Logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faca seu cadastro</h1>

                        <Input type="name " icon={FiUser} placeholder="Nome" name="name" />
                        <Input type="email" icon={FiMail} placeholder="E-mail" name="email" />
                        <Input
                            type="password"
                            icon={FiLock}
                            name="password"
                            placeholder="Senha"
                        />

                        <Button type="submit">Cadastrar</Button>


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

export default SingUp;