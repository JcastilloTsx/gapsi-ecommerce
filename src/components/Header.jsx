export default function Header({ onReset }) {
  return (
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="e-Commerce Gapsi, inicio">
        <img src="/assets/logo.png" alt="Gapsi" />
        <span>e-Commerce <strong>Gapsi</strong></span>
      </a>
      <div className="topbar-actions">
        <span className="availability"><i /> Catálogo abierto</span>
        <button className="icon-button" type="button" onClick={onReset} aria-label="Reiniciar aplicación" title="Reiniciar aplicación">
          <i className="fa-solid fa-arrow-rotate-left" />
        </button>
      </div>
    </header>
  )
}
