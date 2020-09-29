import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';

import { useToast } from '../../context/ToastContext';

import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AvatarInput } from './styles';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { useAuth } from '../../context/authContext';

interface ProfileData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}


function Profile() {

    const { user, updateUser } = useAuth();
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const history = useHistory();

    const handleSubmit = useCallback(async (data: ProfileData) => {
        try {
            formRef.current?.setErrors({});


            const schema = Yup.object().shape({
                name: Yup.string().required('Nome e obrigatorio'),
                email: Yup.string().required('E-mail obrigatorio').email('Digite um email valido'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string(),
                }),
                password_confirmation: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string(),
                })
                    .oneOf([Yup.ref('password')],
                        'Confirmacao incorreta',
                    ),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const { name, email, old_password, password, password_confirmation } = data;

            const formData = Object.assign({
                name,
                email
            }, old_password ? {
                old_password,
                password,
                password_confirmation,

            } : {} );

            const response = await api.put('/profile', formData);


            updateUser(response.data);

            addToast({
                type: 'success',
                title: 'Perfil atualizado ',
                description: 'Favor realizar login'
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
                title: 'Erro ao atualizar perfil',
                description: 'Favor, tente mais tarde.'
            });
        }

    }, [addToast, history]);

    const handleAvatarChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {

            const data = new FormData();

            data.append('avatar', e.target.files[0]);

            await api.patch('/users/avatar', data).then((response) => {

                updateUser(response.data);

                addToast({
                    type: 'success',
                    title: 'Imagem atualizada',
                })
            });

        }
    }, [addToast, updateUser]);

    return (
        <Container>
            <header>
                <div>

                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>

            <Content>

                <Form ref={formRef} initialData={{
                    name: user.name,
                    email: user.email
                }} onSubmit={handleSubmit}>

                    <AvatarInput>

                        <img src={user.avatar_url || "https://avatars0.githubusercontent.com/u/45130727?s=460&u=1a8757066cf8b44b333d025094dfbef543b21b43&v=4"} alt={user.name} />

                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" id="avatar" onChange={handleAvatarChange} />
                        </label>

                    </AvatarInput>

                    <h1>Meu perfil</h1>

                    <Input type="name " icon={FiUser} placeholder="Nome" name="name" />
                    <Input type="email" icon={FiMail} placeholder="E-mail" name="email" />

                    <Input
                        type="password"
                        icon={FiLock}
                        name="old_password"
                        placeholder="Senha atual"
                    />

                    <Input
                        type="password"
                        icon={FiLock}
                        name="password"
                        placeholder="Nova senha"
                    />

                    <Input
                        type="password"
                        icon={FiLock}
                        name="password_confirmation"
                        placeholder="Confirme a nova senha"
                    />

                    <Button type="submit">Atualizar</Button>


                </Form>



            </Content>

        </Container>
    )
}

export default Profile;