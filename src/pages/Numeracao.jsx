import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FaShoePrints } from 'react-icons/fa'
import bannerImage from '../assets/banner.png' // ajuste o caminho da imagem

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
    <div className="relative min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Banner topo */}
      <div className="relative w-full aspect-[18/10] overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 text-white z-10 animate-fadeIn bg-black/40">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">BEM-VINDO À CALCIS</h2>
          <p className="text-sm sm:text-lg font-medium mb-4">
            <span className="font-bold">ESTILO, CONFORTO E QUALIDADE</span><br />
            PARA TODOS OS MOMENTOS.
          </p>
          <button
            onClick={() => document.getElementById('numeracao-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-full text-sm sm:text-base shadow-md"
          >
            CONFIRA NOSSO CATÁLOGO
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Seção escolha de numeração */}
      <div id="numeracao-section" className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 z-10 border border-gray-200"
        >
          <div className="text-center mb-8">
           
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Escolha sua numeração
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Selecione o tamanho para visualizar os produtos disponíveis em estoque.
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => choose(s)}
                disabled={loadingSize !== null}
                className={`
                  py-2 rounded-lg font-medium text-sm transition-all duration-300
                  border shadow-sm
                  ${loadingSize === s
                    ? 'bg-gray-900 text-white border-gray-900 animate-pulse'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}
                  ${loadingSize !== null && loadingSize !== s ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
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
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20"
          >
            <motion.div
              className="w-14 h-14 border-4 border-gray-800 border-t-transparent rounded-full mb-6"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
            <motion.p
              className="text-base font-medium text-gray-700 text-center px-6"
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
