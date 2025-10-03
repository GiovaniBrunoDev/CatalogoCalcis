// src/components/VideoWidget.jsx
import { useEffect, useRef, useState } from "react";

export default function VideoWidget() {
  const VIDEOS = [
    "https://cdn.storyboost.shop/AQMBllcs8KbVUJNZ25Vg5Ub69_dNTKRU6pp-6wOeHrWsdb-pZwscD0ZY48l0_CRLhVKwS-KaxeL_27iEflGIfHDNRoi_gaHz3E55GdY.mp4",
  ];

  const PRODUCT = {
    img: "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/lojavillaveneza/media/uploads/produtos/foto/mhtnfxmp/img_8985.jpg",
    name: "Calça Feminina",
    price: "R$ 399,90",
    url: "https://minha-loja.com/carrinho",
  };

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const progressRefs = useRef([]);

  // progresso
  useEffect(() => {
    let interval;
    if (open && videoRef.current) {
      interval = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration) {
          const bar = progressRefs.current[currentIndex];
          if (bar) {
            bar.style.width = (video.currentTime / video.duration) * 100 + "%";
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [open, currentIndex]);

  const handlePlay = (index) => {
    setCurrentIndex(index);
    if (videoRef.current) {
      videoRef.current.src = VIDEOS[index];
      videoRef.current.play();
    }
  };

  return (
    <>
      <button
  onClick={() => setOpen(true)}
  className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-md border border-white"
>
  <video
    src={VIDEOS[0]}
    muted
    loop
    autoPlay
    playsInline
    className="w-full h-full object-cover"
  />
</button>


      {/* Label animada */}
      <div className="fixed bottom-[142px] right-[55px] px-4 h-[25px] flex items-center text-white text-[12px] font-semibold rounded-[15px] bg-[#ADC7BB] whitespace-nowrap overflow-hidden z-[9998] transition-all duration-500">
        VÍDEO DO PRODUTO
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientX < rect.width / 2) {
              handlePlay((currentIndex - 1 + VIDEOS.length) % VIDEOS.length);
            } else {
              handlePlay((currentIndex + 1) % VIDEOS.length);
            }
          }}
          className="fixed inset-0 bg-black flex items-center justify-center z-[2147483647]"
        >
          {/* Barra de progresso */}
          <div className="absolute top-2 left-2 right-2 flex gap-1">
            {VIDEOS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[3px] bg-white/30 rounded-sm overflow-hidden"
              >
                <div
                  ref={(el) => (progressRefs.current[i] = el)}
                  className="h-full w-0 bg-white rounded-sm transition-all"
                />
              </div>
            ))}
          </div>

          {/* Vídeo principal */}
          <video
            ref={videoRef}
            src={VIDEOS[currentIndex]}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full object-cover"
            onEnded={() =>
              handlePlay((currentIndex + 1) % VIDEOS.length)
            }
          />

          {/* Card de produto */}
          <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[320px] flex justify-between items-center gap-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white opacity-100 transition-all">
            <div className="flex items-center gap-3">
              <img
                src={PRODUCT.img}
                alt={PRODUCT.name}
                className="w-[60px] h-[60px] rounded-lg object-cover"
              />
              <div>
                <div className="text-[14px] font-semibold leading-tight">
                  {PRODUCT.name}
                </div>
                <div className="text-[14px] opacity-90">{PRODUCT.price}</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = PRODUCT.url;
              }}
              className="bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-[13px] whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>

          {/* Botão fechar */}
          <div
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            ✕
          </div>

          {/* Botões de ação (curtir, comentar, compartilhar, mute) */}
          <div className="absolute right-5 bottom-[80px] flex flex-col gap-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className="text-white"
            >
              {liked ? "❤️" : "🤍"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert("Abrir comentários...");
              }}
              className="text-white"
            >
              💬
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert("Compartilhar...");
              }}
              className="text-white"
            >
              🔗
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMuted(!muted);
              }}
              className="text-white"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
