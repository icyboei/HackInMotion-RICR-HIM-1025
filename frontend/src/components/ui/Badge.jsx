/**
 * MediSafe Clinical Status Badge Primitive
 */
export function Badge({
  children,
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'danger' | 'critical' | 'neutral'
  size = 'md',        // 'sm' | 'md'
  icon: Icon = null,
  className = "",
  ...props
}) {
  const variantStyles = {
    brand: "bg-[#EEF6F4] text-[#0F766E] border border-[#0F766E]/20",
    success: "bg-emerald-50 text-[#16A34A] border border-emerald-200",
    warning: "bg-amber-50 text-[#D97706] border border-amber-200",
    danger: "bg-red-50 text-[#DC2626] border border-red-200",
    critical: "bg-rose-100 text-[#B91C1C] border border-rose-300 font-bold",
    neutral: "bg-slate-100 text-[#64748B] border border-slate-200",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-semibold rounded-md gap-1",
    md: "px-3 py-1 text-xs font-semibold rounded-full gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
