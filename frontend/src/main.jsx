import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 추가
import { Provider} from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import {persistor} from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}> {/* 리덕스 사용을 위한 것 */}
        <PersistGate loading={null} persistor={persistor}> {/*Redux 상태 복원될 때까지 렌더링 막기 위함*/}
          {/*
          loading 👉 로딩 중일 때 보여줄 UI (Spinner 같은 거 넣어서 로딩중 화면 가능)
          persistor 👉 저장/복구 담당 (실제 작업)
          PersistGate 👉 끝날 때까지 기다림 (UI 제어)
          */}
          <App />
        </PersistGate>

      </Provider>
    </BrowserRouter>
  </StrictMode>,
)