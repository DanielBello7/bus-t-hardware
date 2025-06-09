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
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-xl py-[28px] px-4 border-b rounded-none">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-4 px-2">
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
