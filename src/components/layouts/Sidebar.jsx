import React, { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Archive,
  Settings,
  HelpCircle,
  Search,
  Plus,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { JOB_STATUS, STATUS_COLORS } from "../../constants/jobStatus";
import "./Sidebar.css";

const Sidebar = ({
  activeView,
  onViewChange,
  applications = [],
  userName = "User",
  userEmail = "user@example.com",
  onLogout,
}) => {
  const [expandedMenus, setExpandedMenus] = useState({
    applications: true,
  });

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Calculate statistics using constants
  const stats = {
    total: applications.length,
    requested: applications.filter((j) => j.status === JOB_STATUS.APPLIED).length,
    inProgress: applications.filter((j) => j.status === JOB_STATUS.INTERVIEWING).length,
    done: applications.filter((j) => j.status === JOB_STATUS.OFFERED).length,
    rejected: applications.filter((j) => j.status === JOB_STATUS.REJECTED).length,
  };

  const menuItems = [
    {
      section: "MAIN",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          active: activeView === "dashboard",
          onClick: () => onViewChange("kanban"),
        },
        {
          id: "applications",
          label: "Applications",
          icon: <Briefcase size={18} />,
          count: stats.total,
          active: activeView === "kanban" || activeView === "table",
          hasSubmenu: true,
          isExpanded: expandedMenus.applications,
          onToggle: () => toggleMenu("applications"),
          subItems: [
            {
              id: "kanban",
              label: "Kanban Board",
              icon: "📋",
              active: activeView === "kanban",
              onClick: () => onViewChange("kanban"),
            },
            {
              id: "table",
              label: "Table View",
              icon: "📊",
              active: activeView === "table",
              onClick: () => onViewChange("table"),
            },
          ],
        },
      ],
    },
    {
      section: "STATUS",
      items: [
        {
          id: "requested",
          label: "Requested",
          icon: <FileText size={18} />,
          count: stats.requested,
          color: STATUS_COLORS[JOB_STATUS.APPLIED],
          active: false,
        },
        {
          id: "in-progress",
          label: "In Progress",
          icon: <Clock size={18} />,
          count: stats.inProgress,
          color: STATUS_COLORS[JOB_STATUS.INTERVIEWING],
          active: false,
        },
        {
          id: "done",
          label: "Done",
          icon: <CheckCircle size={18} />,
          count: stats.done,
          color: STATUS_COLORS[JOB_STATUS.OFFERED],
          active: false,
        },
        {
          id: "rejected",
          label: "Rejected",
          icon: <Archive size={18} />,
          count: stats.rejected,
          color: STATUS_COLORS[JOB_STATUS.REJECTED],
          active: false,
        },
      ],
    },
    {
      section: "GENERAL",
      items: [
        {
          id: "favorites",
          label: "Favorites",
          icon: <Star size={18} />,
          active: false,
          onClick: () => console.log("Favorites"),
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: <TrendingUp size={18} />,
          active: false,
          onClick: () => console.log("Analytics"),
        },
      ],
    },
  ];

  return (
    <aside className="sidebar-supabase">
      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <div className="sidebar-logo-icon">
          <Briefcase size={24} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-brand-name">JobUp</span>
          <span className="sidebar-brand-subtitle">Job Tracker</span>
        </div>
      </div>

      {/* Quick Search */}
      <div className="sidebar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search applications..."
          className="sidebar-search-input"
        />
      </div>

      {/* New Application Button */}
      <div className="sidebar-action">
        <button className="sidebar-new-btn">
          <Plus size={18} />
          <span>New Application</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-navigation">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            <div className="sidebar-section-title">{section.section}</div>
            <ul className="sidebar-menu-list">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a
                    className={`sidebar-menu-item ${item.active ? "active" : ""} ${item.hasSubmenu ? "has-submenu" : ""}`}
                    onClick={(e) => {
                      if (item.hasSubmenu && item.onToggle) {
                        e.preventDefault();
                        item.onToggle();
                      } else if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    href="#"
                  >
                    <span
                      className="sidebar-menu-icon"
                      style={item.color ? { color: item.color } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className="sidebar-menu-label">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="sidebar-menu-count">{item.count}</span>
                    )}
                    {item.hasSubmenu && (
                      <ChevronDown
                        size={14}
                        className={`sidebar-menu-arrow ${item.isExpanded ? "expanded" : ""}`}
                      />
                    )}
                  </a>

                  {/* Sub Items */}
                  {item.hasSubmenu && item.isExpanded && (
                    <ul className="sidebar-submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            className={`sidebar-submenu-item ${subItem.active ? "active" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (subItem.onClick) {
                                subItem.onClick();
                              }
                            }}
                            href="#"
                          >
                            <span className="sidebar-submenu-dot"></span>
                            <span>{subItem.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-bottom-links">
          <a className="sidebar-bottom-link" href="#">
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </a>
          <a className="sidebar-bottom-link" href="#">
            <Settings size={16} />
            <span>Settings</span>
          </a>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <User size={18} />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-email">{userEmail}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
