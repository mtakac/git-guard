import { getGitLabUserGroups } from "@/lib/gitlab-service";
import GroupsList from "@/app/groups/groups-list";

import TabEmpty from "./tab-empty";

export default async function TabGroups({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rootGroupId: string }>;
}) {
  const { id } = await params;
  const { rootGroupId } = await searchParams;
  const groups = await getGitLabUserGroups(id, rootGroupId);

  if (groups.length === 0) {
    return <TabEmpty title="No groups found" description="There are no groups associated with this user." />;
  }

  return <GroupsList groups={groups} selectedUserId={id} />;
}
