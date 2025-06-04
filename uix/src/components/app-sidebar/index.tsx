import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { items } from './items';
import { AppSidebarItem } from './app-sidebar-item';
import { TabsList } from '../ui';

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-6">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <TabsList>
              <SidebarMenu>
                {items.map((item, idx) => {
                  return (
                    <AppSidebarItem
                      key={idx}
                      icon={item.icon}
                      title={item.title}
                      url={item.url}
                    />
                  );
                })}
              </SidebarMenu>
            </TabsList>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
