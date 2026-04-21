import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Redux bileşenlerini içe aktar
import { Provider } from 'react-redux'
import { store } from './store' // store dosyanın yolu (nerede oluşturduysan)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Uygulamayı Provider ile sarmalıyoruz */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)