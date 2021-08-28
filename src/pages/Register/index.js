import React, { useState } from 'react';
import { isEmail } from 'validator';
import { toast } from 'react-toastify';
import { get } from 'lodash';
// import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';

// import notify from '../../config/notify';

export default function Register() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function register() {
    setIsLoading(true);
    try {
      await axios.post('/users/', {
        nome,
        password,
        email,
      });

      toast.success(`Successfuly registered.`);
      setIsLoading(false);

      history.push('/login');
    } catch (e) {
      const errors = get(e, 'response.data.errors', []);
      errors.map((error) => toast.error(error));
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Field name must have between 3 and 255 characteres.');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Your password must have between 6 and 50 characteres.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid E-mail.');
    }

    if (formErrors) return;

    register();
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Register</h1>

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
        <button type="submit">Create account</button>
      </Form>
    </Container>
  );
}
