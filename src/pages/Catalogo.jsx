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

    // 🔥 Sempre rolar para o topo ao entrar na página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    // 🔥 Se atualizar e não tiver state, manda pra home
    useEffect(() => {
        if (!location.state) {
            navigate("/", { replace: true })
        }
    }, [location.state, navigate])

    // 🔀 Embaralhar produtos quando eles mudarem
    useEffect(() => {
        if (produtos.length > 0) {
            const shuffled = [...produtos].sort(() => Math.random() - 0.5)
            setProdutos(shuffled)
        }
    }, [produtos.length])



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
            const timer = setTimeout(() => setOverlayVisible(false), 400)
            return () => clearTimeout(timer)
        }
    }, [loading])



    return (
        <div className="min-h-screen pt-0 px-4 pb-4 sm:px-6 sm:pb-6 bg-gradient-to-br from-gray-50 to-gray-100 relative">

            {/* Overlay */}
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
                        <motion.div
                            className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mb-4"
                            animate={
                                loading
                                    ? { rotate: 360, scale: [1, 1.15, 1] }
                                    : { scale: 1.5, opacity: 0 }
                            }
                            transition={
                                loading
                                    ? { repeat: Infinity, duration: 1, ease: 'easeInOut' }
                                    : { duration: 0.5, ease: 'easeInOut' }
                            }
                        />
                        <motion.p
                            className="text-gray-700 text-lg font-medium text-center px-6"
                            initial={{ y: 10, opacity: 0 }}
                            animate={
                                loading
                                    ? { y: [0, -6, 0], opacity: 1 }
                                    : { y: -10, opacity: 0 }
                            }
                            transition={
                                loading
                                    ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                                    : { duration: 0.5, ease: 'easeInOut' }
                            }
                        >
                            Quase lá! Preparando seu catálogo...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header preto cobrindo largura total */}
            <header className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-col gap-4">
                {/* Logo com fundo preto */}
                <div className="bg-black flex justify-center sm:justify-start py-3 px-4 rounded-lg">
                    <img
                        src={LogoImage}
                        alt="Calcis"
                        className="h-8 sm:h-10 object-contain"
                    />
                </div>

                {/* Texto + botão */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm sm:text-base text-gray-700 text-center sm:text-left">
                        Confira os modelos disponíveis na numeração{" "}
                        <span className="font-semibold text-green-600">{numeracao}</span>.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full 
      border border-gray-400 text-gray-700 bg-white 
      shadow-sm hover:shadow-md hover:bg-gray-50 
      transition font-medium text-sm sm:text-base"
                    >
                        <ArrowLeft size={18} className="text-gray-500" />
                        Voltar
                    </button>
                </div>
            </header>

            {/* Conteúdo */}
            <div className="max-w-6xl mx-auto relative z-10 mt-6">
                {error && (
                    <div className="text-red-600 bg-red-100 px-4 py-2 rounded-lg text-center mb-6">
                        Erro: {error}
                    </div>
                )}
                {!loading && produtos.length === 0 && (
                    <div className="text-gray-600 text-center py-12">
                        Desculpe, nenhuma opção disponível na numeração {numeracao}.
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
                    {produtos.map((p) => (
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
