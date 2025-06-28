import { Link, useLocation } from "react-router-dom";
import DDMenu, { MenuItem } from "@asafarim/dd-menu";
import "@asafarim/dd-menu/dist/index.css";
import "@asafarim/react-themes/styles.css";
import "./TopNavBar.css";
import { ThemeSelector, useTheme } from "@asafarim/react-themes";

interface TopNavBarProps {}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface HelpMenuItem {
  id: string;
  text: string;
  label: string;
  link: string;
}

export default function TopNavBar({}: TopNavBarProps) {
  const location = useLocation();
  const { mode } = useTheme();
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/help") return "help";
    if (path === "/about") return "about";
    if (path === "/simple") return "simple";
    if (path === "/advanced") return "advanced";
    if (path === "/csv") return "csv";
    return "simple";
  };

  const currentPage = getCurrentPage();

  const navigationItems: NavigationItem[] = [
    { id: "simple", label: "Simple Model", icon: "🌊", path: "/simple" },
    { id: "advanced", label: "Advanced Models", icon: "⚙️", path: "/advanced" },
    { id: "csv", label: "Load CSV Data", icon: "📊", path: "/csv" },
  ];

  const helpMenuItems: HelpMenuItem[] = [
    {
      id: "docs",
      text: "Model Documentation",
      label: "Model Documentation",
      link: "/help#documentation",
    },
    {
      id: "guide",
      text: "User Guide",
      label: "User Guide",
      link: "/help#guide",
    },
    { id: "faq", text: "FAQ", label: "FAQ", link: "/help#faq" },
    {
      id: "about",
      text: "About AquaFlow",
      label: "About AquaFlow",
      link: "/about",
    },
  ];

  return (
    <nav className="top-navbar theme-nav">
      <div className="navbar-container">
        {/* Logo and Title */}
        <Link to="/" className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">🌊</span>
            <span className="logo-text">AquaFlow</span>
          </div>
          <span className="tagline">Hydrological Modeling Platform</span>
        </Link>

        {/* Navigation Items */}
        <div className="navbar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item theme-nav-item ${
                currentPage === item.id ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Help Menu */}
        <div className="help-menu">
          <DDMenu
            items={helpMenuItems}
            trigger="❓"
            size="md"
            theme={mode}
            className="dd_menu dd_menu_trigger"
            onItemClick={(item) => {
              if (item.link) {
                if (item.link.startsWith("/help")) {
                  // Navigate to help page and handle hash scrolling
                  window.location.href = item.link;
                } else if (item.link === "/about") {
                  // Navigate to about page
                  window.location.href = item.link;
                }
              }
            }}
          />
        </div>

        {/* Theme Toggle */}
        <ThemeSelector
          showLabels={true}
          className="theme-selector"
          options={[
            { mode: "light", label: "Light", icon: "☀️" },
            { mode: "dark", label: "Dark", icon: "🌙" },
          ]}
        />
      </div>
    </nav>
  );
}
