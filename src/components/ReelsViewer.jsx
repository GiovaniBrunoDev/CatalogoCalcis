import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function ReelsViewer({ produtos, onClose }) {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [ready, setReady] = useState(false);
    const [produtosRandom, setProdutosRandom] = useState([]);


    const produtosComFinal = [...produtosRandom, { id: "end" }];


    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        setProdutosRandom(shuffleArray(produtos));
    }, [produtos]);

    // 🔒 trava scroll do fundo
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "");
    }, []);

    // 🎯 detectar vídeo ativo
    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const index = Math.round(el.scrollTop / window.innerHeight);
        setCurrentIndex(index);
    };

    // 🎬 play/pause
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            const isCurrent = index === currentIndex;
            const isNear =
                index === currentIndex ||
                index === currentIndex + 1 ||
                index === currentIndex - 1;

            // 🎬 comportamento atual (mantido)
            if (isCurrent) {
                video.muted = muted || !hasInteracted;
                video.play().catch(() => { });
            } else {
                video.pause();
            }

            // 🔥 RESET SEGURO (sem quebrar)
            if (!isNear) {
                // salva src original se ainda não salvou
                if (!video.dataset.originalSrc) {
                    video.dataset.originalSrc = video.currentSrc || video.src;
                }

                // limpa memória com delay leve (evita conflito com play/pause)
                setTimeout(() => {
                    if (video && video !== videoRefs.current[currentIndex]) {
                        video.removeAttribute("src");
                        video.load();
                    }
                }, 300);
            } else {
                // 🔥 restaura vídeo se necessário
                if (!video.src && video.dataset.originalSrc) {
                    video.src = video.dataset.originalSrc;
                    video.load();
                }
            }
        });
    }, [currentIndex, muted, hasInteracted]);

    // 🎯 card timing
    useEffect(() => {
        let interval;

        const video = videoRefs.current[currentIndex];
        if (video) {
            setShowCard(false);

            interval = setInterval(() => {
                if (video.duration && video.currentTime / video.duration > 0.25) {
                    setShowCard(true);
                    clearInterval(interval);
                }
            }, 200);
        }

        return () => clearInterval(interval);
    }, [currentIndex]);

    useEffect(() => {
        if (!videoRefs.current[0] || currentIndex !== 0) return;

        const video = videoRefs.current[0];
        const el = containerRef.current;

        let triggered = false;

        const checkTime = () => {
            if (!video.duration) return;

            const progress = video.currentTime / video.duration;

            if (progress > 0.85 && !triggered) {
                triggered = true;

                // 🔥 sobe levemente o feed (mostra próximo vídeo)
                el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
                el.style.transform = "translateY(-70px)";

                // 🔥 cria sensação de “preview do próximo”
                setTimeout(() => {
                    el.style.transform = "translateY(-20px)";
                }, 250);

                setTimeout(() => {
                    el.style.transform = "translateY(0px)";
                }, 600);
            }
        };

        const interval = setInterval(checkTime, 100);

        return () => clearInterval(interval);
    }, [currentIndex]);

    // 🔥 TAP INTELIGENTE
    const handleTap = (e) => {
        const el = containerRef.current;
        if (!el) return;

        const width = window.innerWidth;
        const clickX = e.clientX;

        const video = videoRefs.current[currentIndex];
        if (!video) return;


        // 🔊 CENTRO → SOM
        if (!hasInteracted) {
            setHasInteracted(true);
            setMuted(false);

            video.muted = false;
            video.play().catch(() => { });
            return;
        }

        setMuted((prev) => {
            const newValue = !prev;
            video.muted = newValue;
            return newValue;
        });
    };

    // força carregamento do próximo vídeo para evitar delay
    useEffect(() => {
        const nextVideo = videoRefs.current[currentIndex + 1];

        if (nextVideo) {
            nextVideo.load(); // força buffer antecipado
        }
    }, [currentIndex]);

    return (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center animate-fadeIn">

            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* LOADER */}
            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}

            {/* CONTAINER */}
            <div className="
                    relative z-10
                    w-screen h-[100dvh]
                    md:h-[99vh]
                    md:aspect-[9/16]
                    md:max-w-[490px]
                    md:rounded-[30px]
                    md:overflow-hidden
                ">

                {/* FECHAR */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-white text-3xl"
                >
                    ✕
                </button>

                {/* SCROLL */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar will-change-transform"
                >
                    {produtosComFinal.map((produto, index) => {

                        if (produto.id === "end") {
                            return (
                                <div className="
  h-full w-full snap-start 
  flex items-center justify-center
  bg-gradient-to-b from-black via-[#050505] to-zinc-900
  text-white
  relative overflow-hidden
">

                                    {/* 🔥 Glow de fundo */}
                                    <div className="
    absolute w-[300px] h-[300px] 
    bg-white/5 blur-3xl rounded-full
    top-[-80px] left-1/2 -translate-x-1/2
  " />

                                    <div className="relative text-center px-6 max-w-xs w-full">


                                        {/* INFO */}
                                        <p className="
      text-[11px] 
      text-white/40 
      mb-5 
      tracking-[0.2em] 
      uppercase
    ">
                                            Sem mais vídeos por aqui 👀 
                                        </p>

                                        {/* Ícone premium */}
                                        <div className="mb-6 flex justify-center">
                                            <div className="
        w-16 h-16 
        rounded-2xl
        
        bg-gradient-to-b from-white/15 to-white/5
        backdrop-blur-xl
        
        border border-white/10
        
        flex items-center justify-center
        
        text-2xl
        
        shadow-[0_10px_40px_rgba(255,255,255,0.08)]
      ">
                                                👟
                                            </div>
                                        </div>

                                        {/* Título */}
                                        <h2 className="
      text-[22px] 
      font-semibold 
      mb-2 
      tracking-tight
    ">
                                            Quer ver mais?
                                        </h2>

                                        {/* Sub */}
                                        <p className="
      text-white/60 
      text-[13px] 
      mb-7 
      leading-relaxed
    ">
                                            Selecione sua numeração e veja todos os modelos disponíveis.
                                        </p>

                                        {/* CTA principal */}
                                        <button
                                            onClick={onClose}
                                            className="
        relative w-full
        py-3
        rounded-full
        
        bg-white text-black
        
        font-semibold text-[14px]
        
        transition-all duration-300
        
        active:scale-95
        hover:scale-[1.04]
        
        shadow-[0_10px_35px_rgba(255,255,255,0.18)]
      "
                                        >
                                            Escolher minha numeração
                                        </button>

                                        {/* CTA secundário */}
                                        <button
                                            onClick={() => {
                                                const el = document.querySelector('[data-reels-container]');
                                                if (el) el.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="
        w-full mt-3
        py-2.5
        rounded-full
        
        bg-white/[0.05]
        backdrop-blur-xl
        
        border border-white/10
        
        text-white/80 text-[13px]
        
        transition-all duration-300
        
        hover:bg-white/[0.12]
        active:scale-95
      "
                                        >
                                            Assistir novamente
                                        </button>

                                        {/* LOGO */}
                                        <div className="mt-10 flex flex-col items-center gap-2 opacity-50">

                                            <div className="w-30 h-[10px] bg-white/10" />

                                            <img
                                                src={logo}
                                                alt="Calcis"
                                                className="
      h-8 object-contain
      opacity-80
      transition-all duration-300
      hover:opacity-100 hover:scale-105
    "
                                            />

                                        </div>

                                    </div>


                                </div>

                            );
                        }

                        const isFarAway = Math.abs(index - currentIndex) > 4;

                        if (isFarAway) {
                            return (
                                <div key={produto.id} className="h-full w-full snap-start" />
                            );
                        }

                        const isCurrent = index === currentIndex;
                        const isNext = index === currentIndex + 1;
                        const isPrev = index === currentIndex - 1;

                        const variacoesDisponiveis = produto.variacoes
                            ?.filter(v => Number(v.estoque) > 0)
                            .sort((a, b) => Number(a.numeracao) - Number(b.numeracao))
                            .slice(0, 6);

                        return (
                            <div
                                key={produto.id}
                                onClick={handleTap}
                                className="h-full w-full snap-start relative flex items-center justify-center cursor-pointer"
                            >
                                {/* VIDEO */}
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={produto.videoUrl}
                                    className="w-full h-full object-cover"
                                    loop
                                    playsInline
                                    muted={muted || !hasInteracted}
                                    preload={isCurrent || isNext ? "auto" : "metadata"}
                                    onLoadedData={() => {
                                        if (index === 0) {
                                            const video = videoRefs.current[0];

                                            if (video) {
                                                video.muted = true;
                                                video.play().catch(() => { });
                                            }

                                            setReady(true);
                                        }
                                    }}
                                />

                                {/* GRADIENT 
                                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10" />
*/}
                                {/* CARD CONTEÚDO */}
                                <div
                                    className={`absolute bottom-28 left-4 right-4 z-20 transition-all duration-500
        ${index === currentIndex && showCard
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-6"
                                        }`}
                                >
                                    <div className="
            bg-black/50 backdrop-blur-xl 
            px-4 py-3 rounded-2xl 
            text-white 
            border border-white/10 
            shadow-lg
        ">

                                        <div className="flex gap-3 items-center">
                                            {/* IMAGEM */}
                                            <img
                                                src={produto.imagemUrl}
                                                className="w-14 h-14 rounded-xl object-cover"
                                            />

                                            {/* INFO */}
                                            <div className="flex flex-col flex-1">

                                                {/* NOME */}
                                                <span className="text-[13px] font-semibold line-clamp-1">
                                                    {produto.nome}
                                                </span>

                                                {/* PREÇO (DESTAQUE PRINCIPAL) */}
                                                <span className="text-[16px] font-bold text-white mt-[2px]">
                                                    {produto.preco?.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </span>

                                                {/* TAMANHOS */}
                                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                    <span className="text-[11px] text-white/70 font-medium">
                                                        Disponível:
                                                    </span>

                                                    {variacoesDisponiveis?.slice(0, 5).map(v => (
                                                        <span
                                                            key={v.numeracao}
                                                            className="
                px-2.5 py-[2px]
                text-[11px] font-medium
                
                bg-white/20
                rounded-full
                
                backdrop-blur-sm
            "
                                                        >
                                                            {v.numeracao}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`absolute bottom-10 left-4 right-4 z-30 transition-all duration-500
    ${index === currentIndex && showCard
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-6"
                                        }`}
                                >
                                    <a
                                        href={`https://wa.me/55${produto.whatsapp || "45988190147"}?text=Olá, tenho interesse no produto *${produto.nome}*`}
                                        target="_blank"
                                        className="
            flex items-center justify-center gap-2
            
            bg-white/10 backdrop-blur-md
            border border-white/20
            
            text-white text-[13px] font-medium
            
            py-2.5 rounded-full
            
            transition-all duration-300
            hover:bg-white/20
            
            shadow-md
        "
                                    >
                                        <FaWhatsapp className="text-[15px] text-green-400" />
                                        Comprar
                                    </a>
                                </div>


                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}