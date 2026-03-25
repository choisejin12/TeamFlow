import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";

const storage = { // redux-persist는 비동기 storage 방식을 기대함
  // 👉 localStorage → Promise로 감싸서 비동기처럼 만듦 
  getItem: (key) => Promise.resolve(localStorage.getItem(key)), // getItem → 저장된 state 가져오기
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),// setItem → state 저장
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)), //removeItem → state 삭제
}
// Promise.resolve(...) 👉 즉시 성공하는 비동기처럼 만들어주는 것
// key 👉 localStorage에 저장된 Redux 데이터 이름 (ex. "persist:root")

// ▼▼▼▼ 코드 전체 흐름 userReducer → rootReducer → persistReducer → store 생성 ▼▼▼▼

const rootReducer = combineReducers({  // 여러 reducer를 하나로 합침 (현재는 1개라서)
  user: userReducer // user 👉 state 접근할 때 이름
  /* const isAuth = useSelector(state => state.user?.isAuth);👉 여기에서 state.user가 쓰임  */
})

const persistConfig = {
  key: 'root', // key → 저장 이름 ("persist:root")
  storage // storage → localStorage 사용 (위에 정의)
}

const persistedReducer = persistReducer(persistConfig, rootReducer); // rootReducer에 “저장 기능” 추가
      /* state 변경됨
      → localStorage 저장
        새로고침
      → localStorage에서 복구  */

export const store = configureStore({//Redux 전체 상태를 관리하는 중앙 저장소
  reducer: persistedReducer, // state 유지를 위해

  //persist 오류 안 나게 middleware 설정하는 코드 => action 가로채서 검사/수정/로그 등 처리
  middleware: (getDefaultMiddleware) => //dispatch → reducer 가기 전에 검사/조작하는 기능코드
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] //이 액션들은 검사하지 마라 (무시해라)
      }
    })
})

export const persistor = persistStore(store);