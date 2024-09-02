import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='signup_modal'>
      <h1 className='sign_up'>Sign Up</h1>
      <form className='signup_modal' onSubmit={handleSubmit}>
        <label className='signup_req'>
          <input
            placeholder='Email'
            className='signup_input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className='errors'>{errors.email}</p>}
        <label className='signup_req'>
          <input
            placeholder='Username'
            className='signup_input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className='errors'>{errors.username}</p>}
        <label className='signup_req'>
          <input
            placeholder='First Name'
            className='signup_input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        <label className='signup_req'>
          <input
            placeholder='Last Name'
            className='signup_input'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <label className='signup_req'>
          <input
            placeholder='Password'
            className='signup_input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='errors'>{errors.password}</p>}
        <label className='signup_req'>
          <input
            placeholder='Confirm Password'
            className='signup_input'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className='errors'>{errors.confirmPassword}</p>}
        <button
        className='signup_button'
        type="submit"
        disabled={
          (username.length < 4 || username.length === 0) ||
          (password.length < 6 || password.length === 0) ||
          (confirmPassword.length < 6 || confirmPassword.length === 0) ||
          firstName.length === 0 ||
          lastName.length === 0 ||
          email.length === 0}>Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
