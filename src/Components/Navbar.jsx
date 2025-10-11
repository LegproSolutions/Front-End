import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, LogOut, Bell, Search, Home, FileText, Building2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import UserLogin from "./Auth/UserLogin";
import { Button } from "../components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { cn } from "../lib/utils";

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    userData,
    isUserAuthenticated,
    setShowRecruiterLogin,
    userlogout,
    isLoggingOut,
  } = useContext(AppContext);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Find Jobs", href: "/jobs", icon: Search },
    { name: "Applied Jobs", href: "/application", icon: FileText },
    { name: "Companies", href: "/companies", icon: Building2 },
  ];

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 mx-auto">
          {/* Logo */}
          <Link to="/" className="mr-8 flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Mela
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActiveRoute(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & User Menu */}
          <div className="flex items-center space-x-4">
            {isUserAuthenticated ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userData?.profileImg} alt={userData?.name} />
                        <AvatarFallback>
                          {(userData?.firstName?.[0] || userData?.name?.[0] || "U").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {userData?.firstName || userData?.name || "User"}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/application" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Applied Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={userlogout}
                      disabled={isLoggingOut}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowRecruiterLogin(true)}
                  className="text-muted-foreground"
                >
                  Recruiter Login
                </Button>
                <Button onClick={() => setLoginOpen(true)}>
                  Login
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Job Mela
                    </h2>
                  </div>
                  
                  {/* Mobile Navigation Items */}
                  <div className="flex flex-col space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                            isActiveRoute(item.href)
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile User Section */}
                  {isUserAuthenticated ? (
                    <div className="border-t pt-4 mt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userData?.profileImg} alt={userData?.name} />
                          <AvatarFallback>
                            {(userData?.firstName?.[0] || userData?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">
                            {userData?.firstName || userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            userlogout();
                            setMobileMenuOpen(false);
                          }}
                          disabled={isLoggingOut}
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4 mt-6 space-y-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowRecruiterLogin(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        Recruiter Login
                      </Button>
                      <Button 
                        onClick={() => {
                          setLoginOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {loginOpen && (
        <UserLogin 
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;