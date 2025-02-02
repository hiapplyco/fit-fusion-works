import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { EmailSignup } from "./navbar/EmailSignup";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const { open, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  const isVisible = isMobile ? openMobile : open;

  return (
    <div 
      className={`fixed top-0 left-0 h-screen w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } z-50`}
    >
      <div className="p-4">
        <SidebarLogo />
        <div className="mt-4">
          <EmailSignup />
        </div>
      </div>
      <div className="flex-1 px-4">
        <div className="text-sm font-medium text-muted-foreground">Navigation</div>
        <div className="mt-2">
          <SidebarNavigation />
        </div>
      </div>
    </div>
  );
}