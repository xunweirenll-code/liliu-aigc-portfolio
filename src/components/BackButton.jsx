import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WORKS_RETURN_KEY = "portfolio:worksReturn";

const getStoredReturnTo = (pathname) => {
  if (!pathname.startsWith("/works/")) return "";

  try {
    const storedReturn = window.sessionStorage.getItem(WORKS_RETURN_KEY);
    if (!storedReturn) return "";

    const { returnTo, slug } = JSON.parse(storedReturn);
    const currentSlug = decodeURIComponent(pathname.split("/").pop() || "");

    if (slug === currentSlug && typeof returnTo === "string") {
      return returnTo;
    }
  } catch {
    return "";
  }

  return "";
};

export default function BackButton({ label = "返回上一页", fallbackTo = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const returnTo = location.state?.returnTo || getStoredReturnTo(location.pathname);

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <button className="page-back-button reveal" type="button" aria-label={label} title={label} onClick={handleBack}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6L9 12l6 6" />
      </svg>
    </button>
  );
}
