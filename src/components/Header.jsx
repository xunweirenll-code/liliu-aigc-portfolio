import { useState } from "react";
import { Link } from "react-router-dom";
import LanguageSwitch from "./LanguageSwitch.jsx";

export default function Header({ language, setLanguage, copy, activeSection }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    ["hero", copy.nav.home],
    ["about", copy.nav.about],
    ["works", copy.nav.works],
    ["process", copy.nav.process],
    ["contact", copy.nav.contact],
  ];

  return (
    <header className="site-header">
      <Link to="/#hero" className="brand" onClick={() => setOpen(false)}>
        <span>LILIU</span>
        <small>AIGC Portfolio</small>
      </Link>
      <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        {navItems.map(([sectionId, label]) => (
          <Link
            key={sectionId}
            to={`/#${sectionId}`}
            className={activeSection === sectionId ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className="mobile-language">
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>
      </nav>
      <div className="header-language">
        <LanguageSwitch language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
}
