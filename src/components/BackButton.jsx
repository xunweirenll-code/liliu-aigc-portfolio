import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "返回上一页" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <button className="page-back-button reveal" type="button" aria-label={label} title={label} onClick={handleBack}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6L9 12l6 6" />
      </svg>
    </button>
  );
}
