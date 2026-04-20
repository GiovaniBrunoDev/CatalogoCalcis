import { useEffect, useRef, useState } from "react";

export default function ReelsViewer({ produtos, onClose }) {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const [showCard, setShowCard] = useState(false);

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

    // 🎬 controlar play/pause
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            if (index === currentIndex) {
                video.currentTime = 0;
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        });
    }, [currentIndex]);

    // 🎯 controlar card baseado no tempo do vídeo
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

    return (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center">

            {/* 🔥 BACKDROP */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* 🔥 CONTAINER RESPONSIVO */}
            <div
                className="
        relative z-10

        w-screen h-[100dvh]        /* MOBILE fullscreen */

        md:h-[99vh]                /* DESKTOP */
        md:aspect-[9/16]          /* proporção */
        md:max-w-[490px]          /* largura limite */
        md:rounded-[30px]         /* borda só no desktop */
        md:overflow-hidden
        "
            >

                {/* ❌ FECHAR */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-white text-3xl"
                >
                    ✕
                </button>

                {/* 📱 CONTAINER */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
                >
                    {produtos.map((produto, index) => {
                        const variacoesDisponiveis = produto.variacoes
                            ?.filter(v => Number(v.estoque) > 0)
                            .sort((a, b) => Number(a.numeracao) - Number(b.numeracao))
                            .slice(0, 6);

                        return (
                            <div
                                key={produto.id}
                                className="h-full w-full snap-start relative flex items-center justify-center"
                            >
                                {/* 🎬 VIDEO */}
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={produto.videoUrl}
                                    className="w-full h-full object-cover"
                                    loop
                                    playsInline
                                    muted={muted}
                                    preload={index === currentIndex + 1 ? "auto" : "metadata"}
                                />

                                {/* 🌑 GRADIENT */}
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10" />

                                {/* 🧠 CARD */}
                                <div
                                    className={`absolute bottom-24 left-4 right-4 z-20 transition-all duration-500
                                ${index === currentIndex && showCard
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-6"
                                        }`}
                                >
                                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl text-white border border-white/10 shadow-xl">

                                        <div className="flex gap-3">
                                            <img
                                                src={produto.imagemUrl}
                                                className="w-16 h-16 rounded-xl object-cover"
                                            />

                                            <div className="flex flex-col leading-tight">
                                                <span className="text-sm font-semibold line-clamp-1">
                                                    {produto.nome}
                                                </span>

                                                <span className="text-lg font-bold">
                                                    {produto.preco?.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </span>

                                                {/* 👟 TAMANHOS */}
                                                <div className="flex gap-1 flex-wrap mt-1">
                                                    {variacoesDisponiveis?.map(v => (
                                                        <span
                                                            key={v.numeracao}
                                                            className="px-2 py-[2px] text-[11px] bg-white/20 rounded-full"
                                                        >
                                                            {v.numeracao}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🟢 CTA */}
                                        <a
                                            href={`https://wa.me/55${produto.whatsapp || "45988190147"}?text=Olá, tenho interesse no produto *${produto.nome}*`}
                                            target="_blank"
                                            className="mt-3 block text-center bg-green-500 hover:bg-green-600 transition py-2 rounded-full font-semibold"
                                        >
                                            Comprar agora
                                        </a>
                                    </div>
                                </div>

                                {/* 🔊 SOM */}
                                <div
                                    onClick={() => setMuted(!muted)}
                                    className="absolute bottom-6 right-4 z-30 bg-black/50 p-3 rounded-full text-white"
                                >
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