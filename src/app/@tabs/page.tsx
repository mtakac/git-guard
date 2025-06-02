import { getGitLabUserById } from "@/lib/gitlab-service";

import Tabs from "./tabs";
import UserName from "./user-name";

export default async function TabsPage({
  searchParams,
}: {
  searchParams: Promise<{
    directTab?: string;
    directUserId?: string;
    preserveUrl?: string;
    rootGroupId?: string;
  }>;
}) {
  const params = await searchParams;
  const { directTab, directUserId, rootGroupId } = params;

  if (!directUserId || !rootGroupId || !directTab) {
    return null;
  }

  const user = await getGitLabUserById(directUserId, rootGroupId);

  return (
    <main className="flex flex-col min-h-screen p-6 flex-grow max-w-[1400px]">
      <UserName name={user.username} />
      <Tabs userId={directUserId} rootGroupId={rootGroupId} activeTab={directTab} />
    </main>
  );
}
