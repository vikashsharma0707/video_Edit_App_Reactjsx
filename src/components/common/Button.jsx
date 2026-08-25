import { forwardRef } from 'react';

const Button = forwardRef(function Button(
  { variant = 'ghost', size = 'md', className = '', children, ...props },
  ref
) {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  const variants = {
    ghost: 'btn-ghost',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };
  return (
    <button
      ref={ref}
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
