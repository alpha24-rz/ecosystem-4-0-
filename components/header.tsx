"use client"

import { useState, useEffect, useCallback, Fragment, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Leaf, Menu, X, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthContext } from "@/components/auth/auth-provider"

// Memoize navItems to prevent unnecessary re-renders
const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "NFTs", href: "/nfts" },
  { name: "Learn", href: "/learn" },
] as const

// Memoized NavLink component
const NavLink = memo(function NavLink({
  href,
  children,
  active,
  className = "",
}: {
  href: string
  children: React.ReactNode
  active: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded",
        active ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-200",
        "hover:text-green-600 dark:hover:text-green-400",
        className
      )}
      aria-current={active ? "page" : undefined}
      prefetch={active ? undefined : true} // Prefetch non-active links
    >
      {children}
    </Link>
  )
})

// Memoized UserMenu component
const UserMenu = memo(function UserMenu({
  isAdmin,
  onLogout,
}: {
  isAdmin: boolean
  onLogout: () => Promise<void>
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Sign Out
      </Button>

      {isAdmin ? (
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/20 transition-shadow"
        >
          <Link href="/admin" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="secondary"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Link href="/user" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Link>
        </Button>
      )}
    </div>
  )
})

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, userData, logout } = useAuthContext()

  // Throttle scroll handler for better performance
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100)
    window.addEventListener("scroll", throttledScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledScroll)
  }, [handleScroll])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const isAdmin = userData?.role === "admin" || userData?.role === "super_admin"

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent dark:bg-transparent",
        "supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80" // Fallback for browsers without backdrop-filter support
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - optimized with priority loading */}
        <Link
          href="/"
          className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-md">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent select-none">
            Ecosystem 4.0
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.name} href={item.href} active={pathname === item.href}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <UserMenu isAdmin={isAdmin} onLogout={handleLogout} />
          ) : (
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - optimized with CSS transforms */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
          "transform-gpu", // Use GPU acceleration
          isMenuOpen
            ? "max-h-screen py-4 opacity-100 translate-y-0"
            : "max-h-0 py-0 opacity-0 -translate-y-2"
        )}
        style={{ willChange: 'transform, opacity, max-height' }} // Hint to browser for optimization
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              active={pathname === item.href}
              className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-2 border-t dark:border-gray-800">
            {user ? (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign Out
                </Button>
                {isAdmin ? (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/20 transition-shadow"
                  >
                    <Link href="/admin" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="secondary"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Link href="/user" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
"use client"

import { useState, useEffect, useCallback, Fragment, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Leaf, Menu, X, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthContext } from "@/components/auth/auth-provider"

// Memoize navItems to prevent unnecessary re-renders
const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "NFTs", href: "/nfts" },
  { name: "Learn", href: "/learn" },
] as const

// Memoized NavLink component
const NavLink = memo(function NavLink({
  href,
  children,
  active,
  className = "",
}: {
  href: string
  children: React.ReactNode
  active: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded",
        active ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-200",
        "hover:text-green-600 dark:hover:text-green-400",
        className
      )}
      aria-current={active ? "page" : undefined}
      prefetch={active ? undefined : true} // Prefetch non-active links
    >
      {children}
    </Link>
  )
})

// Memoized UserMenu component
const UserMenu = memo(function UserMenu({
  isAdmin,
  onLogout,
}: {
  isAdmin: boolean
  onLogout: () => Promise<void>
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Sign Out
      </Button>

      {isAdmin ? (
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/20 transition-shadow"
        >
          <Link href="/admin" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="secondary"
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Link href="/user" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Link>
        </Button>
      )}
    </div>
  )
})

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, userData, logout } = useAuthContext()

  // Throttle scroll handler for better performance
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100)
    window.addEventListener("scroll", throttledScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledScroll)
  }, [handleScroll])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const isAdmin = userData?.role === "admin" || userData?.role === "super_admin"

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent dark:bg-transparent",
        "supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80" // Fallback for browsers without backdrop-filter support
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - optimized with priority loading */}
        <Link
          href="/"
          className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-md">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent select-none">
            Ecosystem 4.0
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.name} href={item.href} active={pathname === item.href}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <UserMenu isAdmin={isAdmin} onLogout={handleLogout} />
          ) : (
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - optimized with CSS transforms */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
          "transform-gpu", // Use GPU acceleration
          isMenuOpen
            ? "max-h-screen py-4 opacity-100 translate-y-0"
            : "max-h-0 py-0 opacity-0 -translate-y-2"
        )}
        style={{ willChange: 'transform, opacity, max-height' }} // Hint to browser for optimization
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              active={pathname === item.href}
              className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-2 border-t dark:border-gray-800">
            {user ? (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign Out
                </Button>
                {isAdmin ? (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/20 transition-shadow"
                  >
                    <Link href="/admin" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="secondary"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Link href="/user" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Simple throttle function for scroll events
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return function (this: any, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  } as T
}