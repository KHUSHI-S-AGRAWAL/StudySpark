import './GlassIcons.css';

const gradientMapping = {
  blue: 'linear-gradient(hsl(200, 90%, 50%), hsl(215, 90%, 40%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  green: 'linear-gradient(hsl(145, 90%, 45%), hsl(130, 90%, 35%))',
  orange: 'linear-gradient(hsl(35, 90%, 50%), hsl(20, 90%, 50%))',
  red: 'linear-gradient(hsl(350, 90%, 50%), hsl(335, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 60%), hsl(238, 90%, 50%))'
};

const textHoverColors = {
  blue: '#38bdf8',
  purple: '#c084fc',
  green: '#4ade80',
  orange: '#fb923c',
  red: '#f87171',
  indigo: '#818cf8'
};

const GlassIcons = ({ items, className }) => {
  const getBackgroundStyle = color => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => (
        <button 
          key={index} 
          className={`icon-btn ${item.customClass || ''}`} 
          aria-label={item.label} 
          type="button"
          onClick={item.onClick}
          style={{ '--hover-glow': textHoverColors[item.color] || '#ffffff' }}
        >
          <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;