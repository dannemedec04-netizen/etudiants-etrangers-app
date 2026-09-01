import { useState } from "react";
import { getJobPlatformLinks } from "../data/jobPlatforms";

const FIELDS = ["Informatique", "Commerce", "Droit", "Santé"];
const TYPES = [
  { value: "stage", label: "Stage" },
  { value: "alternance", label: "Alternance" },
];

export default function Offers() {
  const [field, setField] = useState(FIELDS[0]);
  const [type, setType] = useState(TYPES[0].value);

  const platforms = getJobPlatformLinks({ field, type });

  return (
    <div className="page">
      <h1>Offres d'entreprises</h1>
      <p className="subtitle">
        Choisissez votre filière et le type de contrat recherché : nous générons pour vous des
        recherches pré-remplies sur les principales plateformes de recrutement.
      </p>

      <div className="filters">
        <select value={field} onChange={(e) => setField(e.target.value)}>
          {FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="results-grid">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noreferrer"
            className="card platform-card"
          >
            <h3>{platform.name} ↗</h3>
            <p>{platform.description}</p>
            {platform.note && <p className="platform-note">{platform.note}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}
