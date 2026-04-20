import { useEffect, useRef, useState } from "react";

export default function ReelItem({ produto, active, preload }) {
    const videoRef = useRef(null);

    const [muted, setMuted] = useState(true);
    const [showCard, setShowCard] = useState(false);

    // 👟 tamanhos disponíveis (igual seu sistema)
    const variacoesDisponiveis = produto.variacoes
        ?.filter(v => Number(v.estoque) > 0)
        .sort((a, b) => Number(a.numeracao) - Number(b.numeracao))
        .slice(0, 6);

    // 🎬 play automático
    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        if (active) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [active]);

    // 🎯 card baseado em % do vídeo
    useEffect(() => {
        let interval;

        if (active && videoRef.current) {
            setShowCard(false);

            interval = setInterval(() => {
                const v = videoRef.current;

                if (v.duration && v.currentTime / v.duration > 0.25) {
                    setShowCard(true);
                    clearInterval(interval);
                }
            }, 200);
        }

        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center">

            {/* 🎬 VÍDEO */}
            <video
                ref={videoRef}
                src={produto.videoUrl}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={muted}
                preload={preload ? "auto" : "metadata"}
            />

            {/* 🔥 GRADIENT */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10" />

            {/* 💰 CARD (USANDO SEU PADRÃO) */}
            <div
                className={`absolute bottom-24 left-4 right-4 z-20 transition-all duration-500
                ${showCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
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

                    {/* 🟢 CTA WHATSAPP (igual seu sistema) */}
                    <a
                        href={`https://wa.me/55${produto.whatsapp || "45988190147"}?text=Olá, tenho interesse no produto *${produto.nome}*`}
                        className="mt-3 block text-center bg-green-500 hover:bg-green-600 transition py-2 rounded-full font-semibold"
                        target="_blank"
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
}