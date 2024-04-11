import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import LoginForm from '../loginAndRegister/LoginForm';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('LoginForm Component', () => {
  const onClose = jest.fn();
  const onSwitchForm = jest.fn();
  const onShowForgotPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LoginForm onClose={onClose} onSwitchForm={onSwitchForm} onShowForgotPassword={onShowForgotPassword} />);
  });

  it('updates email field correctly', () => {
    const { getByPlaceholderText } = render(<LoginForm onClose={onClose} onSwitchForm={onSwitchForm} onShowForgotPassword={onShowForgotPassword} />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password field correctly', () => {
    const { getByPlaceholderText } = render(<LoginForm onClose={onClose} onSwitchForm={onSwitchForm} onShowForgotPassword={onShowForgotPassword} />);
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(passwordInput.value).toBe('testpassword');
  });

  it('calls handleSubmit function on form submission', async () => {
    const { getByText } = render(<LoginForm onClose={onClose} onSwitchForm={onSwitchForm} onShowForgotPassword={onShowForgotPassword} />);
    const submitButton = getByText('Login');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
