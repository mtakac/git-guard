"use client";
import clsx from "clsx";
import { Group, FolderKanban } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type TabLinksProps = {
  userId: string;
  rootGroupId: string;
  activeTab: string;
  groupsCount: number;
  projectsCount: number;
};

export default function TabLinks({ userId, rootGroupId, activeTab, groupsCount, projectsCount }: TabLinksProps) {
  const tabLinksRef = useRef<HTMLDivElement>(null);
  const previousActiveTab = useRef<string | null>(null);

  useGSAP(
    () => {
      const targetPosition = activeTab === "groups" ? "4px" : "calc(100% - 50% - 4px)";

      if (previousActiveTab.current === null) {
        gsap.set(".active-tab", {
          left: targetPosition,
          opacity: 1,
        });
        previousActiveTab.current = activeTab;
      } else if (previousActiveTab.current !== activeTab) {
        gsap.to(".active-tab", {
          left: targetPosition,
          duration: 0.4,
          ease: "power3.inOut",
        });
        previousActiveTab.current = activeTab;
      } else {
        gsap.set(".active-tab", {
          opacity: 1,
        });
      }
    },
    { scope: tabLinksRef, dependencies: [activeTab] }
  );

  return (
    <div
      ref={tabLinksRef}
      className="relative flex shrink-0 bg-stone-200 rounded-sm h-12 justify-between items-center p-1 mb-4"
    >
      <Link
        href={`/users/${userId}/groups?rootGroupId=${rootGroupId}`}
        className={clsx(
          "flex items-center gap-2 w-1/2 justify-center h-full font-semibold text-lg transition-all duration-300 z-20"
        )}
      >
        <Group className="size-5" />
        Groups ({groupsCount})
      </Link>
      <Link
        href={`/users/${userId}/projects?rootGroupId=${rootGroupId}`}
        className={clsx(
          "flex items-center gap-2 w-1/2 justify-center h-full font-semibold text-lg transition-all duration-300 z-20"
        )}
      >
        <FolderKanban className="size-5" />
        Projects ({projectsCount})
      </Link>

      <div className="active-tab absolute w-1/2 h-10 rounded-sm top-[4px] bg-white z-10 opacity-0" />
    </div>
  );
}
