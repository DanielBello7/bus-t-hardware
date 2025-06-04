import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { TabsTrigger } from '../ui';
import React from 'react';

type Props = {
  title: string;
  url: string;
  icon: React.ReactElement;
};

export function AppSidebarItem(props: Props) {
  const { icon, title, url } = props;

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton asChild>
        <TabsTrigger
          value={url}
          className="py-5 cursor-pointer hover:bg-slate-200"
        >
          {icon}
          <span className="text-xl">{title}</span>
        </TabsTrigger>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
