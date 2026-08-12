function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/60 text-red-300 text-sm px-4 py-3 rounded-xl">
      <span className="text-lg flex-shrink-0">⚠️</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-400 hover:text-red-200 transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default ErrorBanner
