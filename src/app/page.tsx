import { UsersSidebar } from "@/app/users/users-sidebar";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    directTab?: string;
    directUserId?: string;
    preserveUrl?: string;
    rootGroupId?: string;
  }>;
}) {
  const { rootGroupId, directUserId } = await searchParams;

  return (
    <>
      {rootGroupId && (
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="h-auto mb-1">
            Analyzing root group&nbsp;
            <span className="font-bold"> {rootGroupId}</span>
          </SidebarGroupLabel>
        </SidebarGroup>
      )}
      <UsersSidebar selectedUserId={directUserId} rootGroupId={rootGroupId} />
    </>
  );
}
