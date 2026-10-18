"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  "/casal/casal.jpg",
  "/casal/casal 2.jpg",
  "/casal/casal 3.jpg"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  const handleScrollToGifts = () => {
    const el = document.getElementById("presentes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="w-full max-w-[1200px] mx-auto p-[clamp(1.5rem,4vw,2.5rem)_clamp(1rem,3vw,2rem)]">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center bg-[var(--color-bg-card)] rounded-[24px] p-6 md:p-10 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
        
        {/* CARROSSEL */}
        <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-[4/4.5] overflow-hidden rounded-[16px] bg-[var(--color-secondary)]">
          {IMAGES.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Foto do casal ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
          
          {/* Navegação Manual */}
          <button 
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 text-[var(--color-text)] hover:bg-white transition-colors"
            aria-label="Imagem anterior"
          >
            &#10094;
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 text-[var(--color-text)] hover:bg-white transition-colors"
            aria-label="Próxima imagem"
          >
            &#10095;
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2.5">
            {IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* TEXTO */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.15em] text-[var(--color-accent)] uppercase mb-4 bg-[var(--color-secondary)] px-4 py-1.5 rounded-full">
            Chá de Casa Nova
          </span>
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-bold text-[var(--color-text)] leading-tight mb-6">
            Raphael & Karolaine
          </h1>
          
          <div className="text-[var(--color-text-muted)] text-[0.95rem] md:text-[1.05rem] leading-[1.75] space-y-4 mb-8">
            <p className="font-semibold text-[var(--color-text)] text-[1.1rem]">
              Nossa casa está de portas abertas! 🏡❤️
            </p>
            <p>
              Um novo lar está nascendo e, junto com ele, muitos sonhos, planos e desejos.
            </p>
            <p>
              Agora chegou a parte mais gostosa: preencher cada cantinho com carinho e transformar essa casa em um verdadeiro lar.
            </p>
            <p>
              Criamos este espaço para compartilhar esse momento com vocês e, para quem desejar nos presentear, preparamos uma lista com itens que vão nos ajudar a deixar nossa casa ainda mais aconchegante.
            </p>
            <p>
              Mais do que qualquer presente, o que realmente importa é ter vocês fazendo parte desse momento tão especial.
            </p>
            <p className="font-semibold text-[var(--color-text)] italic pt-2">
              Obrigado por celebrar essa nova fase conosco! 🥰
            </p>
          </div>

          <button 
            onClick={handleScrollToGifts}
            className="btn-primary"
            style={{ width: "auto", padding: "0.8rem 2.5rem", fontSize: "1rem" }}
          >
            Ver lista de presentes
          </button>
        </div>
      </div>
    </header>
  );
}
