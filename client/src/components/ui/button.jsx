import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  label,
  onClick,
  icon: IconComponent,   // Accepts a Lucide icon component reference
  iconPosition = 'left',  // 'left' or 'right'
  variant = 'primary',    // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md',            // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',         // Allows quick custom styling overrides
  type = 'button',
  ...props
}) {
  // Base structural flexbox and alignment tracking styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50';

  // Tailwind v4 design system token color variations mapping
  const variants = {
    primary: 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 active:scale-[0.98]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98]',
    outline: 'border border-border bg-transparent hover:bg-secondary text-foreground',
    ghost: 'hover:bg-secondary text-muted-foreground hover:text-foreground',
  };

  // Dimensional scale options
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  // Setup dynamic sizing classes specifically for the icons
  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`h-9 ${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* 1. Loading State Spinner */}
      {isLoading && (
        <Loader2 className={`${iconSizes[size]} animate-spin text-current`} />
      )}

      {/* 2. Left Positioned Icon (Only renders if not loading) */}
      {IconComponent && iconPosition === 'left' && !isLoading && (
        <IconComponent className={`${iconSizes[size]} text-current`} />
      )}

      {/* 3. Main Action Label Text */}
      {label && <span>{label}</span>}

      {/* 4. Right Positioned Icon */}
      {IconComponent && iconPosition === 'right' && !isLoading && (
        <IconComponent className={`${iconSizes[size]} text-current`} />
      )}
    </button>
  );
}