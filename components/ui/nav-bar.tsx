'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { CartButton } from '@/components/ui/cart-button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Notifications } from '@/components/ui/notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe, User, Settings, LogOut, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';

export function NavBar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-purple-300 transition-colors">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        DropIA
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/products" className="text-white/80 hover:text-white transition-colors">
          Explore
        </Link>
        <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
          Categories
        </Link>
        {!loading && user && (
          <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
            Dashboard
          </Link>
        )}
        <button 
          onClick={() => {
            if (user) {
              router.push('/seller/products');
            } else {
              router.push('/login');
            }
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          Sell
        </button>
        <Link href="/help" className="text-white/80 hover:text-white transition-colors">
          Help
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 text-white/80 hover:text-white hover:bg-white/10">
              <Globe className="w-4 h-4" />
              <span className="text-sm">EN</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              English (EN)
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              Español (ES)
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-slate-700">
              Français (FR)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        {!loading && user ? (
          <>
            {/* Admin Menu */}
            {user.isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4" />
                    Admin
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="text-white hover:bg-slate-700 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Panel de Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Seller Menu */}
            {user.isSeller && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-white hover:bg-white/10">
                    <DollarSign className="w-4 h-4" />
                    Vendedor
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link href="/seller/products" className="text-white hover:bg-slate-700 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Mis Productos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/seller/orders" className="text-white hover:bg-slate-700 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Órdenes Recibidas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/seller/balance" className="text-white hover:bg-slate-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Balance y Pagos
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-white hover:bg-white/10">
                  <User className="w-4 h-4" />
                  {user.name || 'Mi Cuenta'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="text-white hover:bg-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-white hover:bg-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-products" className="text-white hover:bg-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Mis Productos Digitales
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="text-white hover:bg-slate-700 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Mis Órdenes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-white hover:bg-slate-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Notifications />
          </>
        ) : !loading ? (
          <>
            <Link href="/login" className="text-white/80 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button 
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/register">
                Sign Up
              </Link>
            </Button>
          </>
        ) : null}
        
        <CartButton />
        <ModeToggle />
      </div>
    </nav>
  );
}