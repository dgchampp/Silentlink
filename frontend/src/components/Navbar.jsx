import { useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  // Create initials for avatar fallback
  const initials = useMemo(() => {
    const name =
      authUser?.name ||
      authUser?.username ||
      authUser?.email?.split("@")[0] ||
      "";
    return name
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
  }, [authUser]);

  // Shared link styles with active underline
  const baseLink =
    "relative inline-flex items-center gap-2 text-sm font-medium text-base-content/80 hover:text-base-content transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-2 py-1";
  const activeUnderline =
    "after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-primary after:content-[''] motion-safe:after:transition-all after:scale-x-100";
  const inactiveUnderline =
    "after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-transparent after:content-[''] after:scale-x-0";

  return (
    <header className="fixed top-0 z-40 w-full border-b border-base-300/70 bg-base-100/70 backdrop-blur-xl supports-[backdrop-filter]:bg-base-100/60">
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2.5 rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">Silentlink</h1>
            </Link>
          </div>

          {/* Center: Desktop nav (add more links if you want) */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeUnderline : inactiveUnderline}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeUnderline : inactiveUnderline}`
              }
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">Themes</span>
            </NavLink>
            {authUser && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeUnderline : inactiveUnderline}`
                }
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                {/* Avatar button */}
                <Link
                  to="/profile"
                  className="btn btn-ghost btn-sm gap-2 px-2"
                  title="Profile"
                >
                  <div className="avatar placeholder">
                    <div className="size-7 rounded-full bg-base-300 text-base-content/80">
                      <span className="text-xs">{initials || "U"}</span>
                    </div>
                  </div>
                  <span className="hidden sm:inline">
                    {authUser?.username || "Profile"}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="btn btn-sm btn-primary gap-2"
                  title="Logout"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-primary">
                  Sign in
                </Link>
                <Link to="/signup" className="btn btn-sm btn-ghost">
                  Create account
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              aria-label="Toggle menu"
              className="md:hidden btn btn-ghost btn-sm"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-300 ease-out
        overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="container mx-auto px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1">
            <li>
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `btn btn-ghost justify-start ${isActive ? "text-primary" : ""}`
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `btn btn-ghost justify-start gap-2 ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                <Settings className="size-4" />
                Settings
              </NavLink>
            </li>
            {authUser && (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `btn btn-ghost justify-start gap-2 ${
                        isActive ? "text-primary" : ""
                      }`
                    }
                  >
                    <User className="size-4" />
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="btn btn-ghost justify-start gap-2"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
