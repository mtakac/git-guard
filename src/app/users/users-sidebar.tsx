"use server";
import { Suspense } from "react";

import { UsersList } from "@/app/users/users-list";
import { UsersListSkeleton } from "@/app/users/users-list-skeleton";
import { getGitLabUsers } from "@/lib/gitlab-service";
import { SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

type UsersSidebarProps = {
  selectedUserId?: string;
  rootGroupId?: string;
};

async function UsersListWrapper({ selectedUserId, rootGroupId }: UsersSidebarProps) {
  const users = rootGroupId ? await getGitLabUsers(rootGroupId) : [];
  return <UsersList users={users} selectedUserId={selectedUserId} rootGroupId={rootGroupId} />;
}

function EmptyState() {
  return (
    <SidebarContent>
      <SidebarGroup className="pt-0">
        <SidebarGroupLabel className="h-auto mb-2 text-muted-foreground">
          Enter a root group ID to search for users
        </SidebarGroupLabel>
      </SidebarGroup>
    </SidebarContent>
  );
}

export async function UsersSidebar({ selectedUserId, rootGroupId }: UsersSidebarProps) {
  if (!rootGroupId) {
    return <EmptyState />;
  }

  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsersListWrapper selectedUserId={selectedUserId} rootGroupId={rootGroupId} />
    </Suspense>
  );
}
