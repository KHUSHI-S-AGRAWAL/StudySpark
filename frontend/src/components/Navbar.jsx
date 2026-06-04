<img src="/book_icon.png" alt="Logo" /> // Imports your custom asset file directly to ensure branding consistency

function Navbar({ onHome }) {
  return (
    <nav className="navbar-shell">
      
      {/* Home button aligned left */}
      <button 
        onClick={onHome}
        className="navbar-home"
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
          e.target.style.borderColor = 'rgba(56, 189, 248, 0.3)';
          e.target.style.color = '#ffffff';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.target.style.color = '#94a3b8';
        }}
      >
        <span>🏠</span> Home
      </button>

      {/* Center-aligned Title Brand Layout */}
      <div 
        onClick={onHome}
        className="navbar-inner"
      >
        {/* CONSISTENT GRAPHIC BRANDING: Replaced emoji with your custom book asset image */}
        <div style={{ 
          width: '32px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          filter: 'drop-shadow(0 4px 10px rgba(99,102,241,0.25))' 
        }}>
          <img 
            src="/book_icon.png"
            alt="StudySpark Logo" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>

        <span style={{
          fontSize: '32px',
          fontWeight: '900',
          background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          lineHeight: 'normal',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
        }}>
          StudySpark
        </span>
      </div>
      
    </nav>
  );
}

export default Navbar;