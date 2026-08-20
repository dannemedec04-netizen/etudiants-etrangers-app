import { useEffect, useState } from "react";
import { getFormations } from "../api/education";

const FIELDS = ["Informatique", "Commerce", "Droit"];
const TYPES = [
  { value: "initiale", label: "Formation initiale" },
  { value: "alternance", label: "Alternance" },
  { value: "stage", label: "Stage" },
];

export default function Formations() {
  const [field, setField] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      getFormations({ field, city, type })
        .then(setFormations)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [field, city, type]);

  return (
    <div className="page">
      <h1>Écoles & formations</h1>
      <p className="subtitle">
        Recherchez une formation par filière, ville de l'établissement ou type de cursus.
      </p>

      <div className="filters">
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">Toutes les filières</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Ville (ex: Lyon)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">Impossible de charger les formations : {error}</div>}

      {!error && !loading && formations.length === 0 && (
        <div className="empty-state">Aucune formation ne correspond à ces critères.</div>
      )}

      <div className="results-grid">
        {formations.map((formation) => (
          <article key={formation.id} className="card">
            <span className="tag">{formation.field}</span>
            <span className="tag">{formation.type}</span>
            <h3>{formation.title}</h3>
            <p>{formation.description}</p>
            <p><strong>{formation.school?.name}</strong> — {formation.school?.city}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
