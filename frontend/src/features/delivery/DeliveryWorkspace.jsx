import { Download, Search } from "lucide-react";
import { useState } from "react";

import { getDeliveries, getDelivery, saveSelection } from "../../api/client";
import { SectionHeader } from "../../components/SectionHeader";

export function DeliveryWorkspace({ deliveries, onDeliveriesChange }) {
  const [code, setCode] = useState("STUDIO-2026-0618");
  const [delivery, setDelivery] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");

  async function loadDelivery(event) {
    event.preventDefault();
    setMessage("");

    try {
      const data = await getDelivery(code);
      setDelivery(data);
      setSelectedIds(data.photos.filter((photo) => photo.selected).map((photo) => photo.id));
    } catch (error) {
      setDelivery(null);
      setMessage(error.message);
    }
  }

  function togglePhoto(photoId) {
    setSelectedIds((current) =>
      current.includes(photoId) ? current.filter((item) => item !== photoId) : [...current, photoId],
    );
  }

  async function submitSelection() {
    const result = await saveSelection({ code: delivery.code, photoIds: selectedIds });
    setMessage(result.message);
    const summary = await getDeliveries();
    onDeliveriesChange(summary);
  }

  return (
    <section className="section" id="delivery">
      <SectionHeader
        eyebrow="客片交付与在线选片"
        title="通过交付码查看照片并保存精修选择"
        description="示例交付码已填入，可直接查看在线选片流程。"
      />

      <div className="delivery-layout">
        <aside className="delivery-sidebar">
          <form className="lookup-form" onSubmit={loadDelivery}>
            <label>
              交付码
              <input value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
            <button className="button button-primary" type="submit">
              <Search size={18} />
              查询交付
            </button>
          </form>

          <div className="summary-list">
            {deliveries.map((item) => (
              <button className="summary-item" key={item.code} onClick={() => setCode(item.code)} type="button">
                <strong>{item.title}</strong>
                <span>{item.client}</span>
                <small>
                  {item.selectedCount}/{item.photoCount} 已选
                </small>
              </button>
            ))}
          </div>
        </aside>

        <div className="gallery-panel">
          {delivery ? (
            <>
              <div className="gallery-toolbar">
                <div>
                  <h3>{delivery.title}</h3>
                  <p>
                    {delivery.client} · {delivery.status} · 精修上限 {delivery.retouchLimit} 张
                  </p>
                </div>
                <button className="button button-ghost" type="button">
                  <Download size={18} />
                  下载底片
                </button>
              </div>
              <div className="photo-grid">
                {delivery.photos.map((photo) => (
                  <button
                    className={`photo-tile ${selectedIds.includes(photo.id) ? "selected" : ""}`}
                    key={photo.id}
                    onClick={() => togglePhoto(photo.id)}
                    type="button"
                  >
                    <img src={photo.url} alt={`客片 ${photo.id}`} />
                    <span>{selectedIds.includes(photo.id) ? "已选择" : "待选择"}</span>
                  </button>
                ))}
              </div>
              <div className="selection-bar">
                <span>
                  已选择 {selectedIds.length} / {delivery.retouchLimit} 张
                </span>
                <button className="button button-primary" onClick={submitSelection} type="button">
                  保存选片
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">输入交付码后查看客片与选片状态。</div>
          )}
          {message && <div className="notice">{message}</div>}
        </div>
      </div>
    </section>
  );
}
