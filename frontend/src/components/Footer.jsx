import './Footer.css';

function Footer() {
  return (
    <footer className="footer-new">
      <div className="footer-container">
        {/* Logo và Tải App Section */}
        <div className="footer-column footer-brand">
          <div className="footer-logo">
            <svg width="60" height="60" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L5 15V30L20 40L35 30V15L20 5Z" fill="#0066CC"/>
              <path d="M20 12L12 17V27L20 32L28 27V17L20 12Z" fill="white"/>
            </svg>
            <span className="logo-text">Tìm Trọ</span>
          </div>
          
       

          <div className="partner-section">
            <p><strong></strong></p>
            <div className="partner-logos">
              
            </div>
          </div>
        </div>

        {/* Hệ Thống Column */}
        <div className="footer-column">
          <h3>HỆ THỐNG</h3>
          <ul>
            <li><a href="#">Dành cho chủ trọ</a></li>
            <li><a href="#">Hướng dẫn</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        {/* Thông Tin Column */}
        <div className="footer-column">
          <h3>THÔNG TIN</h3>
          <ul>
            <li><a href="#">Điều khoản & Cam kết</a></li>
            <li><a href="#">Quy chế hoạt động</a></li>
            <li><a href="#">Giải quyết khiếu nại</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Kết Nối Column */}
        <div className="footer-column footer-contact">
          <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
          <ul className="contact-list">
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#0066CC">
                <path d="M3 2C2.4 2 2 2.4 2 3V13C2 13.6 2.4 14 3 14H13C13.6 14 14 13.6 14 13V3C14 2.4 13.6 2 13 2H3ZM8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4Z"/>
              </svg>
              <span>0345129565</span>
            </li>
            <li>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%230066CC'%3E%3Ctext x='0' y='12' font-size='12'%3EZ%3C/text%3E%3C/svg%3E" alt="Zalo"/>
              <span>0345129565</span>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#0066CC">
                <path d="M2 3L8 8L14 3H2ZM2 4V12H14V4L8 9L2 4Z"/>
              </svg>
              <span>group6@timtro.com</span>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#0066CC">
                <path d="M8 2C6 2 4 4 4 6C4 9 8 14 8 14C8 14 12 9 12 6C12 4 10 2 8 2ZM8 7C7.4 7 7 6.6 7 6C7 5.4 7.4 5 8 5C8.6 5 9 5.4 9 6C9 6.6 8.6 7 8 7Z"/>
              </svg>
              <span>Đại học FPT Hà Nội</span>
            </li>
            
          </ul>

          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17 5.7 21.1 10.6 21.9V14.9H8.2V12H10.6V9.8C10.6 7.4 12 6.1 14.2 6.1C15.2 6.1 16.3 6.3 16.3 6.3V8.6H15.1C13.9 8.6 13.5 9.3 13.5 10.1V12H16.2L15.8 14.9H13.5V22C18.4 21.2 22 17 22 12C22 6.5 17.5 2 12 2Z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                <path d="M21.6 7.2C21.4 6.4 20.7 5.8 19.9 5.6C18.4 5.2 12 5.2 12 5.2C12 5.2 5.6 5.2 4.1 5.6C3.3 5.8 2.6 6.4 2.4 7.2C2 8.7 2 12 2 12C2 12 2 15.3 2.4 16.8C2.6 17.6 3.3 18.2 4.1 18.4C5.6 18.8 12 18.8 12 18.8C12 18.8 18.4 18.8 19.9 18.4C20.7 18.2 21.4 17.6 21.6 16.8C22 15.3 22 12 22 12C22 12 22 8.7 21.6 7.2ZM10 15V9L15 12L10 15Z"/>
              </svg>
            </a>
            <a href="#" aria-label="Website">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM11 19.9C7.6 19.4 5 16.5 5 13H11V19.9ZM11 11H5C5 7.5 7.6 4.6 11 4.1V11ZM13 19.9V13H19C19 16.5 16.4 19.4 13 19.9ZM13 11V4.1C16.4 4.6 19 7.5 19 11H13Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2025 Tìm Trọ</p>
      </div>
    </footer>
  );
}

export default Footer;

