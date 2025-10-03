import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import bannerImage from '../assets/banner.png'
import LogoImage from '../assets/logo.png'
import { ChevronDown } from "lucide-react"
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'

export default function Numeracao() {
    const navigate = useNavigate()
    const [loadingSize, setLoadingSize] = useState(null)
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
    const [openIndex, setOpenIndex] = useState(null)


    const sizes = Array.from({ length: 11 }, (_, i) => 34 + i) // 34..44
    const messages = [
        "Um momento...",
        "Consultando sua numeração em nosso estoque.",
        "Só um instantinho, já já fica pronto!",
        "Quase lá, finalizando a busca!"
    ]

    useEffect(() => {
        if (loadingSize) {
            // trava o scroll do body
            document.body.style.overflow = "hidden";

            let index = 0;
            const interval = setInterval(() => {
                index++;
                if (index < messages.length) {
                    setLoadingMessageIndex(index);
                } else {
                    clearInterval(interval); // para quando chegar na última frase
                }
            }, 2000);

            return () => {
                clearInterval(interval);
                document.body.style.overflow = ""; // libera scroll
            };
        } else {
            // caso loadingSize volte a false
            document.body.style.overflow = "";
        }
    }, [loadingSize]);

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

    const faqs = [
        {
            question: "Como funciona a entrega?",
            answer: (
                <>
                    <p className="mb-3">
                        <span className="font-semibold">Em Cascavel:</span> entregamos no mesmo dia.
                        O pagamento é realizado na entrega. <span className="italic">(consulte a taxa)</span>
                    </p>
                    <p>
                        <span className="font-semibold">Demais regiões:</span> enviamos para todo o Brasil com código de rastreio.
                        O prazo varia conforme a localidade e o pagamento é antecipado via Pix ou cartão.
                    </p>
                </>
            ),
        },
        {
            question: "Quais são as formas de pagamento?",
            answer: (
                <p>
                    Você pode pagar em até 12x no cartão de crédito ou à vista no Pix com desconto exclusivo.
                </p>
            ),
        },
        {
            question: "Posso trocar meu pedido?",
            answer: (
                <p>
                    Sim! Você tem até 7 dias para solicitar a troca caso o produto não sirva ou apresente defeito.
                </p>
            ),
        },
        {
            question: "A loja possui endereço físico?",
            answer: (
                <p>
                    No momento, trabalhamos apenas com vendas online e entregas em todo o Brasil.
                    Caso queira, você pode entrar em contato para mais informações.
                </p>
            ),
        },
    ];





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

                {/* Overlay mais suave */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10"></div>

                {/* Conteúdo */}
                <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 z-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg mb-3"
                    >
                        {/* Pode colocar um título aqui se quiser */}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-sm sm:text-lg font-medium mb-5 text-gray-200 max-w-md leading-snug"
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
                        className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800
                 text-white font-semibold py-2 px-4 rounded-full text-xs sm:text-sm shadow-md
                 transition-transform transform hover:scale-105"
                    >
                        CONFIRA NOSSO CATÁLOGO
                    </motion.button>
                </div>
            </div>

            {/* Carrossel infinito de textos */}
            <div className="overflow-hidden bg-gray-950 py-3 relative">
                <div className="flex animate-marquee whitespace-nowrap">
                    {/* Lista duplicada */}
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        🚚 <span className="text-white font-semibold">Frete rápido</span> para todo o Brasil
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        ⭐ Qualidade e <span className="text-white font-semibold">preço justo</span>
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        💳 Pague em até <span className="text-white font-semibold">12x</span> nos cartões
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        🔥 <span className="text-white font-semibold">Novos modelos</span> toda semana
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        ⭐ Mais de <span className="text-white font-semibold">mil clientes</span> satisfeitos
                    </span>

                    {/* Duplicado */}
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        🚚 <span className="text-white font-semibold">Frete rápido</span> para todo o Brasil
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        ⭐ Qualidade e <span className="text-white font-semibold">preço justo</span>
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        💳 Pague em até <span className="text-white font-semibold">12x sem juros</span>
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        🔥 <span className="text-white font-semibold">Novos modelos</span> toda semana
                    </span>
                    <span className="mx-8 text-gray-300 font-medium text-sm sm:text-base">
                        ⭐ Mais de <span className="text-white font-semibold">mil clientes</span> satisfeitos
                    </span>
                </div>
            </div>

            <style jsx>{`
  @keyframes marquee {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee {
    display: inline-flex;
    animation: marquee 20s linear infinite;
  }

  @media (max-width: 640px) {
    .animate-marquee {
      animation-duration: 18s;
    }
  }
`}</style>




            {/* Seção de numeração */}
            <div id="numeracao-section" className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 z-10 border border-gray-200"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Escolha sua numeração</h2>
                        <p className="text-gray-500 mt-2 text-sm">Selecione o tamanho para visualizar os produtos disponíveis em estoque.</p>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                        {sizes.map((s) => (
                            <button
                                key={s}
                                onClick={() => choose(s)}
                                disabled={loadingSize !== null}
                                className={`py-2 rounded-lg font-medium text-sm transition-all duration-300
                                        border shadow-sm
                                        ${loadingSize === s ? 'bg-gray-900 text-white border-gray-900 animate-pulse' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}
                                        ${loadingSize !== null && loadingSize !== s ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>


            <div className="mt-10">
                <h3 className="text-lg font-semibold text-center mb-4">O que dizem nossos clientes</h3>
                <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide">

                    {/* Avaliação 1 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Chegou super rápido e a qualidade é top!"
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Mariana S.</span>
                    </div>

                    {/* Avaliação 2 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Ótimo atendimento, recomendo demais!"
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Rafael P.</span>
                    </div>

                    {/* Avaliação 3 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Muito confortáveis, uso no dia a dia e parecem novos ainda."
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Camila R.</span>
                    </div>

                    {/* Avaliação 4 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Superou minhas expectativas, material excelente!"
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– João V.</span>
                    </div>

                    {/* Avaliação 5 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Atendimento rápido no WhatsApp, ganhei confiança na hora."
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Fernanda L.</span>
                    </div>

                    {/* Avaliação 6 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Atendimento top demais 👏"
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Diego M.</span>
                    </div>

                    {/* Avaliação 7 */}
                    <div className="bg-white shadow rounded-xl p-4 min-w-[200px]">
                        <p className="text-sm text-gray-600 italic">
                            "Minha Loja Favorita"
                        </p>
                        <span className="text-xs font-semibold text-gray-800">– Juliana A.</span>
                    </div>

                </div>
            </div>


            {/* FAQ Accordion Super Clean */}
            <div className="mt-20 max-w-3xl mx-auto px-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                    Dúvidas frequentes
                </h3>

                <div className="divide-y divide-gray-200 border border-gray-100 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm">
                    {faqs.map((faq, i) => (
                        <div key={i} className="overflow-hidden">
                            {/* Cabeçalho */}
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex justify-between items-center py-5 px-6 text-left group"
                            >
                                <span className="font-medium text-gray-800 text-base sm:text-lg group-hover:text-gray-900 transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-green-500" : "group-hover:text-gray-600"
                                        }`}
                                />
                            </button>

                            {/* Resposta */}
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-5 text-gray-600 text-sm sm:text-base"
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

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
                        className="fixed inset-0 flex items-center justify-center
                 bg-black/40 backdrop-blur-sm z-50"
                    >
                        {/* Card sólido central */}
                        <motion.div
                            className="w-80 max-w-[90%] p-8 rounded-3xl
                   bg-white shadow-2xl border border-gray-200
                   flex flex-col items-center justify-center"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                            {/* Spinner */}
                            <motion.div
                                className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full mb-6"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            />

                            {/* Mensagem dinâmica */}
                            <motion.p
                                key={loadingMessageIndex}
                                className="text-gray-900 text-center text-base font-semibold px-2"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {messages[loadingMessageIndex]}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>




            <footer className="mt-20 bg-gray-950 text-gray-300">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10">

                    {/* Logo */}
                    <div>
                        <img src={LogoImage} alt="Calcis" className="h-8 sm:h-9" />
                    </div>

                    {/* Links rápidos */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Links rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#numeracao-section" className="hover:text-white transition">Catálogo</a></li>
                            <li><a href="#faq" className="hover:text-white transition">Dúvidas frequentes</a></li>
                            <li><a href="#" className="hover:text-white transition">Política de Troca</a></li>
                            <li><a href="#" className="hover:text-white transition">Contato</a></li>
                        </ul>
                    </div>

                    {/* Redes sociais */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Siga-nos</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/calcis_/" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition text-white">
                                <FaInstagram size={16} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61550662895654" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition text-white">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="https://wa.me/5545988190147" target="_blank" rel="noreferrer"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition text-white">
                                <FaWhatsapp size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Créditos */}
                <div className="border-t border-gray-800 mt-8 py-4 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} Calcis. Todos os direitos reservados.
                </div>
            </footer>


        </div>
    )
}
