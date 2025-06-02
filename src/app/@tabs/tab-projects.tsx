import { getGitLabUserProjects } from "@/lib/gitlab-service";
import ProjectsList from "@/app/projects/projects-list";

import TabEmpty from "./tab-empty";

export default async function TabProjects({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rootGroupId: string }>;
}) {
  const { id } = await params;
  const { rootGroupId } = await searchParams;
  const projects = await getGitLabUserProjects(id, rootGroupId);

  if (projects.length === 0) {
    return <TabEmpty title="No projects found" description="There are no projects associated with this user." />;
  }

  return <ProjectsList projects={projects} selectedUserId={id} />;
}
