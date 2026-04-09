export default function FloatingDecors() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ── Stars ── */}
      <span className="float-shape" style={{ top: '8%', left: '6%', width: 32, height: 32, color: '#FFD93D', opacity: 0.65, animationName: 'float-a', animationDuration: '6s', animationDelay: '0s' }}>
        <StarSVG />
      </span>
      <span className="float-shape" style={{ top: '22%', right: '7%', width: 22, height: 22, color: '#FFAA2C', opacity: 0.5, animationName: 'float-b', animationDuration: '7.5s', animationDelay: '1.2s' }}>
        <StarSVG />
      </span>
      <span className="float-shape" style={{ bottom: '18%', right: '10%', width: 28, height: 28, color: '#FFD93D', opacity: 0.45, animationName: 'float-c', animationDuration: '8s', animationDelay: '3s' }}>
        <StarSVG />
      </span>
      <span className="float-shape" style={{ top: '55%', left: '3%', width: 18, height: 18, color: '#FFE566', opacity: 0.55, animationName: 'float-d', animationDuration: '6.5s', animationDelay: '4.5s' }}>
        <StarSVG />
      </span>

      {/* ── Hearts ── */}
      <span className="float-shape" style={{ top: '35%', left: '9%', width: 26, height: 26, color: '#FF8FAB', opacity: 0.6, animationName: 'float-b', animationDuration: '7s', animationDelay: '0.5s' }}>
        <HeartSVG />
      </span>
      <span className="float-shape" style={{ bottom: '28%', left: '12%', width: 20, height: 20, color: '#FF6B9D', opacity: 0.5, animationName: 'float-a', animationDuration: '8.5s', animationDelay: '2.5s' }}>
        <HeartSVG />
      </span>
      <span className="float-shape" style={{ top: '14%', right: '18%', width: 16, height: 16, color: '#FF8FAB', opacity: 0.45, animationName: 'float-c', animationDuration: '7s', animationDelay: '3.8s' }}>
        <HeartSVG />
      </span>

      {/* ── Circles / Bubbles ── */}
      <span className="float-shape" style={{ top: '5%', left: '42%', width: 14, height: 14, color: '#C7B8EA', opacity: 0.55, animationName: 'float-d', animationDuration: '9s', animationDelay: '1s' }}>
        <DotSVG />
      </span>
      <span className="float-shape" style={{ bottom: '10%', right: '5%', width: 20, height: 20, color: '#A8D8EA', opacity: 0.5, animationName: 'float-a', animationDuration: '7s', animationDelay: '2s' }}>
        <DotSVG />
      </span>
      <span className="float-shape" style={{ top: '70%', right: '4%', width: 12, height: 12, color: '#FFB6C1', opacity: 0.6, animationName: 'float-b', animationDuration: '6s', animationDelay: '5s' }}>
        <DotSVG />
      </span>
      <span className="float-shape" style={{ bottom: '40%', left: '5%', width: 10, height: 10, color: '#B5EAD7', opacity: 0.55, animationName: 'float-c', animationDuration: '8s', animationDelay: '0.3s' }}>
        <DotSVG />
      </span>

      {/* ── Sprinkles ── */}
      <span className="float-shape" style={{ top: '48%', right: '6%', width: 20, height: 20, color: '#FF8FAB', opacity: 0.55, animationName: 'float-a', animationDuration: '7s', animationDelay: '1.7s' }}>
        <SprinkleSVG rotate={30} />
      </span>
      <span className="float-shape" style={{ bottom: '22%', left: '7%', width: 16, height: 16, color: '#FFD93D', opacity: 0.5, animationName: 'float-d', animationDuration: '6.5s', animationDelay: '3.3s' }}>
        <SprinkleSVG rotate={-45} />
      </span>
      <span className="float-shape" style={{ top: '80%', left: '35%', width: 14, height: 14, color: '#A8D8EA', opacity: 0.55, animationName: 'float-b', animationDuration: '8s', animationDelay: '2.8s' }}>
        <SprinkleSVG rotate={60} />
      </span>
      <span className="float-shape" style={{ top: '30%', right: '3%', width: 12, height: 12, color: '#FFAA2C', opacity: 0.5, animationName: 'float-c', animationDuration: '7.5s', animationDelay: '4s' }}>
        <SprinkleSVG rotate={15} />
      </span>

      {/* ── Cake slices ── */}
      <span className="float-shape" style={{ bottom: '5%', left: '48%', width: 34, height: 34, color: '#FFB5C8', opacity: 0.45, animationName: 'float-a', animationDuration: '9s', animationDelay: '1.5s' }}>
        <CakeSVG />
      </span>
      <span className="float-shape" style={{ top: '60%', right: '14%', width: 28, height: 28, color: '#FFCBA4', opacity: 0.4, animationName: 'float-d', animationDuration: '10s', animationDelay: '0s' }}>
        <CakeSVG />
      </span>

    </div>
  );
}

function StarSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function HeartSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function DotSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function SprinkleSVG({ rotate }: { rotate: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <rect x="5" y="10" width="14" height="4" rx="2" transform={`rotate(${rotate} 12 12)`} />
    </svg>
  );
}

function CakeSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 3a1 1 0 100-2 1 1 0 000 2z" />
      <path d="M4 8h16v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8zM3 13h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
    </svg>
  );
}
