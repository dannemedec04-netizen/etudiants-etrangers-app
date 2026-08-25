import { Link } from "react-router-dom";
import {
  IconAid,
  IconBriefcase,
  IconChat,
  IconChecklist,
  IconGraduationCap,
} from "../components/Icons";
import heroPhoto from "../assets/hero-students.jpg";
import "./Home.css";

const CARDS = [
  {
    to: "/formations",
    title: "Écoles & formations",
    description: "Cherchez une formation par filière, ville ou type (alternance, stage, initiale).",
    icon: IconGraduationCap,
    tint: "violet",
  },
  {
    to: "/offres",
    title: "Offres d'entreprises",
    description: "Parcourez les offres de stage et d'alternance disponibles par filière.",
    icon: IconBriefcase,
    tint: "blue",
  },
  {
    to: "/checklist",
    title: "Checklist administrative",
    description: "Suivez vos démarches : titre de séjour, aides, droit au travail.",
    icon: IconChecklist,
    tint: "violet",
  },
  {
    to: "/aides",
    title: "Aides disponibles",
    description: "Consultez les aides (CAF, bourses, santé...) auxquelles vous pouvez avoir droit.",
    icon: IconAid,
    tint: "blue",
  },
  {
    to: "/chat",
    title: "Assistant",
    description: "Posez vos questions administratives ou éducatives à l'assistant.",
    icon: IconChat,
    tint: "violet",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        <img
          src={heroPhoto}
          alt="Groupe d'étudiants échangeant sur un campus"
          className="hero-banner-bg"
        />
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <div className="hero-banner-inner">
            <span className="eyebrow">Étudier &amp; s'installer en France</span>
            <h1>Bienvenue</h1>
            <p className="subtitle">
              La plateforme d'accompagnement éducatif et administratif pour les étudiants
              étrangers en France. Trouvez une formation, une offre, suivez vos démarches et
              consultez les aides disponibles.
            </p>
            <Link to="/formations" className="btn">Trouver une formation</Link>
          </div>
        </div>
      </section>

      <div className="page">
        <div className="home-grid">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to} className="home-card">
                <span className={`home-card-icon tint-${card.tint}`}>
                  <Icon />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
