import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { customToast } from "../utils/customToast.jsx";
import {
  Search,
  Home,
  Building2,
  Info,
  Mail,
  User,
  LogOut,
  Users,
  Menu,
  X,
  Key,
  ClipboardCheck,
  Coins,
  BarChart3,
} from "lucide-react";

function Navbar({ currentUser, onLogout }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sticky navbar with blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClick = () => {
    setShowUserDropdown(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setShowUserDropdown(false);

    // Note: We keep rememberedEmail in localStorage so user doesn't need to retype email next time
    // Only remove it if user unchecks "Remember Me" on login page

    onLogout();
    customToast.success("Đăng xuất thành công! 👋");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const contactSection = document.querySelector(".contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/#contact");
      setTimeout(() => {
        const contactSection = document.querySelector(".contact-section");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
    setShowMobileMenu(false);
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/#about");
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
    setShowMobileMenu(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`navbar-new ${isScrolled ? "navbar-scrolled" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: isScrolled ? "rgba(255, 255, 255, 0.9)" : "white",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: isScrolled ? "0 4px 12px rgba(0, 0, 0, 0.05)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Building2 size={24} strokeWidth={2.5} />
          <span>Tìm Trọ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav-desktop">
          <Link
            to="/"
            className={`navbar-link ${
              isActive("/") ? "navbar-link-active" : ""
            }`}
          >
            <Home size={18} />
            Trang chủ
          </Link>
          <Link
            to="/rooms/phong-tro"
            className={`navbar-link ${
              isActive("/rooms/phong-tro") ? "navbar-link-active" : ""
            }`}
          >
            <Building2 size={18} />
            Danh sách trọ
          </Link>
          <a href="#about" onClick={handleAboutClick} className="navbar-link">
            <Info size={18} />
            Giới thiệu
          </a>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="navbar-link"
          >
            <Mail size={18} />
            Liên hệ
          </a>
          {currentUser && (
            <Link
              to={`/revenue/${currentUser.id}`}
              className={`navbar-link ${
                isActive(`/revenue/${currentUser.id}`)
                  ? "navbar-link-active"
                  : ""
              }`}
            >
              <Coins size={18} />
              Doanh thu
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="navbar-right">
          {!currentUser ? (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="navbar-btn-ghost">
                Đăng nhập
              </Link>
              <Link to="/register" className="navbar-btn-primary">
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="navbar-user-dropdown">
              <button
                className="navbar-user-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="navbar-user-avatar">
                  <User size={18} />
                </div>
                <span className="navbar-user-name">{currentUser.username}</span>
                {currentUser.role === "ADMIN" && (
                  <span className="navbar-admin-badge">ADMIN</span>
                )}
              </button>

              {showUserDropdown && (
                <div className="navbar-dropdown-menu">
                  <button
                    onClick={handleProfileClick}
                    className="navbar-dropdown-item"
                  >
                    <User size={18} />
                    Thông tin cá nhân
                  </button>
                  <Link
                    to="/account/rooms"
                    className="navbar-dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <Key size={18} />
                    Phòng của tôi
                  </Link>
                  <Link
                    to="/landlord/booking-requests"
                    className="navbar-dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <ClipboardCheck size={18} />
                    Yêu cầu thuê phòng
                  </Link>

                  {currentUser.role === "ADMIN" && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="navbar-dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <BarChart3 size={18} />
                        Dashboard Analytics
                      </Link>
                      <Link
                        to="/admin/users"
                        className="navbar-dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Users size={18} />
                        Quản lý người dùng
                      </Link>
                      <Link
                        to="/admin/revenue"
                        className="navbar-dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Users size={18} />
                        Giao Dịch
                      </Link>
                    </>
                  )}
                  {currentUser.role === "HOST" && (
                    <Link
                      to="/admin/users"
                      className="navbar-dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Users size={18} />
                      Quản lý người dùng
                    </Link>
                  )}

                  <div className="navbar-dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="navbar-dropdown-item navbar-dropdown-item-logout"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="navbar-mobile-menu">
          <Link
            to="/"
            className={`navbar-mobile-link ${
              isActive("/") ? "navbar-mobile-link-active" : ""
            }`}
            onClick={() => setShowMobileMenu(false)}
          >
            <Home size={20} />
            Trang chủ
          </Link>
          <Link
            to="/rooms/phong-tro"
            className={`navbar-mobile-link ${
              isActive("/rooms/phong-tro") ? "navbar-mobile-link-active" : ""
            }`}
            onClick={() => setShowMobileMenu(false)}
          >
            <Building2 size={20} />
            Danh sách trọ
          </Link>
          <a
            href="#about"
            onClick={handleAboutClick}
            className="navbar-mobile-link"
          >
            <Info size={20} />
            Giới thiệu
          </a>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="navbar-mobile-link"
          >
            <Mail size={20} />
            Liên hệ
          </a>

          {!currentUser && (
            <>
              <div className="navbar-mobile-divider"></div>
              <Link
                to="/login"
                className="navbar-mobile-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <User size={20} />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="navbar-mobile-link navbar-mobile-link-primary"
                onClick={() => setShowMobileMenu(false)}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
