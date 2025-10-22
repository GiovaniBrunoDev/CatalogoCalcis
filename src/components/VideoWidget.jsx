import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VideoWidget({ produto, videoUrl, gifUrl }) {
    const videoRef = useRef(null);
    const progressRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [muted, setMuted] = useState(false);

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
        <div className="fixed inset-0 w-screen h-screen bg-black z-[2147483647] flex items-center justify-center">
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
                className="w-screen h-screen object-cover"
                onEnded={() => setOpen(false)}
            />

            {/* Card do produto */}
            <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[320px] flex justify-between items-center gap-4 p-3 rounded-2xl bg-black/70 backdrop-blur-md text-white shadow-lg hover:scale-[1.02] transition z-50">
                <div className="flex items-center gap-3">
                    <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="w-[60px] h-[60px] rounded-lg object-cover"
                    />
                    <div>
                        <div className="text-[14px] font-semibold leading-tight">
                            {produto.nome}
                        </div>
                        <div className="text-[14px] opacity-90">
                            R$ {produto.preco?.toFixed(2)}
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

            {/* Botão som/mute */}
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
            {/* Botão fixo com preview e texto curvado */}
            {gifUrl && (
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="w-14 h-14 rounded-full overflow-hidden shadow-lg border border-white z-10"
                    >
                        <img
                            src={gifUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    {/* Texto curvado discreto */}
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

            {/* Renderiza modal fora da div principal */}
            {open && createPortal(modal, document.body)}
        </>
    );
}
