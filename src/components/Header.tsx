import React, { useEffect, useRef, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { toggleSidebar } from "../store/uiStore";
import { cartItemCount } from "../store/checkoutStore";

// Componente reutilizable para enlaces de navegación
function NavLink({
  href,
  children,
  isActive = false,
  hoverColor = "amber",
}: {
  href: string;
  children: string;
  isActive?: boolean;
  hoverColor?: "amber" | "purple" | "rose";
}) {
  const baseClasses =
    "font-body text-sm uppercase tracking-wide relative group transition-colors";

  const hoverColors = {
    amber: "hover:text-amber-600",
    purple: "hover:text-purple-600",
    rose: "hover:text-rose-600",
  };

  const colorClasses = isActive
    ? "text-purple-600 font-medium underline underline-offset-4 decoration-purple-600"
    : `text-gray-600 ${hoverColors[hoverColor]}`;

  return (
    <a
      href={href}
      className={`${baseClasses} ${colorClasses}`}
      style={{ letterSpacing: "0.1em" }}
    >
      {children}
    </a>
  );
}

// Componente reutilizable para botones de acción
function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 text-gray-600 transition-colors hover:text-rose-500"
    >
      {children}
    </button>
  );
}

export default function Header() {
  useSignals();
  const headerRef = useRef<HTMLElement>(null);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // Detectar la página actual
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }

    const handleScroll = () => {
      if (headerRef.current) {
        const scrolled = window.scrollY > 50;
        if (scrolled) {
          headerRef.current.classList.add("glass-effect");
          headerRef.current.classList.remove("bg-white");
        } else {
          headerRef.current.classList.remove("glass-effect");
          headerRef.current.classList.add("bg-white");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-gray-100 bg-white transition-all duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="font-heading text-3xl font-bold text-pink-600"
              >
                Crazzula
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => toggleSidebar()}
              className="p-2 text-gray-600 transition-colors hover:text-gray-900 md:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              <NavLink
                href="/"
                isActive={currentPath === "/"}
                hoverColor="amber"
              >
                HOME
              </NavLink>
              <NavLink
                href="/catalogo"
                isActive={currentPath.startsWith("/catalogo")}
                hoverColor="amber"
              >
                CATÁLOGO
              </NavLink>
              <NavLink
                href="/tendencia"
                isActive={currentPath === "/tendencia"}
                hoverColor="purple"
              >
                TENDENCIA
              </NavLink>
              <NavLink
                href="/contacto"
                isActive={currentPath === "/contacto"}
                hoverColor="rose"
              >
                CONTACTO
              </NavLink>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ActionButton>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </ActionButton>
              <ActionButton>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </ActionButton>
              <div className="relative">
                <a
                  href="/carrito"
                  className="block p-3 text-gray-600 transition-colors hover:text-rose-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </a>
                {cartItemCount.value > 0 && (
                  <a
                    href="/carrito"
                    data-testid="cart-count"
                    className="gradient-background absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-[10px] shadow-lg"
                  >
                    {cartItemCount.value}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
