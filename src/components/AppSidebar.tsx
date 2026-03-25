import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CalendarDays,
  ArrowLeftRight,
  CalendarClock,
  Users,
  Bell,
  Flame,
} from 'lucide-react';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Escala Mensal', url: '/escala', icon: CalendarDays },
  { title: 'Permutas', url: '/permutas', icon: ArrowLeftRight },
  { title: 'Permutas do Dia', url: '/permutas-dia', icon: CalendarClock },
  { title: 'Militares', url: '/militares', icon: Users },
  { title: 'Alertas', url: '/alertas', icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="fire-gradient rounded-lg p-2">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-wider text-foreground">FIREFIGHTER</h1>
              <p className="text-[10px] text-muted-foreground font-body">GESTÃO DE ESCALA</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      activeClassName="bg-primary/20 text-secondary border-l-2 border-secondary"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
