"use server";
import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar";

export async function UserSearchForm() {
  return (
    <form method="GET" action="/">
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <Label htmlFor="search" className="sr-only">
            Analyze root group
          </Label>

          <div className="flex w-full items-center gap-2">
            <SidebarInput type="text" placeholder="Analyze root group..." className="pl-8 h-10" name="rootGroupId" />
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 opacity-50 select-none" />
            <Button type="submit" size="lg">
              Analyze
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
