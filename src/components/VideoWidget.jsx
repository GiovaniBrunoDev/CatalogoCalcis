import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VideoWidget({ produto, videoUrl, gifUrl }) {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const scrollYRef = useRef(0);

    const [open, setOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [showCard, setShowCard] = useState(false);

    const variacoesDisponiveis = produto.variacoes
        ?.filter(v => Number(v.estoque) > 0)
        .sort((a, b) => Number(a.numeracao) - Number(b.numeracao));


    const hideMobileUI = () => {
    const y = window.scrollY;

    // força scroll real (não só 1px)
    window.scrollTo({
        top: y + 100,
        behavior: "instant"
    });
};

    // 🔥 Progresso (mais performático com requestAnimationFrame)
    useEffect(() => {
        let raf;

        const updateProgress = () => {
            const video = videoRef.current;

            if (video && video.duration && progressRef.current) {
                progressRef.current.style.width =
                    (video.currentTime / video.duration) * 100 + "%";
            }

            raf = requestAnimationFrame(updateProgress);
        };

        if (open) {
            raf = requestAnimationFrame(updateProgress);
        }

        return () => cancelAnimationFrame(raf);
    }, [open]);

    // 🎯 Controle do card
    useEffect(() => {
        let interval;
        let timeout;

        if (open && videoRef.current) {
            setShowCard(false);

            interval = setInterval(() => {
                const video = videoRef.current;

                if (video.currentTime > 4) {
                    setShowCard(true);
                    clearInterval(interval);

                    timeout = setTimeout(() => {
                        setShowCard(false);
                    }, 8000);
                }
            }, 200);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [open]);

    // 🔒 Travar scroll + esconder barras mobile
    useEffect(() => {
    if (open) {
        scrollYRef.current = window.scrollY;

        hideMobileUI();

        // 👇 tempo REAL para o browser esconder a barra
        const timeout = setTimeout(() => {
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
        }, 180); // 🔥 esse delay é o segredo

        return () => clearTimeout(timeout);
    } else {
        const scrollY = scrollYRef.current;

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";

        window.scrollTo(0, scrollY);
    }
}, [open]);

    const modal = (
        <div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center"
            style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)"
            }}
        >
            {/* Container responsivo */}
            <div
                className="
        relative flex items-center justify-center
            
        w-screen h-[100dvh]     /* MOBILE fullscreen */

       md:h-[99dvh]           /* DESKTOP quase full */
        md:aspect-[9/16]        /* mantém proporção */
        md:max-w-[500px]        /* opcional: deixa um pouco maior */
    "
            >
                {/* 🔥 Glow atrás */}
                <div className="absolute -inset-10 bg-black blur-3xl opacity-70 pointer-events-none z-0"></div>


                {/* Barra de progresso */}
                <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/30 rounded overflow-hidden z-50">
                    <div
                        ref={progressRef}
                        className="h-full w-0 bg-white"
                    />
                </div>

                {/* Vídeo */}
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={videoUrl}
                    autoPlay
                    playsInline
                    muted={muted}
                    className="
        w-full h-full object-cover

        rounded-none        /* MOBILE */
        md:rounded-[20px]   /* DESKTOP */
        
        relative z-10
    "
                    onEnded={() => setOpen(false)}
                />

                {/* Card */}
                <div
                    className={`absolute bottom-[80px] left-1/2 -translate-x-1/2 transition-all duration-500 z-50
                ${showCard
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-6 pointer-events-none"
                        }`}
                >
                    <div className="w-[350px] max-w-[90vw] flex items-center gap-3 p-[10px] rounded-[20px] bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-2xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10">

                        <div className="flex items-center gap-3">
                            <img
                                src={produto.imagemUrl}
                                alt={produto.nome}
                                className="w-[64px] h-[64px] rounded-xl object-cover"
                            />

                            <div className="flex flex-col leading-tight">

                                <div className="text-[15px] font-semibold line-clamp-1">
                                    {produto.nome}
                                </div>

                                <span className="text-[17px] font-bold">
                                    R$ {produto.preco?.toFixed(2)}
                                </span>

                                {/* 👇 NUMERAÇÕES DISPONÍVEIS */}
                                {variacoesDisponiveis?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {variacoesDisponiveis.slice(0, 6).map(v => (
                                            <span
                                                key={v.numeracao}
                                                className="px-2 py-[2px] text-[11px] bg-white/20 rounded-full"
                                            >
                                                {v.numeracao}
                                            </span>
                                        ))}

                                        {variacoesDisponiveis.length > 6 && (
                                            <span className="text-[11px] text-white/70">
                                                +{variacoesDisponiveis.length - 6}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fechar */}
                <div
                    className="absolute top-4 right-4 text-white text-3xl z-[60] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                    }}
                >
                    ✕
                </div>

                {/* Som */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setMuted(!muted);
                    }}
                    className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 text-white z-50 cursor-pointer"
                >
                    {muted ? "🔇" : "🔊"}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {gifUrl && (
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="w-14 h-14 rounded-full overflow-hidden shadow-lg border border-white z-10"
                    >
                        <img
                            src={gifUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </button>

                    <svg
                        viewBox="0 0 100 100"
                        className="absolute w-full h-full animate-spin-slow pointer-events-none"
                    >
                        <defs>
                            <path
                                id="circlePath"
                                d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                            />
                        </defs>
                        <text
                            fill="rgba(255,255,255,0.7)"
                            fontSize="13"
                            fontWeight="600"
                            letterSpacing="4"
                        >
                            <textPath xlinkHref="#circlePath">
                                • VÍDEO • VÍDEO • VÍDEO
                            </textPath>
                        </text>
                    </svg>
                </div>
            )}

            {open && createPortal(modal, document.body)}
        </>
    );
}