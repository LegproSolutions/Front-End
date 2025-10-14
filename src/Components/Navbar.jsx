import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, LogOut, Bell, Search, Home, FileText, Building2, Briefcase, Settings } from "lucide-react";
import { AppContext } from "../context/AppContext";
import UserLogin from "./Auth/UserLogin";
import { Button } from "../components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
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
    userlogout,
    isLoggingOut,
  } = useContext(AppContext);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Applied Jobs", href: "/application", icon: FileText },
    
  ];

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Job Mela
              </h1>
              <span className="text-[10px] text-muted-foreground -mt-1">Find Your Dream Job</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & User Menu */}
          <div className="flex items-center space-x-3">
            {isUserAuthenticated ? (
              <>
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative hover:bg-gray-100 rounded-full"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 rounded-full hover:bg-gray-100 p-1"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                          <AvatarImage src={userData?.profileImg} alt={userData?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                            {(userData?.firstName?.[0] || userData?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block text-sm font-medium text-gray-700">
                          {userData?.firstName || userData?.name || "User"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-3 p-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={userData?.profileImg} alt={userData?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                            {(userData?.firstName?.[0] || userData?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="font-semibold text-sm">
                            {userData?.firstName || userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-3 h-4 w-4 text-gray-600" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/application" className="flex items-center cursor-pointer">
                        <FileText className="mr-3 h-4 w-4 text-gray-600" />
                        <span>My Applications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                     
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={userlogout}
                      disabled={isLoggingOut}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setLoginOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 rounded-lg">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Job Mela
                      </h2>
                      <span className="text-[10px] text-muted-foreground -mt-1">Find Your Dream Job</span>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation Items */}
                  <div className="flex flex-col space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile User Section */}
                  {isUserAuthenticated ? (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10 ring-2 ring-white">
                          <AvatarImage src={userData?.profileImg} alt={userData?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                            {(userData?.firstName?.[0] || userData?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">
                            {userData?.firstName || userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 text-gray-600"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                 
                        <Button
                          variant="ghost"
                          onClick={() => {
                            userlogout();
                            setMobileMenuOpen(false);
                          }}
                          disabled={isLoggingOut}
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 px-4 py-2.5"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button 
                        onClick={() => {
                          setLoginOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                      >
                        <User className="mr-2 h-4 w-4" />
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