import { useRef, useState, useEffect } from "react";

export default function VideoWidget({ produto, videoUrl, gifUrl }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showCard, setShowCard] = useState(false);

  // Atualiza progresso (fallback caso queira tempo real)
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

  // Mostra o card após 8 segundos do vídeo
  useEffect(() => {
    let timer;
    if (open) {
      setShowCard(false); // resetar antes
      timer = setTimeout(() => {
        setShowCard(true);
      }, 8000); // 8 segundos
    }
    return () => clearTimeout(timer);
  }, [open, videoUrl]);

  return (
    <>
      {/* Botão fixo com preview */}
      {gifUrl && (
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full overflow-hidden shadow-lg border border-white"
        >
          <img
            src={gifUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[2147483647]">
          {/* Barra de progresso */}
          <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/30 rounded overflow-hidden">
            <div
              ref={progressRef}
              className="h-full w-0 bg-white rounded-sm transition-all"
            />
          </div>

          {/* Vídeo principal */}
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-cover"
            onEnded={() => setOpen(false)}
          />

          {/* Card do produto com fade-in de baixo pra cima */}
          {showCard && (
            <div
              className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[320px] flex justify-between items-center gap-4 p-3 
              rounded-2xl bg-black/70 backdrop-blur-md text-white shadow-lg 
              opacity-0 translate-y-6 animate-[fadeUp_0.6s_ease-out_forwards]"
            >
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
          )}

          {/* Fechar (sempre acima de tudo) */}
          <div
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer z-50"
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
      )}

      {/* Keyframes Tailwind custom */}
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
