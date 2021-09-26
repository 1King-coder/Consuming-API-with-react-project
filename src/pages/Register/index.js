import React, { useState } from 'react';
import { isEmail } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form } from './styled';
import * as actions from '../../store/modules/auth/actions';

export default function Register() {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.auth.user.id);
  const storedName = useSelector((state) => state.auth.user.name);
  const storedEmail = useSelector((state) => state.auth.user.email);

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = useSelector((state) => state.auth.user.isLoading);

  React.useEffect(() => {
    if (!id) return;

    setNome(storedName);
    setEmail(storedEmail);
  }, [id, storedEmail, storedName]);

  function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Field name must have between 3 and 255 characteres.');
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Your password must have between 6 and 50 characteres.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid E-mail.');
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ nome, email, password, id }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>{id ? 'Edit your data' : 'Register'}</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Kimi no na wa"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>
        <button type="submit">{id ? 'Save' : 'Register'}</button>
      </Form>
    </Container>
  );
}
