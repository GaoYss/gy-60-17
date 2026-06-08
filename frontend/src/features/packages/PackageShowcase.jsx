import { CheckCircle2 } from "lucide-react";

import { SectionHeader } from "../../components/SectionHeader";

export function PackageShowcase({ packages, loading }) {
  return (
    <section className="section" id="packages">
      <SectionHeader
        eyebrow="套餐展示"
        title="按拍摄场景选择服务"
        description="套餐信息由后端接口返回，前端只负责展示和交互。"
      />
      <div className="package-grid">
        {loading
          ? [1, 2, 3].map((item) => <div className="card skeleton" key={item} />)
          : packages.map((item) => (
              <article className="card package-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="card-body">
                  <div className="package-title">
                    <h3>{item.name}</h3>
                    <strong>¥{item.price}</strong>
                  </div>
                  <p>{item.duration}</p>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}>
                        <CheckCircle2 size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
