import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HeaderNav from './components/HeaderNav'
import SupportChatWidget from './components/SupportChatWidget'
import HomePage from './pages/HomePage'
import PresentationPage from './pages/PresentationPage'
import SectionDetailPage from './pages/SectionDetailPage'
import GameHubPage from './pages/GameHubPage'
import AIUsagePage from './pages/AIUsagePage'
import OddOneOutGamePage from './pages/games/OddOneOutGamePage'
import Game2PlaceholderPage from './pages/games/Game2PlaceholderPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <HeaderNav />
        <main className="page-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="/presentation/parts/:partId" element={<SectionDetailPage />} />
            <Route path="/presentation/levels/:legacyId" element={<SectionDetailPage />} />
            <Route path="/game" element={<GameHubPage />} />
            <Route path="/ai-usage" element={<AIUsagePage />} />
            <Route path="/game/ke-ngoai-dao" element={<OddOneOutGamePage />} />
            <Route path="/game/tro-2" element={<Game2PlaceholderPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <SupportChatWidget />
      </div>
    </BrowserRouter>
  )
}

export default App  
