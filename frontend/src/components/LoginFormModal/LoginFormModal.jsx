import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({'message':'The provided credentials were invalid'})
        }
      });
  };

  useEffect(() => {
    const errors = {}
    if(credential.length < 4) errors.credential = 'Credentials must be at least 4 characters';
    if(password.length < 6) errors.password = 'Password must be at least 6 characters';
    setErrors(errors);
  }, [credential, password]);

  const demoLogin = async (e) => {
    e.preventDefault()
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password'}))
    .then(closeModal)
  }

  return (
    <div className='login_modal'>
      <h1 className='login_title'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label
        className='login_req'
        ><div className='login-input'>Username or Email</div>
        <input
            className='login_input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />
        </label>
        <label
        className='login_req'
        ><div className='login-input'>Password</div>
          <input
            className='login_input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
        {errors.message && (
          <p className='errors'>{errors.message}</p>
        )}
        <div className='login_button'>
          <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
          >Log In
          </button>
          <button
          onClick={demoLogin}>Demo User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
