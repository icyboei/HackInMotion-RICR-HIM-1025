/**
 * MediSafe Clinical Input & Form Control Primitive
 */
export function Input({
  label = null,
  error = null,
  icon: Icon = null,
  className = "",
  id,
  type = "text",
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#12302E] tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-white border ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#DCE8E5] focus:border-[#0F766E] focus:ring-[#0F766E]/20'
          } text-[#12302E] placeholder-[#94A3B8] text-sm rounded-xl py-2.5 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } transition-all duration-200 focus:outline-none focus:ring-4 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-[#DC2626] font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
}

export default Input;
