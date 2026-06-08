import { CalendarCheck, Camera, Images, Sparkles } from "lucide-react";

export function AppShell({ children }) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Camera size={26} />
          <div>
            <span>光屿摄影工作室</span>
            <small>Studio Booking Platform</small>
          </div>
        </div>
        <nav>
          <a href="#packages">套餐</a>
          <a href="#booking">预约</a>
          <a href="#delivery">交付选片</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            预约、交付、选片一体化
          </span>
          <h1>光屿摄影工作室</h1>
          <p>为人像、婚礼和家庭写真提供套餐展示、摄影师档期预约、客片交付与在线选片。</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#booking">
              <CalendarCheck size={18} />
              预约档期
            </a>
            <a className="button button-ghost" href="#delivery">
              <Images size={18} />
              查看交付
            </a>
          </div>
        </div>
      </section>

      <main>{children}</main>
    </div>
  );
}
