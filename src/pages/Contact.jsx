import React, { useState } from "react";
import BackButton from "../components/BackButton.jsx";
import { profile } from "../data/profile.js";

const copyToClipboard = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function Contact({ copy, sectionId, embedded = false }) {
  const [copiedKey, setCopiedKey] = useState("");
  const isEnglish = copy.nav.contact === "Contact";
  const contactTitle = isEnglish
    ? "Looking forward to exploring more possibilities in AI visual content together"
    : "期待一起探索 AI 视觉内容的更多可能";
  const copyItems = [
    {
      key: "phone",
      label: isEnglish ? "Phone / WeChat" : "电话/微信",
      value: profile.phone,
    },
    {
      key: "email",
      label: isEnglish ? "Personal Email" : "个人邮箱",
      value: profile.email,
    },
  ];

  const handleCopy = async (item) => {
    await copyToClipboard(item.value);
    setCopiedKey(item.key);
    window.setTimeout(() => setCopiedKey(""), 1200);
  };

  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section contact-page" : "page-section page-top contact-page"}>
      {!embedded && <BackButton />}
      <div className="contact-layout reveal">
        <div className="contact-left">
          <span className="contact-label">Contact</span>
          <h2 className="contact-heading">{contactTitle}</h2>
          <a className="contact-resume-button" href={profile.resumePath} download>
            <span>{isEnglish ? "Resume Download" : "简历下载"}</span>
            <strong>PDF</strong>
          </a>
        </div>
        <div className="contact-panel" aria-label={copy.nav.contact}>
          <div className="contact-detail-list">
            {copyItems.map((item) => (
              <button className="contact-link contact-copyable" type="button" key={item.key} onClick={() => handleCopy(item)}>
                <span>{item.label}</span>
                <strong>{copiedKey === item.key ? (isEnglish ? "Copied" : "已复制") : item.value}</strong>
                <svg className="contact-copy-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="10" height="10" rx="2" />
                  <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            ))}
            <div className="contact-link contact-static">
              <span>{isEnglish ? "Location:" : "地理位置："}</span>
              <strong>{isEnglish ? "Shenzhen" : "深圳"}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
