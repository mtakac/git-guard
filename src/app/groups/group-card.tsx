import { Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitLabAccessLevel, GitLabGroup } from "@/schemas";

interface GroupCardProps {
  group: GitLabGroup & { membersCount: number; accessLevel: GitLabAccessLevel };
  className?: string;
}

export default function GroupCard({ group, className }: GroupCardProps) {
  const { name, description, path, visibility, webUrl, membersCount, accessLevel } = group;

  return (
    <Link href={webUrl} target="_blank" className={className}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {name}
            <Badge variant="outline" className="uppercase">
              {GitLabAccessLevel[accessLevel]}
            </Badge>
          </CardTitle>
          <CardDescription>{path}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground h-[40px] overflow-hidden line-clamp-2">
            {description || "No description"}
          </p>
        </CardContent>
        <CardFooter className="flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span className="text-sm">{membersCount} members</span>
          </div>
          <Badge variant="secondary" className="uppercase">
            {visibility}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
