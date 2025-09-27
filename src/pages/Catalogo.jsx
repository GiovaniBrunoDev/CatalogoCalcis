import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { ArrowLeft } from 'lucide-react'

export default function Catalogo() {
  const { numeracao } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [produtos, setProdutos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const base =
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
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
  }, [numeracao])

  // memoiza lista já ordenada para não reordenar a cada render
  const produtosOrdenados = useMemo(() => {
    return [...produtos].sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
    )
  }, [produtos])

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              Catálogo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Produtos disponíveis na numeração{' '}
              <span className="font-semibold text-green-600">
                {numeracao}
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition text-sm sm:text-base"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </header>

        {/* Estados */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
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

        {/* Grid de Produtos */}
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
