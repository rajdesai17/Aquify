import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplets, Menu, X, LogOut, UserCircle, Map, Plus, ChevronDown, Shield, MapPin, Heart, Users, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      setIsOpen(false); // Close mobile menu if open
      
      await signOut();
      
      // Toast will be shown on redirect
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMobileSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Stations", path: "/find" },
    { name: "Add Station", path: "/add" },
    { name: "Sponsor", path: "/sponsor" },
    { name: "Join Us", path: "/join-us" },
    // Only show admin link for admin users
    ...(isAdmin ? [{ name: "Admin Dashboard", path: "/admin" }] : []),
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 
      ${isOpen ? 'bg-white shadow-lg' : 'bg-transparent'}
      ${location.pathname === '/' ? '' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animation */}
          <Link 
            to="/" 
            className="flex items-center group z-50"
          >
            <Droplets className={`h-8 w-8 mr-2 transform group-hover:scale-110 transition-transform duration-300 
              ${isOpen || location.pathname !== '/' ? 'text-aquify-blue' : 'text-aquify-blue'}`} 
            />
            <span className={`text-xl font-bold transition-all duration-300
              ${isOpen || location.pathname !== '/' 
                ? 'bg-gradient-to-r from-aquify-blue to-aquify-darkBlue bg-clip-text text-transparent'
                : 'text-aquify-blue'
              }`}>
              Aquify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                  ${isActive(link.path)
                    ? "text-aquify-blue bg-blue-50/80 shadow-sm"
                    : "text-gray-700 hover:text-aquify-blue hover:bg-blue-50/50"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Button with animations */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-1 px-4 py-2 rounded-full hover:bg-blue-50/50 transition-all duration-300"
                  >
                    <UserCircle className="h-5 w-5 mr-1 text-aquify-blue" />
                    <span className="text-sm font-medium">
                      {profile?.username || user.email?.split("@")[0] || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-aquify-blue hover:bg-aquify-darkBlue text-white rounded-full px-6 
                          transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                size="sm"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-full transition-all duration-300 focus:outline-none
              ${isOpen || location.pathname !== '/' 
                ? 'text-gray-700 hover:text-aquify-blue hover:bg-blue-50/50' 
                : 'text-aquify-blue hover:bg-white/20'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Updated Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 top-20 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-[-100%] pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/5 backdrop-blur-sm transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div 
          className={`relative w-full h-full bg-white transform transition-all duration-300 shadow-xl
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'}
          `}
        >
          <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-4 rounded-xl text-base font-medium transition-all duration-200
                    flex items-center gap-3 active:scale-95
                    ${isActive(link.path)
                      ? "text-aquify-blue bg-blue-50/80 shadow-sm"
                      : "text-gray-700 hover:text-aquify-blue hover:bg-blue-50/70"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {/* Add icons for each link */}
                  {link.path === "/" && <Droplets className="h-5 w-5" />}
                  {link.path === "/find" && <MapPin className="h-5 w-5" />}
                  {link.path === "/add" && <Plus className="h-5 w-5" />}
                  {link.path === "/sponsor" && <Heart className="h-5 w-5" />}
                  {link.path === "/join-us" && <Users className="h-5 w-5" />}
                  {link.path === "/admin" && <Shield className="h-5 w-5" />}
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-100 my-4 pt-4">
                {user ? (
                  <>
                    {/* User Profile Section */}
                    <div className="px-4 py-3 mb-4 rounded-xl bg-blue-50/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-aquify-blue/10 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-aquify-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {profile?.username || user.email?.split("@")[0]}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:text-aquify-blue 
                               hover:bg-blue-50/70 flex items-center active:scale-95 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserCircle className="h-5 w-5 mr-3" />
                      My Profile
                    </Link>

                    <button
                      onClick={handleMobileSignOut}
                      className="w-full mt-2 px-4 py-4 rounded-xl text-base font-medium text-red-500 
                               hover:bg-red-50 flex items-center active:scale-95 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="w-full px-4 py-4 rounded-xl text-base font-medium bg-aquify-blue text-white 
                             hover:bg-aquify-darkBlue flex items-center justify-center active:scale-95 
                             transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
