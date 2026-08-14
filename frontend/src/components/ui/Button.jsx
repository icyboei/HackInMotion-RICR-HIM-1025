/**
 * MediSafe Clinical Button Component
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary: "bg-[#0F766E] text-white hover:bg-[#115E59] active:bg-[#0D5C56] shadow-sm hover:shadow focus:ring-[#0F766E]",
    secondary: "bg-[#EEF6F4] text-[#0F766E] hover:bg-[#E2F0EC] active:bg-[#D5E8E3] focus:ring-[#0F766E]",
    outline: "bg-white text-[#0F766E] border border-[#DCE8E5] hover:bg-[#EEF6F4] hover:border-[#0F766E]/40 focus:ring-[#0F766E]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-sm focus:ring-[#DC2626]",
    ghost: "bg-transparent text-[#64748B] hover:text-[#12302E] hover:bg-[#EEF6F4] focus:ring-[#0F766E]",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
        </>
      )}
    </button>
  );
}

export default Button;
