import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Numeracao() {
  const navigate = useNavigate()
  const [loadingSize, setLoadingSize] = useState(null)
  const sizes = Array.from({ length: 11 }, (_, i) => 34 + i) // 34..44

  function choose(size) {
    setLoadingSize(size)

    // simula delay de carregamento bonito
    setTimeout(() => {
      localStorage.setItem('calcis_selected_numeracao', String(size))
      navigate(`/catalogo/${size}`)
    }, 800) // 800ms de delay, você pode ajustar
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Escolha a numeração</h2>
        <div className="grid grid-cols-6 gap-3">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => choose(s)}
              disabled={loadingSize !== null}
              className={`
                py-2 rounded border hover:bg-gray-100
                ${loadingSize === s ? 'bg-green-100 animate-pulse' : ''}
                ${loadingSize !== null && loadingSize !== s ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loadingSize === s ? 'Carregando...' : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
