// src/pages/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/thunkFunctions';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {});
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        로그인
      </button>

      <button onClick={() => navigate('/register')}>
        회원가입
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;