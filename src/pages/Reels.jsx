import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReelItem from "../components/ReelItem";

export default function Reels() {
    const [produtos, setProdutos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const containerRef = useRef(null);

    useEffect(() => {
        async function load() {
            try {
                const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

                // 🔥 pega produtos COM vídeo
                const res = await axios.get(`${base}/produtos`);

                const comVideo = (res.data || []).filter(p => p.videoUrl);

                setProdutos(comVideo);
            } catch (err) {
                console.error(err);
            }
        }

        load();
    }, []);

    // 🎯 detectar qual vídeo está ativo
    useEffect(() => {
        const el = containerRef.current;

        const handleScroll = () => {
            const index = Math.round(el.scrollTop / window.innerHeight);
            setCurrentIndex(index);
        };

        el.addEventListener("scroll", handleScroll);

        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory bg-black"
        >
            {produtos.map((produto, index) => (
                <div key={produto.id} className="h-[99dvh] snap-start">
                    <ReelItem
                        produto={produto}
                        active={index === currentIndex}
                        preload={index === currentIndex + 1}
                    />
                </div>
            ))}
        </div>
    );
}