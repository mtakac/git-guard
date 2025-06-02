import * as v from "valibot";
import { unstable_cache } from "next/cache";

import {
  GitLabGroupSchema,
  GitLabGroup,
  GitLabProjectSchema,
  GitLabProject,
  GitLabUserSchema,
  GitLabUserWithResources,
} from "@/schemas";

const GITLAB_API_URL = process.env.GITLAB_API_URL;
const GITLAB_ACCESS_TOKEN = process.env.GITLAB_ACCESS_TOKEN;

/**
 * Helper functions
 */
async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  const separator = baseUrl.includes("?") ? "&" : "?";
  const firstPageUrl = `${baseUrl}${separator}page=1&per_page=100`;
  const firstResponse = await fetch(firstPageUrl);
  const firstPageData: T[] = await firstResponse.json();
  const totalPages = parseInt(firstResponse.headers.get("x-total-pages") || "1");

  if (totalPages <= 1) {
    return firstPageData;
  }

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page++) {
    const pageUrl = `${baseUrl}${separator}page=${page}&per_page=100`;
    pagePromises.push(fetch(pageUrl).then((res) => res.json()));
  }

  const remainingPages = await Promise.all(pagePromises);
  return [...firstPageData, ...remainingPages.flat()];
}

async function processMembersForResource<T extends GitLabGroup | GitLabProject>(
  resources: T[],
  users: Record<string, GitLabUserWithResources>,
  resourceType: "groups" | "projects",
  concurrencyLimit: number = 25
): Promise<void> {
  const memberDataPromises = [];

  for (let i = 0; i < resources.length; i += concurrencyLimit) {
    const chunk = resources.slice(i, i + concurrencyLimit);

    const chunkPromises = chunk.map(async (resource) => {
      const membersUrl = `${GITLAB_API_URL}/${resourceType}/${resource.id}/members/all?access_token=${GITLAB_ACCESS_TOKEN}`;
      const membersData = await fetchAllPages(membersUrl);

      return { resource, membersData };
    });

    memberDataPromises.push(Promise.allSettled(chunkPromises));
  }

  const allResults = await Promise.all(memberDataPromises);

  for (const chunkResults of allResults) {
    for (const result of chunkResults) {
      if (result.status === "fulfilled") {
        const { resource, membersData } = result.value;

        for (const memberData of membersData) {
          const member = v.parse(GitLabUserSchema, memberData);

          if (users[member.id]) {
            const existingUser = users[member.id];
            const hasResource = resource.id in existingUser[resourceType];

            if (!hasResource) {
              existingUser[resourceType][resource.id] = {
                ...resource,
                membersCount: membersData.length,
                accessLevel: member.accessLevel,
              };
            }
          } else {
            const newUser: GitLabUserWithResources = {
              ...member,
              groups: {},
              projects: {},
            };

            newUser[resourceType][resource.id] = {
              ...resource,
              membersCount: membersData.length,
              accessLevel: member.accessLevel,
            };

            users[member.id] = newUser;
          }
        }
      }
    }
  }
}

async function processGroupAndProjectMembers(
  groups: GitLabGroup[],
  projects: GitLabProject[],
  users: Record<string, GitLabUserWithResources>
): Promise<void> {
  await Promise.all([
    processMembersForResource(groups, users, "groups", 25),
    processMembersForResource(projects, users, "projects", 25),
  ]);
}

/**
 * Fetch and parse GitLab data
 */
export const getGitLabData = unstable_cache(
  async (rootGroupId: string): Promise<Record<string, GitLabUserWithResources>> => {
    if (!GITLAB_ACCESS_TOKEN) {
      throw new Error("GITLAB_ACCESS_TOKEN environment variable is required");
    }

    if (!GITLAB_API_URL) {
      throw new Error("GITLAB_API_URL environment variable is required");
    }

    const users: Record<string, GitLabUserWithResources> = {};
    const rootGroupUrl = `${GITLAB_API_URL}/groups/${rootGroupId}?access_token=${GITLAB_ACCESS_TOKEN}`;
    const getAllDescendantGroupsUrl = `${GITLAB_API_URL}/groups/${rootGroupId}/descendant_groups?access_token=${GITLAB_ACCESS_TOKEN}`;
    const getAllProjectsUrl = `${GITLAB_API_URL}/groups/${rootGroupId}/projects?access_token=${GITLAB_ACCESS_TOKEN}&include_subgroups=true`;

    const [rootGroupData, descendantGroupsData, projectsData] = await Promise.all([
      fetch(rootGroupUrl).then((res) => res.json()),
      fetchAllPages(getAllDescendantGroupsUrl),
      fetchAllPages(getAllProjectsUrl),
    ]);

    const groups = [
      v.parse(GitLabGroupSchema, rootGroupData),
      ...descendantGroupsData.map((group) => v.parse(GitLabGroupSchema, group)),
    ];
    const projects = projectsData.map((project) => v.parse(GitLabProjectSchema, project));

    await processGroupAndProjectMembers(groups, projects, users);

    return users;
  },
  ["gitlab-data"],
  {
    revalidate: 10 * 60,
    tags: ["gitlab-data-cache"],
  }
);

/**
 * Get GitLab users
 */
export async function getGitLabUsers(rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);

  return Object.values(users);
}

/**
 * Get GitLab user groups
 */
export async function getGitLabUserGroups(userId: string, rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);
  const user = users[userId];

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return Object.values(user.groups);
}

/**
 * Get GitLab user projects
 */
export async function getGitLabUserProjects(userId: string, rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);
  const user = users[userId];

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return Object.values(user.projects);
}

/**
 * Get GitLab user by ID
 */
export async function getGitLabUserById(userId: string, rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);
  const user = users[userId];

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return user;
}

/**
 * Count GitLab user groups
 */
export async function countGitLabUserGroups(userId: string, rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);
  const user = users[userId];

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return Object.keys(user.groups).length;
}

/**
 * Count GitLab user projects
 */
export async function countGitLabUserProjects(userId: string, rootGroupId: string) {
  const users = await getGitLabData(rootGroupId);
  const user = users[userId];

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return Object.keys(user.projects).length;
}
