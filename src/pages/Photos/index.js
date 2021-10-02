import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { Container } from '../../styles/GlobalStyles';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Photos({ match }) {
  const id = get(match, 'params.id', '');

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(`/students/${id}`);
        setPhoto(get(data, 'Files[0].url', ''));

        setIsLoading(false);
      } catch {
        setIsLoading(false);

        toast.error('An error has ocurred while trying to get image.');
        history.push('/');
      }
    };
    getData();
  }, [id]);

  const handleChange = (e) => {
    e.preventDefault();
    const sentFile = e.target.files[0];
    const fileURL = URL.createObjectURL(sentFile);

    setPhoto(fileURL);
    setFile(sentFile);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('file', file);

    try {
      setIsLoading(true);

      await axios.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo successfuly uploaded!');

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      const status = get(err, 'response.status', 0);
      toast.error('An error has ocurred while trying to upload the file.');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Photos</Title>

      <Form onSubmit={handleFileUpload}>
        <label htmlFor="photo">
          {photo ? <img src={photo} alt="file" /> : 'Select'}
          <input type="file" id="photo" onChange={handleChange} />
        </label>
        <button type="submit">Send photo</button>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
