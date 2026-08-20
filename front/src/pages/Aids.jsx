import { useEffect, useState } from "react";
import { getAids } from "../api/admin";

const CATEGORIES = [
  { value: "logement", label: "Logement" },
  { value: "bourse", label: "Bourse" },
  { value: "sante", label: "Santé" },
  { value: "transport", label: "Transport" },
];

export default function Aids() {
  const [category, setCategory] = useState("");
  const [aids, setAids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAids(category)
      .then(setAids)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <h1>Aides disponibles</h1>
      <p className="subtitle">
        Logement, bourses, santé... découvrez les aides auxquelles vous pouvez avoir droit.
      </p>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">Impossible de charger les aides : {error}</div>}

      {!error && !loading && aids.length === 0 && (
        <div className="empty-state">Aucune aide ne correspond à cette catégorie.</div>
      )}

      <div className="results-grid">
        {aids.map((aid) => (
          <article key={aid.id} className="card">
            <span className="tag">{aid.category}</span>
            <h3>{aid.name}</h3>
            <p><strong>{aid.provider}</strong></p>
            {aid.description && <p>{aid.description}</p>}
            {aid.eligibility && <p><em>Conditions :</em> {aid.eligibility}</p>}
            {aid.amount && <p><em>Montant :</em> {aid.amount}</p>}
            {aid.url && (
              <p>
                <a href={aid.url} target="_blank" rel="noreferrer">Site officiel</a>
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
