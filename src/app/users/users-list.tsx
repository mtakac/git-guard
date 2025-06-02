"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { GitLabUser } from "@/schemas";

type UsersListProps = {
  users: GitLabUser[];
  selectedUserId?: string;
  rootGroupId?: string;
};

export function UsersList({ users, selectedUserId, rootGroupId }: UsersListProps) {
  const selectedUserRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const handleUserClick = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem("sidebar-scroll-position", scrollContainerRef.current.scrollTop.toString());
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    if (isInitialLoad.current) {
      sessionStorage.removeItem("sidebar-scroll-position");
      scrollContainerRef.current.scrollTop = 0;
      isInitialLoad.current = false;
    } else {
      const savedPosition = sessionStorage.getItem("sidebar-scroll-position");
      if (savedPosition) {
        scrollContainerRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  }, [users]);

  useEffect(() => {
    if (selectedUserId && selectedUserRef.current) {
      selectedUserRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedUserId]);

  return (
    <SidebarContent ref={scrollContainerRef}>
      <SidebarGroup className="pt-0">
        {rootGroupId && (
          <SidebarGroupLabel className="h-auto mb-2">
            Found&nbsp;
            <span className="font-bold">{users.length}</span>
            &nbsp;users
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {users.map((user) => (
              <div
                key={user.id}
                className="mb-1 last:mb-0"
                ref={user.id === Number(selectedUserId) ? selectedUserRef : null}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    isActive={user.id === Number(selectedUserId)}
                    variant="outline"
                    className="h-16"
                  >
                    <Link href={`/users/${user.id}/groups?rootGroupId=${rootGroupId}`} onClick={handleUserClick}>
                      <Avatar className="mr-3">
                        <AvatarImage src={user.avatarUrl ?? ""} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.username}</p>
                      </div>
                    </Link>
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
