import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    country: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate("/checklist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Créer un compte</h1>
      <p className="subtitle">
        Un compte vous permet de suivre votre checklist administrative personnelle.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form className="card auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-row">
          <div>
            <label htmlFor="firstName">Prénom</label>
            <input id="firstName" type="text" value={form.firstName} onChange={update("firstName")} required />
          </div>
          <div>
            <label htmlFor="lastName">Nom</label>
            <input id="lastName" type="text" value={form.lastName} onChange={update("lastName")} required />
          </div>
        </div>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={update("email")} required />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={update("password")}
          minLength={8}
          required
        />
        <p className="auth-hint">8 caractères minimum.</p>

        <label htmlFor="country">Pays d'origine (optionnel)</label>
        <input id="country" type="text" value={form.country} onChange={update("country")} />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="auth-switch">
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </div>
  );
}
