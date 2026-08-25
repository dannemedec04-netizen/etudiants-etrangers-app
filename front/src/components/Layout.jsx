import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

const LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/formations", label: "Écoles & formations" },
  { to: "/offres", label: "Offres entreprises" },
  { to: "/checklist", label: "Checklist" },
  { to: "/aides", label: "Aides disponibles" },
  { to: "/chat", label: "Assistant" },
];

export default function Layout() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" end>
            <span className="brand-mark-wrap">
              <img src="/favicon.svg" alt="" className="brand-mark" />
            </span>
            Étudiants Étrangers
          </NavLink>
          <nav className="nav">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
}
