import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoImage from '../assets/logo.png'

export default function Catalogo() {
    const { numeracao } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const preloadedProducts = location.state?.preloadedProducts || []

    const [loading, setLoading] = useState(true)
    const [produtos, setProdutos] = useState(preloadedProducts)
    const [error, setError] = useState(null)
    const [overlayVisible, setOverlayVisible] = useState(true)

    useEffect(() => {
        if (preloadedProducts.length > 0) {
            const timer = setTimeout(() => setLoading(false), 400)
            return () => clearTimeout(timer)
        } else {
            const controller = new AbortController()
            async function load() {
                setLoading(true)
                setError(null)
                try {
                    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
                    const res = await axios.get(`${base}/produtos`, {
                        params: { numeracao },
                        signal: controller.signal,
                    })
                    setProdutos(res.data || [])
                } catch (err) {
                    if (axios.isCancel(err)) return
                    setError(err.message || 'Erro ao carregar produtos')
                } finally {
                    setLoading(false)
                }
            }
            load()
            return () => controller.abort()
        }
    }, [numeracao, preloadedProducts])

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setOverlayVisible(false), 400) // delay para animação final
            return () => clearTimeout(timer)
        }
    }, [loading])

    const produtosOrdenados = useMemo(() => {
        return [...produtos].sort((a, b) =>
            a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
        )
    }, [produtos])

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 relative">
            {/* Overlay Ultra-Interativo */}
            <AnimatePresence>
                {overlayVisible && (
                    <motion.div
                        key="catalogo-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-30"
                    >
                        {/* Spinner pulsante com rotação */}
                        <motion.div
                            className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mb-4"
                            animate={
                                loading
                                    ? { rotate: 360, scale: [1, 1.15, 1] } // pulsar
                                    : { scale: 1.5, opacity: 0 } // zoom out + fade
                            }
                            transition={
                                loading
                                    ? { repeat: Infinity, duration: 1, ease: 'easeInOut' }
                                    : { duration: 0.5, ease: 'easeInOut' }
                            }
                        />

                        {/* Mensagem com leve bounce */}
                        <motion.p
                            className="text-gray-700 text-lg font-medium text-center px-6"
                            initial={{ y: 10, opacity: 0 }}
                            animate={
                                loading
                                    ? { y: [0, -6, 0], opacity: 1 } // bounce suave
                                    : { y: -10, opacity: 0 } // saída
                            }
                            transition={
                                loading
                                    ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                                    : { duration: 0.5, ease: 'easeInOut' }
                            }
                        >
                            Quase lá! Preparando seu catálogo...
                        </motion.p>

                        {/* Partículas leves ao redor do spinner */}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-green-400 rounded-full"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    rotate: i * 60,
                                    x: 40,
                                    y: 0,
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1, 0],
                                }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.1 }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conteúdo da página */}
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Logo centralizada */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <img
                            src={LogoImage}
                            alt="Calcis"
                            className="h-8 sm:h-10 object-contain mb-2"
                        />
                    </div>
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <p className="text-sm sm:text-base text-gray-600 leading-snug">
                            Confira os modelos disponíveis na numeração{" "}
                            <span className="font-semibold text-green-600">{numeracao}</span>.
                        </p>
                    </div>

                    {/* Botão voltar */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full 
      border border-gray-300 text-gray-700 bg-white 
      shadow-sm hover:shadow-md hover:bg-gray-50 
      transition font-medium text-sm sm:text-base"
                    >
                        <ArrowLeft size={18} className="text-gray-500" />
                        Voltar
                    </button>
                </header>



                {error && (
                    <div className="text-red-600 bg-red-100 px-4 py-2 rounded-lg text-center mb-6">
                        Erro: {error}
                    </div>
                )}
                {!loading && produtosOrdenados.length === 0 && (
                    <div className="text-gray-600 text-center py-12">
                        Nenhum produto disponível para essa numeração.
                    </div>
                )}

                <div
                    className="
            grid gap-4 sm:gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
                >
                    {produtosOrdenados.map((p) => (
                        <ProductCard
                            key={p.id}
                            produto={p}
                            numeracaoSelecionada={numeracao}
                            onView={() => navigate(`/produto/${p.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
