import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs } from '@/components';
import { AppSidebar } from '@/components/app-sidebar';
import { Container } from '@/features';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <div className="w-full h-screen flex items-center justify-center martian-regular">
      <div className="w-full h-full flex border relative">
        <Tabs className="w-full" defaultValue="actions">
          <SidebarProvider>
            <AppSidebar />
            <Container />
            <Toaster />
          </SidebarProvider>
        </Tabs>
      </div>
    </div>
  );
}
