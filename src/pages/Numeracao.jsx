import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function Numeracao() {
  const navigate = useNavigate()
  const [loadingSize, setLoadingSize] = useState(null)
  const sizes = Array.from({ length: 11 }, (_, i) => 34 + i) // 34..44

  async function choose(size) {
    setLoadingSize(size)

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

    try {
      // Pré-carrega produtos
      const res = await axios.get(`${base}/produtos`, { params: { numeracao: size } })

      // Passa os produtos via state para Catalogo
      navigate(`/catalogo/${size}`, { state: { preloadedProducts: res.data || [] } })
    } catch (err) {
      console.error('Erro ao pré-carregar produtos:', err)
      // Mesmo em caso de erro, navega normalmente
      navigate(`/catalogo/${size}`)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded shadow p-6 z-10 relative">
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
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay de loading */}
      <AnimatePresence>
        {loadingSize && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20"
          >
            <motion.div
              className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            ></motion.div>

            <motion.p
              className="text-gray-700 text-lg font-medium text-center px-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              Quase lá! Estamos conferindo o estoque para você...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
