export default function LanguageSwitch({ language, setLanguage }) {
  return (
    <div className="language-switch" aria-label="Language switch">
      <button
        className={language === "zh" ? "active" : ""}
        type="button"
        onClick={() => setLanguage("zh")}
      >
        中文
      </button>
      <span>/</span>
      <button
        className={language === "en" ? "active" : ""}
        type="button"
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
