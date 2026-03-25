// src/pages/Register.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/thunkFunctions';
import { useNavigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.user);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleRegister = () => {
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        alert('회원가입 성공');
        navigate('/login');
      })
      .catch(() => {});
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleRegister} disabled={loading}>
        회원가입
      </button>

      <button onClick={() => navigate('/login')}>
        로그인으로 이동
      </button>

      {error && <p style={{ color: 'red' }}>회원가입 실패</p>}
    </div>
  );
}

export default Register;