import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersListSkeleton() {
  return (
    <SidebarContent>
      <SidebarGroup className="pt-0">
        <SidebarGroupLabel className="h-auto mb-2">
          <Skeleton className="h-4 w-24" />
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 25 }).map((_, index) => (
              <div key={index} className="mb-1 last:mb-0">
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" className="h-16 cursor-default">
                    <Skeleton className="size-10 rounded-full mr-3 shrink-0" />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <Skeleton className="h-4 w-full max-w-32" />
                      <Skeleton className="h-3 w-full max-w-24" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
