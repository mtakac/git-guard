"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { GitLabAccessLevel, GitLabProject } from "@/schemas";

import ProjectCard from "./project-card";

gsap.registerPlugin(useGSAP);

type ProjectsListProps = {
  projects: (GitLabProject & { membersCount: number; accessLevel: GitLabAccessLevel })[];
  selectedUserId: string;
};

export default function ProjectsList({ projects, selectedUserId }: ProjectsListProps) {
  const projectsListRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".project-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: Math.min(projects.length * 0.1, 1.2), // 0.1s per project, max 1.2s total
          from: "start",
        },
      });
    },
    { scope: projectsListRef, dependencies: [projects] }
  );

  return (
    <div ref={projectsListRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={`${selectedUserId}-${project.id}`}
          project={project}
          className="project-card opacity-0 scale-75 translate-y-40"
        />
      ))}
    </div>
  );
}
