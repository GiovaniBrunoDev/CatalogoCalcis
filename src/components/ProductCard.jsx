import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function ProductCard({ produto, numeracaoSelecionada }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  // pega a variação da numeração selecionada no catálogo
  const variacaoSelecionada = produto.variacoes?.find(
    (v) => String(v.numeracao) === String(numeracaoSelecionada)
  )

  const ultimaUnidade =
    variacaoSelecionada && Number(variacaoSelecionada.estoque) === 1

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-0.5">
      {/* Imagem com placeholder */}
      <div className="relative w-full flex items-center justify-center bg-gray-50 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={produto.imagemUrl || '/placeholder.jpg'}
          alt={produto.nome}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-auto transition-opacity duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Conteúdo */}
      <div className="p-3 flex flex-col flex-1 items-center text-center">
        {/* Nome */}
        <h3 className="text-base font-medium text-gray-800 mb-2 line-clamp-2">
          {produto.nome}
        </h3>

        {/* Preços */}
        <div className="flex flex-col items-center mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-green-500">
              {produto.preco
                ? produto.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : 'R$ 0,00'}
            </span>

            {produto.precoAntigo && (
              <span className="text-gray-400 text-sm sm:text-base line-through">
                {produto.precoAntigo.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            )}
          </div>

          {produto.preco && (
            <span className="text-xs sm:text-sm text-gray-500 mt-1">
              ou 3x de{' '}
              {((produto.preco * 1.0612) / 3).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}{' '}
              no cartão
            </span>
          )}
        </div>

        {/* Tamanhos */}
        {produto.variacoes?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Tamanhos disponíveis:</p>
            <div className="flex flex-wrap gap-2 justify-center">
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

        {/* Aviso de última unidade */}
        {ultimaUnidade && numeracaoSelecionada && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full mb-3">
            🔥 Última unidade na numeração {numeracaoSelecionada}!
          </span>
        )}

        {/* Botão WhatsApp */}
        <a
          href={`https://wa.me/55${produto.whatsapp || '45988190147'}?text=Olá, tenho interesse no produto ${produto.nome} ${numeracaoSelecionada}`}
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
