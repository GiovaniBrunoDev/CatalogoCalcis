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
                {/* Imagem */}
                <img
                    src={bannerImage}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Overlay com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>

                {/* Conteúdo com animações */}
                <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 z-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg mb-3"
                    >
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-sm sm:text-lg font-medium mb-5 text-gray-100 max-w-md leading-snug"
                    >
                        <span className="font-semibold text-white">ESTILO, CONFORTO E QUALIDADE</span><br />
                        PARA TODOS OS MOMENTOS.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
                        onClick={() =>
                            document.getElementById("numeracao-section")?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                 text-white font-semibold py-2.5 px-6 rounded-full text-sm sm:text-base shadow-lg
                 transition-transform transform hover:scale-105"
                    >
                        CONFIRA NOSSO CATÁLOGO
                    </motion.button>
                </div>
            </div>


            {/* Carrossel infinito de textos */}
            <div className="overflow-hidden bg-black py-3 relative">
                <div className="flex animate-marquee whitespace-nowrap">
                    {/* Lista duplicada para efeito contínuo */}
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        🚚 <span className="text-green-400 font-semibold">Frete rápido</span> para todo o Brasil
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        ⭐ Qualidade e <span className="text-green-400 font-semibold">preço justo</span>
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        💳 Pague em até <span className="text-green-400 font-semibold">12x</span> nos cartões
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        🔥 <span className="text-green-400 font-semibold">Novos modelos</span> toda semana
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        ⭐ Mais de <span className="text-green-400 font-semibold">2 mil clientes</span> satisfeitos
                    </span>

                    {/* Duplicado */}
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        🚚 <span className="text-green-400 font-semibold">Frete rápido</span> para todo o Brasil
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        ⭐ Qualidade e <span className="text-green-400 font-semibold">preço justo</span>
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        💳 Pague em até <span className="text-green-400 font-semibold">12x sem juros</span>
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        🔥 <span className="text-green-400 font-semibold">Novos modelos</span> toda semana
                    </span>
                    <span className="mx-8 text-white font-medium text-sm sm:text-base">
                        ⭐ Mais de <span className="text-green-400 font-semibold">2 mil clientes</span> satisfeitos
                    </span>
                </div>
            </div>

            <style jsx>{`
  @keyframes marquee {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-50%); } /* só até metade, pq está duplicado */
  }

  .animate-marquee {
    display: inline-flex;
    animation: marquee 20s linear infinite;
  }

  /* Mobile mais rápido */
  @media (max-width: 640px) {
    .animate-marquee {
      animation-duration: 18s;
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
