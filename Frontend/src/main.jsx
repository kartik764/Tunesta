import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Authprovider} from './context/Authcontext.jsx'

// We wrapped our App in Authprovider that we created in the Authcontext.jsx file so that when this AuthProvider component will be 
// called then since our App is sandwiched between them it will be passed as children(that is inbuilt prop for the jsx file).

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <App />
    </Authprovider>
  </StrictMode>,
)




