import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import VideoWidget from "./VideoWidget";

export default function ProductCard({ produto, numeracaoSelecionada }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  // pega a variação da numeração selecionada no catálogo
  const variacaoSelecionada = produto.variacoes?.find(
    (v) => String(v.numeracao) === String(numeracaoSelecionada)
  );

  const ultimaUnidade =
    variacaoSelecionada && Number(variacaoSelecionada.estoque) === 1;

  const esgotado =
    variacaoSelecionada && Number(variacaoSelecionada.estoque) === 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col transform
        ${esgotado
          ? "opacity-90"
          : "hover:shadow-md hover:-translate-y-0.5"
        }
      `}
    >
      {/* Imagem com placeholder */}
      <div className="relative w-full flex items-center justify-center bg-gray-50 overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img
          src={produto.imagemUrl || "/placeholder.jpg"}
          alt={produto.nome}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-auto transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Botão de vídeo sobre a imagem */}
        {produto.videoUrl && (
          <div className="absolute bottom-1 right-3 z-20">
            <VideoWidget
              produto={produto}
              videoUrl={produto.videoUrl}
              gifUrl={produto.gifUrl}
            />
          </div>
        )}



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
                ? produto.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
                : "R$ 0,00"}
            </span>

            {produto.precoAntigo && (
              <span className="text-gray-400 text-sm sm:text-base line-through">
                {produto.precoAntigo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            )}
          </div>

          {produto.preco && (
            <span className="text-xs sm:text-sm text-gray-500 mt-1">
              ou 3x de{" "}
              {((produto.preco * 1.0612) / 3).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              no cartão
            </span>
          )}
        </div>

        {/* Tamanhos */}
        {produto.variacoes?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Tamanhos:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {produto.variacoes
                .slice()
                .sort((a, b) => Number(a.numeracao) - Number(b.numeracao))
                .map((v) => (
                  <span
                    key={v.numeracao}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
                      ${Number(v.estoque) > 0
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-200 text-gray-400 line-through cursor-not-allowed"
                      }`}
                  >
                    {v.numeracao}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Aviso de última unidade */}
        {ultimaUnidade && numeracaoSelecionada && !esgotado && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full mb-3">
            🔥 Última unidade na numeração {numeracaoSelecionada}!
          </span>
        )}

        {/* Aviso de indisponibilidade */}
        {esgotado && numeracaoSelecionada && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm font-medium text-red-700">
              Produto indisponível na numeração <b>{numeracaoSelecionada}</b>.
            </span>
          </div>
        )}

        {/* Botão WhatsApp */}
        <a
          href={`https://wa.me/55${produto.whatsapp || "45988190147"
            }?text=Olá, gostaria de ser avisado quando o produto ${produto.nome
            } na numeração ${numeracaoSelecionada} voltar ao estoque.`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium shadow transition-all duration-300
            ${esgotado
              ? "bg-gray-400 text-white cursor-pointer hover:bg-gray-500"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            }`}
        >
          <FaWhatsapp className="text-lg" />
          {esgotado ? "Avise-me quando disponível" : "Pedir via WhatsApp"}
        </a>

        {/* Mensagem discreta */}
        {!esgotado && (
          <p className="mt-2 text-xs text-gray-500 text-center leading-snug">
            Entregamos em Cascavel (consulte a taxa) <br />💳 Pagamento na entrega
          </p>
        )}
      </div>
    </div>
  );
}
