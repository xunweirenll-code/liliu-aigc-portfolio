import ProcessStep from "../components/ProcessStep.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const workflowSteps = [
  ["01", "需求拆解", "明确品牌目标、使用场景、视觉约束和交付规格。"],
  ["02", "参考整理", "归纳风格、构图、材质、模特状态和画面禁区。"],
  ["03", "Prompt 策略", "建立关键词、负面约束和可复用的生成模板。"],
  ["04", "AI 生成", "使用 Midjourney、Flux、Qwen Image 或 Stable Diffusion 进行产出。"],
  ["05", "局部重绘 / 精修", "通过 Inpainting、Photoshop 和人工筛选修复关键细节。"],
  ["06", "高清放大", "按发布和提案规格输出更高分辨率版本。"],
  ["07", "质量检查", "检查产品识别、人体结构、材质一致性和商业可用性。"],
  ["08", "最终交付", "整理命名、尺寸、格式和复盘说明，便于后续复用。"],
];

const capabilities = ["ComfyUI Workflow", "LoRA Training", "Model Consistency", "Inpainting", "Product Retouching", "Batch Generation", "AI Video Generation", "AI Coding"];

export default function Workflow({ copy }) {
  return (
    <section className="page-section page-top">
      <SectionTitle title={copy.pages.workflowTitle} intro={copy.pages.workflowIntro} />
      <div className="workflow-line reveal">
        {workflowSteps.map(([number, title]) => (
          <span key={number}>{title}</span>
        ))}
      </div>
      <div className="process-grid">
        {workflowSteps.map(([number, title, text]) => (
          <ProcessStep key={number} number={number} title={title} text={text} />
        ))}
      </div>
      <div className="capability-panel reveal">
        <span className="eyebrow">Capabilities</span>
        <div className="tag-row large">
          {capabilities.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
