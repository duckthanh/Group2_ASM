import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import './AuthNew.css'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const [success, setSuccess] = useState(false)

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 4000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp!', 'error')
            return
        }

        setLoading(true)
        try {
            const res = await axios.post(
                'http://localhost:8080/api/auth/reset-password',
                null,
                {
                    params: {
                        token,
                        newPassword: password
                    }
                }
            )

            showToast('Mật khẩu đã được đặt lại thành công! ✅', 'success')
            setSuccess(true)
        } catch (err) {
            showToast(
                err.response?.data || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : '⚠'}
            </span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="auth-container">
                <div className="auth-hero">
                    <div className="auth-hero-content">
                        <div className="auth-hero-icon">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="38" fill="#2563EB" opacity="0.1" />
                                <path
                                    d="M40 10L15 25V50L40 65L65 50V25L40 10Z"
                                    fill="#2563EB"
                                />
                                <path
                                    d="M40 22L28 29V51L40 58L52 51V29L40 22Z"
                                    fill="white"
                                />
                                <circle cx="40" cy="40" r="8" fill="#2563EB" />
                            </svg>
                        </div>
                        <h1 className="auth-hero-title">Tìm Trọ</h1>
                        <p className="auth-hero-subtitle">
                            Hãy đặt lại mật khẩu mới để tiếp tục đăng nhập ✨
                        </p>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2 className="auth-title">Đặt lại mật khẩu 🔒</h2>
                            <p className="auth-subtitle">
                                Nhập mật khẩu mới và xác nhận lại bên dưới
                            </p>
                        </div>

                        {!success ? (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-input"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg btn-block"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        'Xác nhận đặt lại mật khẩu'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div
                                className="alert"
                                style={{
                                    background: '#ECFDF5',
                                    border: '1px solid #A7F3D0',
                                    color: '#065F46',
                                    marginTop: '20px'
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <strong>Thành công!</strong>
                                    <p
                                        style={{
                                            marginTop: '4px',
                                            fontSize: '13px',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Mật khẩu của bạn đã được thay đổi thành công.
                                        <br />
                                        <Link
                                            to="/login"
                                            className="auth-footer-link"
                                            style={{ marginTop: '8px', display: 'inline-block' }}
                                        >
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}