import { useRef, useState, useEffect } from "react";

export default function VideoWidget({ produto, videoUrl, gifUrl }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);

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

  return (
    <>
      {/* Botão fixo com preview */}
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

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-[2147483647]"
        >
          {/* Barra de progresso */}
          <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/30 rounded-sm overflow-hidden">
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

          {/* Card do produto */}
          <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[320px] flex justify-between items-center gap-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white">
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
                  R$ {produto.preco.toFixed(2)}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/carrinho"; // ajuste depois
              }}
              className="bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-[13px]"
            >
              Adicionar
            </button>
          </div>

          {/* Fechar */}
          <div
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            ✕
          </div>
        </div>
      )}
    </>
  );
}
