import React, { useState } from "react";

import BackButton from "../components/BackButton.jsx";
import { profile } from "../data/profile.js";
import { protectedImageProps } from "../utils/mediaProtection.js";

const strengths = [
  [
    "01",
    "AIGC 商业视觉落地能力",
    "具备服装、珠宝、产品、电商、家居等多类型 AI 商业图像项目经验，能够从需求理解、视觉方向、生成控制到精修交付完成完整闭环。",
  ],
  [
    "02",
    "AI 工作流与技术应用能力",
    "熟悉 ComfyUI、Stable Diffusion、Midjourney、Flux、Qwen Image、seedance、Nana Banana、GPT-image2 等工具与模型，掌握文生图、图生图、局部重绘、一致性控制、高清放大、LoRA 训练等核心流程。",
  ],
  [
    "03",
    "审美表达与空间构图能力",
    "拥有建筑设计背景，具备较强的画面构图、空间关系、光影氛围、材质表达和视觉秩序把控能力，能提升 AI 图像的商业质感与专业度。",
  ],
  [
    "04",
    "流程沉淀与协作交付能力",
    "参与 AI 视觉生产 SOP、模板库与团队培训建设，能够将复杂生成流程标准化，并与商务、产品、研发及团队协同推进项目交付。",
  ],
];

const experience = [
  {
    number: "01",
    time: "2025.12 - 2026.05",
    title: "高级AI设计师",
    role: "深圳兔展智能科技有限公司",
    text: "参与公司 AI 应用平台 AnyReal 的商业化视觉场景验证与模板建设，覆盖 AI 模特、服装 Lookbook、珠宝佩戴、产品展示、电商视觉、家居场景及 AI 视频等方向；面向商务侧真实客户需求，负责 Brief 解析、视觉风格设定、Prompt 策略、参考图控制、模型/节点选择、参数调优、局部修复、高清输出与交付质检，并基于真实商单经验沉淀多场景 AIGC 视觉生产 SOP、Prompt 模板、批量生成流程及质检标准。",
  },
  {
    number: "02",
    time: "2021.07-2024.10",
    title: "主创建筑师",
    role: "建学建筑与工程设计所有限公司深圳分公司",
    text: "负责建筑方案从概念到方案深化、交付的全流程把控，带领团队推进设计分工、进度管理、图面质量和节点交付，具备较强沟通协调、需求理解和方案汇报的能力。",
  },
  {
    number: "03",
    time: "2017-2021",
    title: "建筑设计师",
    role: "早期建筑设计经历 | 深圳多家建筑设计公司公司",
    text: "参与多种类型建筑项目，负责方案设计、图纸绘制、效果表达及项目配合，积累了完整的设计流程经验和空间规划、设计规范、视觉表达、多项目并行、跨部门沟通及高效交付的能力。",
  },
];

export default function About({ copy, sectionId, embedded = false }) {
  const [openExperience, setOpenExperience] = useState({});

  const toggleExperience = (number) => {
    setOpenExperience((current) => ({
      ...current,
      [number]: !current[number],
    }));
  };

  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section about-section" : "page-section page-top about-section"}>
      {!embedded && <BackButton />}
      <div className="about-reference-grid">
        <div className="about-title-card reveal">
          <span>/// ABOUT ///</span>
          <h2>{copy.pages.aboutTitle}</h2>
        </div>

        <figure className="about-photo reveal">
          <img {...protectedImageProps} src="/assets/images/profile/profile-01.webp" alt={`${profile.name}个人照片`} loading="lazy" />
        </figure>

        <div className="about-identity reveal">
          <div className="about-intro-heading">
            <h3>李&nbsp;&nbsp;柳</h3>
            <strong>AIGC设计师</strong>
          </div>
        </div>

        <div className="about-right-panel reveal">
          <div className="about-strength-panel">
            <div className="about-block-heading">
              <h3>核心优势</h3>
            </div>
            <div className="strength-grid">
              {strengths.map(([number, title, text]) => (
                <article className="strength-card" key={number}>
                  <span>{number}</span>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="about-experience">
          <div className="about-block-heading reveal">
            <span>Career Path</span>
            <h3>工作经历</h3>
          </div>
          <div className="experience-timeline">
            {experience.map((item) => (
              <article className="experience-item reveal" key={item.number}>
                <div className="experience-time">
                  <span>{item.number}</span>
                  <strong>{item.time}</strong>
                </div>
                <div className="experience-copy">
                  <h4>{item.title}</h4>
                  <span>{item.role}</span>
                  <button
                    className="experience-toggle"
                    type="button"
                    aria-label={`${openExperience[item.number] ? "收起" : "展开"}${item.role}详情`}
                    aria-expanded={Boolean(openExperience[item.number])}
                    onClick={() => toggleExperience(item.number)}
                  >
                    <span className="experience-chevron" aria-hidden="true" />
                  </button>
                  {openExperience[item.number] && (
                    <div className="experience-detail">
                      {Array.isArray(item.text) ? item.text.map((text, index) => <p key={index}>{text}</p>) : <p>{item.text}</p>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
