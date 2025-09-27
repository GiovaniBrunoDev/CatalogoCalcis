import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function ProductCard({ produto, numeracaoSelecionada }) {
    // pega a variação da numeração selecionada no catálogo
    const variacaoSelecionada = produto.variacoes?.find(
        (v) => String(v.numeracao) === String(numeracaoSelecionada)
    );

    const ultimaUnidade =
        variacaoSelecionada && Number(variacaoSelecionada.estoque) === 1;

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-0.5">
            {/* Imagem */}
            <div className="w-full flex items-center justify-center bg-gray-50 overflow-hidden">
                <img
                    src={produto.imagemUrl || '/placeholder.jpg'}
                    alt={produto.nome}
                    className="w-full h-auto"
                />
            </div>

            {/* Conteúdo */}
            <div className="p-3 flex flex-col flex-1 items-center text-center">
                {/* Nome */}
                <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">
                    {produto.nome}
                </h3>

                {/* Preços */}
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-semibold text-green-600">
                        R$ {Number(produto.preco || 0).toFixed(2)}
                    </span>
                    {produto.precoAntigo && (
                        <span className="text-gray-400 line-through text-xs">
                            R$ {Number(produto.precoAntigo).toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Aviso de última unidade */}
                {ultimaUnidade && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full mb-2">
                        🔥 Última unidade na sua numeração!
                    </span>
                )}


                {/* Tamanhos */}
                {produto.variacoes?.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs text-gray-500">Tamanhos disponíveis:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1 justify-center">
                            {produto.variacoes
                                .slice()
                                .sort((a, b) => Number(a.numeracao) - Number(b.numeracao))
                                .filter((v) => Number(v.estoque) > 0)
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
                    className="mt-auto flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium shadow hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                    <FaWhatsapp className="text-lg" />
                    Pedir via WhatsApp
                </a>
            </div>
        </div>
    )
}
