const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
app.use(express.json());

// .env 파일의 환경변수 불러오기
dotenv.config()

// DNS 서버 설정 (MongoDB 연결 오류 방지용)
require('dns').setServers(['8.8.8.8','1.1.1.1']); 

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB 연결 성공"))
  .catch(err => console.log(err))

// 테스트 라우트
app.get('/', (req, res) => {
    res.send('서버 실행됨');
});

// 미들웨어 설정
app.use(cors()); // CORS 허용 (프론트-백엔드 통신)
app.use(express.json()); // JSON 요청 body 파싱

// 라우터 연결
app.use('/users',require('./routes/user'));
app.use('/teams',require('./routes/team'));
app.use('/tasks',require('./routes/task'));
app.use('/invite',require('./routes/invite')); 
app.use('/admin',require('./routes/admin')); //관리자만 접근가능


app.listen(5000, () => {
    console.log("서버 실행 중 (5000)");
});