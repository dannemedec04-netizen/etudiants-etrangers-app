import { Link } from "react-router-dom";
import "./Home.css";

const CARDS = [
  {
    to: "/formations",
    title: "Écoles & formations",
    description: "Cherchez une formation par filière, ville ou type (alternance, stage, initiale).",
  },
  {
    to: "/offres",
    title: "Offres d'entreprises",
    description: "Parcourez les offres de stage et d'alternance disponibles par filière.",
  },
  {
    to: "/checklist",
    title: "Checklist administrative",
    description: "Suivez vos démarches : titre de séjour, aides, droit au travail.",
  },
  {
    to: "/aides",
    title: "Aides disponibles",
    description: "Consultez les aides (CAF, bourses, santé...) auxquelles vous pouvez avoir droit.",
  },
  {
    to: "/chat",
    title: "Assistant",
    description: "Posez vos questions administratives ou éducatives à l'assistant.",
  },
];

export default function Home() {
  return (
    <div className="page">
      <h1>Bienvenue</h1>
      <p className="subtitle">
        La plateforme d'accompagnement éducatif et administratif pour les étudiants étrangers en
        France. Trouvez une formation, une offre, suivez vos démarches et consultez les aides
        disponibles.
      </p>
      <div className="home-grid">
        {CARDS.map((card) => (
          <Link key={card.to} to={card.to} className="home-card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
