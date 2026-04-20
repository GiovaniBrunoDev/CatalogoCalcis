import { useEffect, useRef, useState } from "react";

export default function ReelsViewer({ produtos, onClose }) {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [ready, setReady] = useState(false);

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

            if (index === currentIndex) {
                video.muted = muted || !hasInteracted;
                video.play().catch(() => { });
            } else {
                video.pause();
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
                    {produtos.map((produto, index) => {

                        if (Math.abs(index - currentIndex) > 1) return null;

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
                                    preload={index === currentIndex + 1 ? "auto" : "metadata"}
                                    onLoadedData={() => {
                                        if (index === 0) setReady(true);
                                    }}
                                />

                                {/* GRADIENT */}
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10" />

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
                                                    <span className="text-[10px] text-white/60">
                                                        Disponível:
                                                    </span>

                                                    {variacoesDisponiveis?.slice(0, 5).map(v => (
                                                        <span
                                                            key={v.numeracao}
                                                            className="px-2 py-[1px] text-[10px] bg-white/20 rounded-full"
                                                        >
                                                            {v.numeracao}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA SEPARADO (MUITO MAIS FORTE VISUALMENTE) */}
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
            block text-center 
            bg-green-500 hover:bg-green-600
            transition-all duration-300
            py-3 rounded-full 
            text-[14px] font-semibold
            shadow-[0_6px_20px_rgba(0,0,0,0.4)]
        "
                                    >
                                        Comprar agora
                                    </a>
                                </div>

                                {/* SOM ICON */}
                                <div className="absolute bottom-6 right-4 z-30 bg-black/50 p-3 rounded-full text-white">
                                    {muted ? "🔇" : "🔊"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}