"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { GitLabAccessLevel, GitLabGroup } from "@/schemas";

import GroupCard from "./group-card";

gsap.registerPlugin(useGSAP);

type GroupsListProps = {
  groups: (GitLabGroup & { membersCount: number; accessLevel: GitLabAccessLevel })[];
  selectedUserId: string;
};

export default function GroupsList({ groups, selectedUserId }: GroupsListProps) {
  const groupsListRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".group-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: Math.min(groups.length * 0.1, 1.2), // 0.1s per group, max 1.2s total
          from: "start",
        },
      });
    },
    { scope: groupsListRef, dependencies: [groups] }
  );

  return (
    <div ref={groupsListRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map((group) => (
        <GroupCard
          key={`${selectedUserId}-${group.id}`}
          group={group}
          className="group-card opacity-0 scale-75 translate-y-40"
        />
      ))}
    </div>
  );
}
