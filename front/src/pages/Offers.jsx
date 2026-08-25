import { useEffect, useState } from "react";
import { getJobOffers } from "../api/education";

const FIELDS = ["Informatique", "Commerce", "Droit", "Santé"];
const TYPES = [
  { value: "alternance", label: "Alternance" },
  { value: "stage", label: "Stage" },
];

export default function Offers() {
  const [field, setField] = useState("");
  const [type, setType] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJobOffers({ field, type })
      .then(setOffers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [field, type]);

  return (
    <div className="page">
      <h1>Offres d'entreprises</h1>
      <p className="subtitle">
        Parcourez les offres de stage et d'alternance proposées par les entreprises partenaires.
      </p>

      <div className="filters">
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">Toutes les filières</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">Impossible de charger les offres : {error}</div>}

      {!error && !loading && offers.length === 0 && (
        <div className="empty-state">Aucune offre ne correspond à ces critères.</div>
      )}

      <div className="results-grid">
        {offers.map((offer) => (
          <article key={offer.id} className="card">
            <span className="tag">{offer.field}</span>
            <span className="tag">{offer.type}</span>
            <h3>{offer.title}</h3>
            <p><strong>{offer.company}</strong>{offer.location ? ` — ${offer.location}` : ""}</p>
            <p>{offer.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
