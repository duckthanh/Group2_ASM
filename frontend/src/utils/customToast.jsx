import toast from 'react-hot-toast'

// Custom toast with dismiss button
const createToastWithDismiss = (message, type = 'success') => {
  return toast[type]((t) => (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        width: '100%',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          lineHeight: '1',
          padding: '4px 8px',
          color: 'inherit',
          opacity: 0.6,
          transition: 'opacity 0.2s',
          fontWeight: 'bold',
        }}
        onMouseEnter={(e) => { e.target.style.opacity = '1' }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.6' }}
        title="Đóng"
      >
        ✕
      </button>
    </div>
  ), {
    duration: 4000,
  })
}

export const customToast = {
  success: (message) => createToastWithDismiss(message, 'success'),
  error: (message) => createToastWithDismiss(message, 'error'),
  info: (message) => createToastWithDismiss(message, 'blank'),
}

export default customToast

