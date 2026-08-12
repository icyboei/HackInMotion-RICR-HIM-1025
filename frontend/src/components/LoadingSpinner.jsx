function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  )
}

export default LoadingSpinner
