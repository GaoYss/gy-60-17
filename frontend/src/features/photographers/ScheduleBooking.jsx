import { CalendarDays, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { createBooking, getAvailability } from "../../api/client";
import { SectionHeader } from "../../components/SectionHeader";

const initialForm = {
  clientName: "",
  phone: "",
  packageId: "",
  photographerId: "",
  date: "",
  time: "",
  notes: "",
};

export function ScheduleBooking({ packages, photographers }) {
  const [form, setForm] = useState(initialForm);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dimmedWarning, setDimmedWarning] = useState("");

  const allTags = useMemo(() => {
    const tagSet = new Set();
    photographers.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [photographers]);

  const filteredPhotographers = useMemo(() => {
    if (selectedTags.length === 0) {
      if (!form.photographerId) return photographers.map((item) => ({ ...item, isMatched: true }));
      const selected = photographers.find((item) => item.id === form.photographerId);
      const others = photographers.filter((item) => item.id !== form.photographerId);
      return [selected, ...others].map((item) => ({ ...item, isMatched: true }));
    }

    const matched = [];
    const unmatched = [];
    photographers.forEach((item) => {
      const isMatched = selectedTags.every((tag) => item.tags.includes(tag));
      if (isMatched) {
        matched.push({ ...item, isMatched: true });
      } else {
        unmatched.push({ ...item, isMatched: false });
      }
    });

    const selectedId = form.photographerId;
    if (selectedId) {
      const selectedItem = matched.find((item) => item.id === selectedId) ||
        unmatched.find((item) => item.id === selectedId);
      const restMatched = matched.filter((item) => item.id !== selectedId);
      const restUnmatched = unmatched.filter((item) => item.id !== selectedId);
      return [selectedItem, ...restMatched, ...restUnmatched];
    }

    return [...matched, ...unmatched];
  }, [photographers, selectedTags, form.photographerId]);

  const activePhotographer = useMemo(
    () => photographers.find((item) => item.id === form.photographerId),
    [form.photographerId, photographers],
  );

  const matchStats = useMemo(() => {
    if (selectedTags.length === 0) {
      return { fullyMatched: photographers.length, selectedUnmatched: 0 };
    }
    const fullyMatched = photographers.filter((item) =>
      selectedTags.every((tag) => item.tags.includes(tag)),
    ).length;
    const selectedUnmatched =
      form.photographerId &&
      !selectedTags.every((tag) => activePhotographer?.tags.includes(tag))
        ? 1
        : 0;
    return { fullyMatched, selectedUnmatched };
  }, [photographers, selectedTags, form.photographerId, activePhotographer]);

  function getMissingTags(item) {
    if (selectedTags.length === 0) return [];
    return selectedTags.filter((tag) => !item.tags.includes(tag));
  }

  function toggleTag(tag) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
    setDimmedWarning("");
  }

  function clearTags() {
    setSelectedTags([]);
    setDimmedWarning("");
  }

  function handlePhotographerClick(item) {
    if (!item.isMatched && form.photographerId !== item.id) {
      const missing = getMissingTags(item).join("、");
      setDimmedWarning(`${item.name} 缺少风格：${missing}，请先调整筛选条件。`);
      return;
    }
    setDimmedWarning("");
    updateField("photographerId", item.id);
  }

  useEffect(() => {
    if (!form.photographerId || !form.date) {
      setSlots([]);
      return;
    }

    getAvailability(form.photographerId, form.date)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]));
  }, [form.photographerId, form.date]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value, ...(field === "date" ? { time: "" } : {}) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const booking = await createBooking(form);
      setStatus(`预约已提交：${booking.date} ${booking.time}，状态为${booking.status}。`);
      setForm(initialForm);
      setSlots([]);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section booking-section" id="booking">
      <SectionHeader
        eyebrow="摄影师档期预约"
        title="选择摄影师、日期与时间"
        description="提交后后端会校验套餐、摄影师和可预约时间。"
      />

      <div className="booking-layout">
        <div className="photographer-column">
          <div className="tag-filter">
            <div className="tag-filter-header">
              <span className="tag-filter-title">
                风格筛选
              </span>
              {selectedTags.length > 0 && (
                <button className="tag-clear" onClick={clearTags} type="button">
                  <X size={14} />
                  清除
                </button>
              )}
            </div>
            <div className="tag-filter-stats">
              {selectedTags.length === 0 ? (
                <span className="tag-filter-stat">共 {photographers.length} 位摄影师</span>
              ) : (
                <>
                  <span className="tag-filter-stat">
                    <span className="stat-dot matched" />
                    完全匹配 {matchStats.fullyMatched} 位
                  </span>
                  {matchStats.selectedUnmatched > 0 && (
                    <span className="tag-filter-stat">
                      <span className="stat-dot selected" />
                      已选但不匹配 {matchStats.selectedUnmatched} 位
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="tag-list">
              {allTags.map((tag) => (
                <button
                  className={`tag-chip ${selectedTags.includes(tag) ? "active" : ""}`}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="photographer-list">
            {filteredPhotographers.map((item) => {
              const isSelected = form.photographerId === item.id;
              const missingTags = getMissingTags(item);
              const isDimmed = !item.isMatched && !isSelected;
              return (
                <button
                  className={`photographer-card ${isSelected ? "active" : ""} ${isDimmed ? "dimmed" : ""}`}
                  key={item.id}
                  onClick={() => handlePhotographerClick(item)}
                  type="button"
                >
                  <img src={item.avatar} alt={item.name} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.title}</small>
                    <div className="photographer-tags">
                      {item.tags.map((tag) => (
                        <span className="photographer-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {missingTags.length > 0 && (
                      <div className="photographer-missing">
                        <span className="missing-label">缺少：</span>
                        {missingTags.map((tag) => (
                          <span className="photographer-tag missing" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </span>
                  <em>{item.availableDates.length} 天可约</em>
                </button>
              );
            })}
            {dimmedWarning && (
              <div className="notice notice-warning">{dimmedWarning}</div>
            )}
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              客户姓名
              <input value={form.clientName} onChange={(event) => updateField("clientName", event.target.value)} required />
            </label>
            <label>
              联系电话
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required />
            </label>
            <label>
              拍摄套餐
              <select value={form.packageId} onChange={(event) => updateField("packageId", event.target.value)} required>
                <option value="">请选择套餐</option>
                {packages.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              拍摄日期
              <select
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                required
                disabled={!activePhotographer}
              >
                <option value="">请选择日期</option>
                {activePhotographer?.availableDates.map((date) => (
                  <option value={date} key={date}>
                    {date}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="slot-panel">
            <span>
              <CalendarDays size={18} />
              可选时间
            </span>
            <div className="slot-list">
              {slots.length ? (
                slots.map((slot) => (
                  <button
                    className={form.time === slot ? "slot active" : "slot"}
                    key={slot}
                    onClick={() => updateField("time", slot)}
                    type="button"
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <small>选择摄影师和日期后显示时间</small>
              )}
            </div>
          </div>

          <label>
            拍摄备注
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows="3" />
          </label>

          <button className="button button-primary" disabled={submitting} type="submit">
            <Send size={18} />
            {submitting ? "提交中" : "提交预约"}
          </button>
          {status && <div className="notice">{status}</div>}
        </form>
      </div>
    </section>
  );
}
