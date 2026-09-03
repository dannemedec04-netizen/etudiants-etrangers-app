import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createChecklistItem, getChecklist, setChecklistItemDone } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import "./Checklist.css";

const CATEGORIES = [
  { value: "titre_de_sejour", label: "Titre de séjour" },
  { value: "aides", label: "Aides" },
  { value: "droit_au_travail", label: "Droit au travail" },
];

export default function Checklist() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ label: "", description: "", category: CATEGORIES[0].value });

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    getChecklist()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function toggleItem(item) {
    const previous = items;
    setItems((current) =>
      current.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
    );
    try {
      await setChecklistItemDone(item.id, !item.done);
    } catch (err) {
      setItems(previous);
      setError(err.message);
    }
  }

  async function handleAddItem(e) {
    e.preventDefault();
    if (!newItem.label.trim()) return;
    try {
      const created = await createChecklistItem(newItem);
      setItems((current) => [...current, created]);
      setNewItem({ label: "", description: "", category: CATEGORIES[0].value });
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="page">
        <h1>Checklist administrative</h1>
        <p className="subtitle">
          Connectez-vous pour accéder à votre checklist personnalisée et suivre vos démarches.
        </p>
        <div className="card checklist-login">
          <Link to="/connexion" className="btn">Se connecter</Link>
          <Link to="/inscription" className="btn btn-outline">Créer un compte</Link>
        </div>
      </div>
    );
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.value),
  }));

  return (
    <div className="page">
      <h1>Checklist administrative</h1>
      <p className="subtitle">Suivez vos démarches et cochez-les au fur et à mesure.</p>

      {error && <div className="error-banner">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && items.length === 0 && (
        <div className="empty-state">Aucune étape pour l'instant. Ajoutez-en une ci-dessous.</div>
      )}

      {grouped.map((group) =>
        group.items.length > 0 ? (
          <section key={group.value} className="checklist-group">
            <h2>{group.label}</h2>
            <ul className="checklist-list">
              {group.items.map((item) => (
                <li key={item.id} className={item.done ? "checklist-item done" : "checklist-item"}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleItem(item)}
                    />
                    <div>
                      <strong>{item.label}</strong>
                      {item.description && <p>{item.description}</p>}
                      {item.url && (
                        <p>
                          <a href={item.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                            Site officiel de la démarche
                          </a>
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}

      <section className="checklist-group">
        <h2>Ajouter une étape</h2>
        <form className="card checklist-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Intitulé de la démarche"
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optionnel)"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows={2}
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button type="submit" className="btn">Ajouter</button>
        </form>
      </section>
    </div>
  );
}
