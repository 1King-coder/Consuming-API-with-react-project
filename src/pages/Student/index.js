import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const id = get(match, 'params.id', 0);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line
    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`students/${id}`);
        // eslint-disable-next-line
        const photo = await get(data, 'Fotos[0].url', '');

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setAltura(data.altura);
        setPeso(data.peso);

        return setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) {
          toast.error('Student does not Exists.');
          return history.push('/');
        }

        if (status === 401) {
          toast.error('You must login.');
          return history.push('/login');
        }

        errors.map((error) => toast.error(error));
      }
    }

    getData();
  }, [id]);

  const validateForm = () => {
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Field name must have between 3 and 255 characteres.');
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error('Field lastname must have between 3 and 255 characteres.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('The e-mail must be valid.');
    }

    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error('Age must be a integer.');
    }

    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error('Height must be a integer or a float.');
    }

    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error('Weight must be a integer or a float.');
    }

    if (formErrors) return false;

    return true;
  };

  const createStudent = async (studentData) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post('/students/', studentData);

      setIsLoading(false);

      toast.success('Student successfuly registered.');
      history.push(`/student/${data.id}/edit`);
    } catch (err) {
      setIsLoading(false);
      const errors = get(err, 'response.data.errors', []);
      const status = get(err, 'response.status', 0);
      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown error.');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  const editStudent = async (studentData) => {
    try {
      setIsLoading(true);

      await axios.put(`/students/${id}`, studentData);

      setIsLoading(false);
      toast.success('Student successfuly edited.');
    } catch (err) {
      setIsLoading(false);
      const errors = get(err, 'response.data.errors', []);
      const status = get(err, 'response.status', 0);
      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown error.');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const studentData = {
      nome,
      sobrenome,
      email,
      idade,
      altura,
      peso,
    };

    // eslint-disable-next-line
    if (!id) return createStudent(studentData);

    editStudent(studentData);
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>{id ? 'Edit Student' : 'Register a new Student'}</h1>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder="Lastname"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail"
        />
        <input
          type="text"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Height"
        />
        <input
          type="text"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Weight"
        />
        <button type="submit">Send</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
