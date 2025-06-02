import { countGitLabUserProjects } from "@/lib/gitlab-service";
import { countGitLabUserGroups } from "@/lib/gitlab-service";

import TabGroups from "./tab-groups";
import TabProjects from "./tab-projects";
import TabLinks from "./tab-links";

type TabsProps = {
  activeTab: string;
  userId: string;
  rootGroupId: string;
};

export default async function Tabs({ userId, rootGroupId, activeTab }: TabsProps) {
  const params = Promise.resolve({ id: userId });
  const searchParams = Promise.resolve({ rootGroupId: rootGroupId });

  const [groupsCount, projectsCount] = await Promise.all([
    countGitLabUserGroups(userId, rootGroupId),
    countGitLabUserProjects(userId, rootGroupId),
  ]);

  return (
    <>
      <TabLinks
        userId={userId}
        rootGroupId={rootGroupId}
        activeTab={activeTab}
        groupsCount={groupsCount}
        projectsCount={projectsCount}
      />
      {activeTab === "groups" && <TabGroups params={params} searchParams={searchParams} />}
      {activeTab === "projects" && <TabProjects params={params} searchParams={searchParams} />}
    </>
  );
}
