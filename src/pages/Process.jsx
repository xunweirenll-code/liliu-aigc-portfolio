import ProcessStep from "../components/ProcessStep.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const steps = [
  ["001", "Brief 拆解", "把需求转化为目标、用途、受众和交付标准。"],
  ["002", "方向定位", "明确视觉基调、参考范围和不可偏离的品牌边界。"],
  ["003", "素材校准", "整理产品、人物、材质、构图和光影参考。"],
  ["004", "Workflow 搭建", "建立可复用的生成逻辑和批量生产路径。"],
  ["005", "批量生成", "快速扩展候选方案，为商业筛选保留足够空间。"],
  ["006", "筛选修复", "筛掉不可用画面，修复局部结构和产品细节。"],
  ["007", "质量检查", "检查清晰度、一致性、版权风险和投放适配。"],
  ["008", "交付复盘", "整理最终文件、命名规范、使用建议和优化记录。"],
];

export default function Process({ copy, sectionId, embedded = false }) {
  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section" : "page-section page-top"}>
      <SectionTitle title={copy.pages.processTitle} intro={copy.pages.processIntro} />
      <div className="process-grid numbered">
        {steps.map(([number, title, text]) => (
          <ProcessStep key={number} number={number} title={title} text={text} />
        ))}
      </div>
    </section>
  );
}
