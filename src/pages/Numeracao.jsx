import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import bannerImage from '../assets/banner.png'
import LogoImage from '../assets/logo.png'

export default function Numeracao() {
    const navigate = useNavigate()
    const [loadingSize, setLoadingSize] = useState(null)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

    const sizes = Array.from({ length: 11 }, (_, i) => 34 + i) // 34..44
    const messages = [
        "Um momento... estamos conferindo a sua numeração no estoque.",
        "Só um instantinho, já já fica pronto!",
        "Quase lá, finalizando a busca!"
    ]

    useEffect(() => {
        if (loadingSize) {
            let index = 0
            const interval = setInterval(() => {
                index++
                if (index < messages.length) {
                    setLoadingMessageIndex(index)
                } else {
                    clearInterval(interval) // para quando chegar na última frase
                }
            }, 3000) // troca a cada 2s

            return () => clearInterval(interval)
        }
    }, [loadingSize])

    async function choose(size) {
        setLoadingSize(size)
        setLoadingMessageIndex(0) // sempre começa na primeira frase

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

        try {
            const res = await axios.get(`${base}/produtos`, { params: { numeracao: size } })
            setTimeout(() => {
                navigate(`/catalogo/${size}`, { state: { preloadedProducts: res.data || [] } })
            }, 5000) // tempo total para exibir as frases
        } catch (err) {
            console.error('Erro ao pré-carregar produtos:', err)
            setTimeout(() => {
                navigate(`/catalogo/${size}`)
            }, 5000)
        }
    }

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 flex flex-col">
            <header className="w-full bg-black">
                <div className="max-w-6xl mx-auto flex justify-center items-center py-3">
                    <img
                        src={LogoImage} // substitua por LogoImage se for logo em vez do banner
                        alt="Calcis"
                        className="h-8 sm:h-9 object-contain"
                    />
                </div>
            </header>

            {/* Banner topo */}
            <div className="relative w-full aspect-[18/10] overflow-hidden">
                <img
                    src={bannerImage}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 text-white z-10 animate-fadeIn bg-black/10">
                    <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-2">
                        BEM-VINDO À CALCIS
                    </h2>
                    <p className="text-xs sm:text-base font-normal mb-3 leading-snug text-gray-100/90">
                        <span className="font-semibold">ESTILO, CONFORTO E QUALIDADE</span><br />
                        PARA TODOS OS MOMENTOS.
                    </p>
                    <button
                        onClick={() =>
                            document.getElementById('numeracao-section')?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-5 rounded-full text-xs sm:text-sm shadow-md tracking-wide"
                    >
                        CONFIRA NOSSO CATÁLOGO
                    </button>
                </div>
            </div>

            {/* Carrossel infinito de textos */}
            <div className="overflow-hidden bg-black py-3 relative">
                {/* Primeira lista */}
                <div className="flex animate-marquee whitespace-nowrap">
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">✔ Frete rápido para todo o Brasil</span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">✔ Qualidade e preço justo</span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">✔ Pague em até 12x sem juros</span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">✔ Novos modelos toda semana</span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">✔ Mais de 2 mil clientes satisfeitos</span>
                </div>

            </div>

            <style jsx>{`
  @keyframes marquee {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes marquee2 {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(0%); }
  }
  .animate-marquee {
    animation: marquee 15s linear infinite;
  }
  .animate-marquee2 {
    animation: marquee2 15s linear infinite;
  }

  /* Mobile mais rápido */
  @media (max-width: 640px) {
    .animate-marquee {
      animation-duration: 8s;
    }
    .animate-marquee2 {
      animation-duration: 8s;
    }
  }
`}</style>



            {/* Seção escolha de numeração */}
            <div id="numeracao-section" className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
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
                        className="absolute inset-0 flex flex-col items-center justify-center 
                 bg-gradient-to-b from-white via-gray-50 to-gray-200 
                 backdrop-blur-sm z-20"
                    >
                        {/* Spinner */}
                        <motion.div
                            className="w-14 h-14 border-4 border-gray-800 border-t-transparent rounded-full mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />

                        {/* Mensagem dinâmica */}
                        <motion.p
                            key={loadingMessageIndex}
                            className="text-base font-medium text-gray-700 text-center px-6"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {messages[loadingMessageIndex]}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
