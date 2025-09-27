import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function ProductCard({ produto }) {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1">
            {/* Imagem */}
            <div className="w-full flex items-center justify-center bg-gray-50 overflow-hidden">
                <img
                    src={produto.imagemUrl || '/placeholder.jpg'}
                    alt={produto.nome}
                    className="w-full h-auto"
                />
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex flex-col flex-1">
                {/* Nome */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {produto.nome}
                </h3>

                {/* Preços */}
                <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">
                        R$ {Number(produto.preco || 0).toFixed(2)}
                    </span>
                    {produto.precoAntigo && (
                        <span className="text-gray-400 line-through text-sm">
                            R$ {Number(produto.precoAntigo).toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Tamanhos */}
                {produto.variacoes?.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Tamanhos disponíveis:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {produto.variacoes
                                .slice() // cria cópia para não mutar o original
                                .sort((a, b) => Number(a.numeracao) - Number(b.numeracao)) // ordena crescente
                                .map((v) => (
                                    <span
                                        key={v.numeracao}
                                        className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border hover:bg-gray-200 transition-colors"
                                    >
                                        {v.numeracao}
                                    </span>
                                ))}
                        </div>
                    </div>
                )}

                {/* Botão WhatsApp */}
                <a
                    href={`https://wa.me/55${produto.whatsapp || '45988190147'}?text=Olá, tenho interesse no produto ${produto.nome}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                    <FaWhatsapp className="text-xl animate-pulse" />
                    Pedir via WhatsApp
                </a>
            </div>
        </div>
    )
}
