import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(0);
  const [listRepo, setListRepo] = useState([]);

  useEffect(() => {
    const repos = localStorage.getItem('repositories');
    if (repos) {
      setListRepo(JSON.parse(repos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(listRepo));
  }, [listRepo]);

  function handleInput(e) {
    setRepo(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(1);

    const response = await api.get(`/repos/${repo}`);

    const data = {
      name: response.data.full_name,
    };

    setListRepo([...listRepo, data]);
    setRepo('');
    setLoading(0);
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Adicionar repositório"
          value={repo}
          onChange={e => handleInput(e)}
        />
        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {listRepo.map(repository => (
          <li key={repository.name}>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
