import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Produto() {
    const { id } = useParams()
    const [produto, setProduto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true); setError(null)
            try {
                const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
                const res = await axios.get(`${base}/produto/${id}`)
                if (mounted) setProduto(res.data)
            } catch (err) {
                setError(err.message || 'Erro ao carregar produto')
            } finally { if (mounted) setLoading(false) }
        }
        load()
        return () => mounted = false
    }, [id])


    if (loading) return <div className="p-6">Carregando...</div>
    if (error) return <div className="p-6 text-red-500">Erro: {error}</div>
    if (!produto) return <div className="p-6">Produto não encontrado</div>


    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
                <button onClick={() => navigate(-1)} className="mb-4 px-3 py-2 border rounded">Voltar</button>
                <div className="md:flex gap-6">
                    <div className="md:w-1/2">
                        <img src={produto.imagem || '/placeholder.jpg'} alt={produto.nome} className="w-full object-contain h-96" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-2xl font-bold">{produto.nome}</h2>
                        <div className="text-xl text-green-600 mt-2">R$ {Number(produto.preco || 0).toFixed(2)}</div>
                        <p className="mt-4 text-gray-700">{produto.descricao}</p>


                        <div className="mt-6">
                            <h3 className="font-semibold">Numerações e estoque</h3>
                            <ul className="mt-2">
                                {produto.variacoes?.map(v => (
                                    <li key={v.numeracao} className="flex justify-between py-1 border-b">
                                        <span>{v.numeracao}</span>
                                        <span>{v.estoque}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}