import { Route, Routes } from 'react-router-dom'
import './App.css'
import AiAssistantWidget from './Components/ChatBot.jsx';

// Importing Pages
import Home from './Pages/Home.jsx';
import Error404 from './Components/Error404.jsx';

function App() {
  return (
    <>
    <AiAssistantWidget/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='*' element={<Error404 />} />
      </Routes>
    </>
  )
}

export default App
