import { Link } from 'react-router-dom';

const Button = ({
  children,
  className = '',
  disabled = false,
  icon,
  size = '',
  to,
  type = 'button',
  variant = 'primary',
  ...props
}) => {
  const classes = [
    'wm-button',
    `wm-button--${variant}`,
    size ? `wm-button--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <i className={`bi ${icon}`} aria-hidden="true"></i>}
      {children && <span>{children}</span>}
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} aria-disabled={disabled} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} type={type} {...props}>
      {content}
    </button>
  );
};

export default Button;
