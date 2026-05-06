const Badge = ({ children, className = '', icon, variant = 'default' }) => {
  const classes = ['wm-badge', `wm-badge--${variant}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {icon && <i className={`bi ${icon}`} aria-hidden="true"></i>}
      {children}
    </span>
  );
};

export default Badge;
