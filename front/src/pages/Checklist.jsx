import { useEffect, useState } from "react";
import { createChecklistItem, getChecklist, setChecklistItemDone } from "../api/admin";
import "./Checklist.css";

const CATEGORIES = [
  { value: "titre_de_sejour", label: "Titre de séjour" },
  { value: "aides", label: "Aides" },
  { value: "droit_au_travail", label: "Droit au travail" },
];

export default function Checklist() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [userIdInput, setUserIdInput] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ label: "", description: "", category: CATEGORIES[0].value });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    getChecklist(userId)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  function handleConnect(e) {
    e.preventDefault();
    if (!userIdInput.trim()) return;
    localStorage.setItem("userId", userIdInput.trim());
    setUserId(userIdInput.trim());
  }

  function handleSwitchUser() {
    localStorage.removeItem("userId");
    setUserId("");
    setItems([]);
    setUserIdInput("");
  }

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
      const created = await createChecklistItem(userId, newItem);
      setItems((current) => [...current, created]);
      setNewItem({ label: "", description: "", category: CATEGORIES[0].value });
    } catch (err) {
      setError(err.message);
    }
  }

  if (!userId) {
    return (
      <div className="page">
        <h1>Checklist administrative</h1>
        <p className="subtitle">
          Cette page n'utilise pas encore de compte connecté : renseignez votre identifiant
          utilisateur pour accéder à votre checklist (l'authentification arrivera plus tard).
        </p>
        <form className="card checklist-login" onSubmit={handleConnect}>
          <label htmlFor="userId">Identifiant utilisateur</label>
          <input
            id="userId"
            type="text"
            placeholder="ex: fda3e6db-4f77-428e-a390-802a3de19b31"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
          />
          <button type="submit" className="btn">Accéder à ma checklist</button>
        </form>
      </div>
    );
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category === cat.value),
  }));

  return (
    <div className="page">
      <div className="checklist-header">
        <div>
          <h1>Checklist administrative</h1>
          <p className="subtitle">Suivez vos démarches et cochez-les au fur et à mesure.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleSwitchUser}>
          Changer d'utilisateur
        </button>
      </div>

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
