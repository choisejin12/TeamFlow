// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

// 🔥 토큰 자동 붙이기
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, function(err){
    return Promise.reject(err);
});


/*
axiosInstance.interceptors.response.use(function (response) { // (1) 서버 응답 받음
    return response;
}, function (err) { // (2) 에러 발생
    if(err.response.data === 'jwt expired'){ // (3) "jwt expired"인지 확인 = 토큰 유효기간 끝
        window.location.reload(); //(4) 맞으면 → 페이지 새로고침 
    }
    return Promise.reject(err);
})
*/



export default axiosInstance;