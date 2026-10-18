interface EventInfoProps {
  date?: string;
  time?: string;
  locationName?: string;
  locationCity?: string;
  description?: string;
}

export default function EventInfo({
  date = "Domingo, 20 de dezembro",
  time = "A partir das 13h",
  locationName = "Espaço Momentos em Família",
  locationCity = "R. C Pr, 1 - Quintas do Picuaia, Lauro de Freitas, 42700-000",
  description = "Um almoço especial, preparado com carinho para reunir família e amigos em um momento de celebração."
}: EventInfoProps = {}) {
  const eventDetails = {
    date,
    time,
    locationName,
    locationCity,
    description
  };

  return (
    <section className="w-full max-w-[1050px] mx-auto px-[clamp(1rem,3vw,2rem)] py-12 md:py-16">
      {/* Título da seção */}
      <div className="text-center mb-12">
        <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] font-bold text-[var(--color-text)] mb-4">
          Um dia para celebrar nosso novo lar
        </h2>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-[0.95rem] md:text-[1.05rem] leading-[1.6]">
          Preparamos um almoço especial para celebrar esse novo capítulo das nossas vidas ao lado de pessoas queridas.
        </p>
      </div>

      {/* Blocos informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
        {/* QUANDO */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[20px] p-8 text-center shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-300">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-[0.75rem] font-bold tracking-[0.12em] text-[var(--color-accent)] uppercase mb-3">
            Quando
          </h3>
          <p className="text-[var(--color-text)] font-medium text-[1.05rem]">{eventDetails.date}</p>
          <p className="text-[var(--color-text-muted)] text-[0.95rem] mt-1">{eventDetails.time}</p>
        </div>

        {/* ONDE */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[20px] p-8 text-center shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-300">
          <div className="text-3xl mb-4">📍</div>
          <h3 className="text-[0.75rem] font-bold tracking-[0.12em] text-[var(--color-accent)] uppercase mb-3">
            Onde
          </h3>
          <p className="text-[var(--color-text)] font-medium text-[1.05rem]">{eventDetails.locationName}</p>
          <p className="text-[var(--color-text-muted)] text-[0.95rem] mt-1">{eventDetails.locationCity}</p>
        </div>

        {/* O QUE */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[20px] p-8 text-center shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <div className="text-3xl mb-4">🍽️</div>
          <h3 className="text-[0.75rem] font-bold tracking-[0.12em] text-[var(--color-accent)] uppercase mb-3">
            O que estamos preparando
          </h3>
          <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed">
            {eventDetails.description}
          </p>
        </div>
      </div>

      {/* Aviso Presentes */}
      <div className="bg-[var(--color-secondary)] rounded-[20px] p-6 md:p-8 text-center max-w-3xl mx-auto">
        <h4 className="font-semibold text-[var(--color-text)] mb-2 text-[1.05rem]">Não poderá estar presente?</h4>
        <p className="text-[var(--color-text-muted)] text-[0.95rem] md:text-[1rem] leading-[1.6]">
          Não tem problema! Você também pode escolher um presente da nossa lista e enviá-lo diretamente para o nosso endereço.
        </p>
      </div>
    </section>
  );
}
