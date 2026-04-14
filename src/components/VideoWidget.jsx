import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VideoWidget({ produto, videoUrl, gifUrl }) {
    const videoRef = useRef(null);
    const progressRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [muted, setMuted] = useState(false);
    const [showCard, setShowCard] = useState(false);

    // Atualiza progresso
    useEffect(() => {
        let interval;
        if (open && videoRef.current) {
            interval = setInterval(() => {
                const video = videoRef.current;
                if (video && video.duration && progressRef.current) {
                    progressRef.current.style.width =
                        (video.currentTime / video.duration) * 100 + "%";
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [open]);

    // Controle de tempo do card (aparece + some)
    useEffect(() => {
        let interval;
        let hideTimeout;

        if (open && videoRef.current) {
            setShowCard(false);

            interval = setInterval(() => {
                const video = videoRef.current;

                if (video.currentTime > 4) { // aparece com 2s
                    setShowCard(true);
                    clearInterval(interval);

                    // some após 6s visível
                    hideTimeout = setTimeout(() => {
                        setShowCard(false);
                    }, 8000);
                }
            }, 200);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(hideTimeout);
        };
    }, [open]);

    // Travar scroll da página quando o modal abre
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Modal JSX
    const modal = (
        <div className="fixed top-0 left-0 w-[100vw] h-[100dvh] bg-black z-[2147483647] flex items-center justify-center">
            {/* Barra de progresso */}
            <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/30 rounded overflow-hidden z-50">
                <div
                    ref={progressRef}
                    className="h-full w-0 bg-white transition-all"
                />
            </div>

            {/* Vídeo fullscreen */}
            <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                playsInline
                muted={muted}
                className="w-full h-full object-cover"
            />

            {/* Card com animação suave */}
            <div
                className={`absolute bottom-[110px] left-1/2 -translate-x-1/2 transition-all duration-500 z-50
                ${showCard
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6 pointer-events-none"
                    }`}
            >
                <div className="w-[350px] flex items-center justify-between gap-3 p-[10px] rounded-[20px] bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-2xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 cursor-pointer">

                    {/* Glow */}
                    <div className="absolute inset-0 rounded-[20px] bg-white/5 blur-xl opacity-20 pointer-events-none"></div>

                    {/* Conteúdo */}
                    <div className="relative flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={produto.imagemUrl}
                                alt={produto.nome}
                                className="w-[64px] h-[64px] rounded-xl object-cover"
                            />
                            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-20"></div>
                        </div>

                        <div className="flex flex-col leading-tight">
                            <div className="text-[15px] font-semibold line-clamp-1 tracking-tight">
                                {produto.nome}
                            </div>

                            <div className="flex items-center gap-2 mt-[2px]">
                                <span className="text-[17px] font-bold">
                                    R$ {produto.preco?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão fechar */}
            <div
                className="absolute top-5 right-5 text-white text-3xl cursor-pointer z-[60]"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                }}
            >
                ✕
            </div>

            {/* Botão som */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setMuted(!muted);
                }}
                className="absolute bottom-5 right-5 bg-black/50 rounded-full p-2 text-white cursor-pointer z-50"
            >
                {muted ? "🔇" : "🔊"}
            </div>
        </div>
    );

    return (
        <>
            {/* Botão com GIF */}
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

                    {/* Texto girando */}
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

            {/* Portal */}
            {open && createPortal(modal, document.body)}
        </>
    );
}