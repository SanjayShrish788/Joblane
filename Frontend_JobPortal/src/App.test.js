import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios', () => ({ create: jest.fn(() => ({ get: jest.fn(), post: jest.fn() })) }));
const api = axios.create.mock.results[0].value;
const jobs = [
  { postId: 1, postProfile: 'Frontend Developer', postDesc: 'Build accessible interfaces.', reqExperience: 2, postTechStack: ['React'] },
  { postId: 2, postProfile: 'Backend Developer', postDesc: 'Build reliable services.', reqExperience: 3, postTechStack: ['Java'] },
];

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  jest.clearAllMocks();
  api.get.mockResolvedValue({ data: jobs });
});

test('search filters jobs by skill', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: 'Frontend Developer' });
  fireEvent.change(screen.getByLabelText('Job title or skill'), { target: { value: 'React' } });
  fireEvent.click(screen.getByRole('button', { name: /Find my next job/ }));
  expect(screen.getByRole('heading', { name: 'Frontend Developer' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Backend Developer' })).not.toBeInTheDocument();
});

test('registration creates the account and signs in with its credentials', async () => {
  window.history.replaceState({}, '', '/register');
  api.post.mockResolvedValue({ data: { username: 'new_user' } });
  render(<App />);
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'new_user' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), { target: { value: 'example-password' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'example-password' } });
  fireEvent.click(screen.getByRole('button', { name: /Create account/ }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/register', { username: 'new_user', password: 'example-password' }));
  await screen.findByText('Hi, new_user');
  expect(api.get).toHaveBeenCalledWith('/jobPosts', { auth: { username: 'new_user', password: 'example-password' } });
});

test('request failure displays a message instead of crashing', async () => {
  api.get.mockRejectedValueOnce(new Error('Network unavailable'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load the jobs.');
});
