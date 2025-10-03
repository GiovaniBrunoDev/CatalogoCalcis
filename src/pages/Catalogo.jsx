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
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    useEffect(() => {
        if (!location.state) {
            navigate("/", { replace: true })
        }
    }, [location.state, navigate])

    // Embaralha apenas quando a lista muda (não causa loop porque depende do length)
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

    // 🔍 Aqui está a correção: verificar estoque **somente** para a variação da numeracao atual.
    const produtosDisponiveis = useMemo(() => {
        if (!numeracao) {
            // se não tiver numeracao na rota, considera qualquer variacao com estoque
            return produtos.filter((p) => p.variacoes?.some((v) => Number(v.estoque) > 0))
        }
        return produtos.filter((p) =>
            p.variacoes?.some((v) => String(v.numeracao) === String(numeracao) && Number(v.estoque) > 0)
        )
    }, [produtos, numeracao])

    const produtosEsgotados = useMemo(() => {
        if (!numeracao) {
            return produtos.filter((p) => !(p.variacoes?.some((v) => Number(v.estoque) > 0)))
        }
        return produtos.filter((p) =>
            // esgotado se NÃO existir variação com a numeracao e estoque > 0
            !p.variacoes?.some((v) => String(v.numeracao) === String(numeracao) && Number(v.estoque) > 0)
        )
    }, [produtos, numeracao])

    return (
        <div className="min-h-screen pt-0 px-4 pb-4 sm:px-6 sm:pb-6 bg-gradient-to-br from-gray-50 to-gray-100 relative">

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

            <header className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-col gap-4">
                <div className="bg-black flex justify-center sm:justify-start py-3 px-4 rounded-lg">
                    <img src={LogoImage} alt="Calcis" className="h-8 sm:h-10 object-contain" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm sm:text-base text-gray-700 text-center sm:text-left">
                        Confira os modelos disponíveis na numeração {" "}
                        <span className="font-semibold text-green-600">{numeracao}</span>.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-400 text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition font-medium text-sm sm:text-base"
                    >
                        <ArrowLeft size={18} className="text-gray-500" />
                        Voltar
                    </button>
                </div>
            </header>

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

                {produtosDisponiveis.length > 0 && (
                    <>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {produtosDisponiveis.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    produto={p}
                                    numeracaoSelecionada={numeracao}
                                    esgotado={false}
                                    onView={() => navigate(`/produto/${p.id}`)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Sessão de produtos fora de estoque */}
                <div className="mt-12">
                    {/* Título estilizado */}
                    {/* Título clean e bonito */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Produtos Fora de Estoque
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Indisponíveis no momento
                        </p>
                        <div className="w-20 h-[3px] bg-red-500 rounded mx-auto mt-3" />
                    </div>


                    {/* Grid dos produtos */}
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {produtosEsgotados.map((p) => (
                            <div
                                key={p.id}
                                className="relative opacity-95 hover:opacity-100 hover:scale-[1.02] transition transform duration-300 group"
                            >
                                <ProductCard
                                    produto={p}
                                    numeracaoSelecionada={numeracao}
                                    esgotado={true}
                                />

                                {/* Badge diagonal com pontas dobradas */}
                                <div className="absolute top-4 -left-10 rotate-[-35deg] z-20">
                                    <div className="relative bg-gradient-to-r from-red-500 to-red-700 text-white text-[11px] font-bold px-12 py-1 shadow-lg tracking-wide">
                                        ESGOTADO

                                        {/* ponta esquerda dobrada */}
                                        <span className="absolute -bottom-2 left-0 w-0 h-0 
                border-t-[8px] border-t-red-700 
                border-l-[8px] border-l-transparent" />

                                        {/* ponta direita dobrada */}
                                        <span className="absolute -bottom-2 right-0 w-0 h-0 
                border-t-[8px] border-t-red-700 
                border-r-[8px] border-r-transparent" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



            </div>
        </div>
    )
}
