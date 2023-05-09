import './App.css';
import { Button, ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams
} from "react-router-dom";
import Dashboard from './Dashboard';
import Parking from './Parking';
import Login from './Login';
import {useState} from 'react'

function App() {
  const [token, setToken] = useState("")

  return (
    <ChakraProvider>
        <Router>
          <Routes>
                <Route path="/" element={<Login setToken={setToken}/>} />
                <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken}/>} />
                <Route path="/parking" element={<Parking token={token} setToken={setToken}/>} />
            </Routes>
          </Router>
    </ChakraProvider>
    
  );
}

export default App;
