import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FaShoePrints } from 'react-icons/fa'

export default function Numeracao() {
  const navigate = useNavigate()
  const [loadingSize, setLoadingSize] = useState(null)
  const sizes = Array.from({ length: 11 }, (_, i) => 34 + i) // 34..44

  async function choose(size) {
    setLoadingSize(size)
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

    try {
      const res = await axios.get(`${base}/produtos`, { params: { numeracao: size } })

      setTimeout(() => {
        navigate(`/catalogo/${size}`, { state: { preloadedProducts: res.data || [] } })
      }, 1200)
    } catch (err) {
      console.error('Erro ao pré-carregar produtos:', err)
      setTimeout(() => {
        navigate(`/catalogo/${size}`)
      }, 1200)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Card central */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 z-10 border border-gray-800"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaShoePrints className="text-pink-500 text-2xl" />
          <h2 className="text-xl font-bold tracking-tight text-gray-100">
            Escolha sua numeração
          </h2>
        </div>

        {/* Grade de botões */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => choose(s)}
              disabled={loadingSize !== null}
              className={`
                py-2 rounded-lg font-medium transition-all duration-300
                border
                ${loadingSize === s
                  ? 'bg-pink-600 text-white border-pink-500 animate-pulse'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'}
                ${loadingSize !== null && loadingSize !== s ? 'opacity-40 cursor-not-allowed' : ''}
              `}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overlay de loading */}
      <AnimatePresence>
        {loadingSize && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
          >
            {/* Spinner */}
            <motion.div
              className="w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full mb-6"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />

            {/* Texto */}
            <motion.p
              className="text-base font-medium text-gray-200 text-center px-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              Estamos conferindo o estoque para você...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
