import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BoasVindas from './pages/BoasVindas'
import Numeracao from './pages/Numeracao'
import Catalogo from './pages/Catalogo'
import Produto from './pages/Produto'


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<BoasVindas />} />
        <Route path="/numeracao" element={<Numeracao />} />
        <Route path="/catalogo/:numeracao" element={<Catalogo />} />
        <Route path="/produto/:id" element={<Produto />} />
      </Routes>
    </div>
  )
}