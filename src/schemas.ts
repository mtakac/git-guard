import * as v from "valibot";

/**
 * Enums and other supporting types
 */
export enum GitLabAccessLevel {
  NO_ACCESS = 0,
  MINIMAL_ACCESS = 5,
  GUEST = 10,
  PLANNER = 15,
  REPORTER = 20,
  DEVELOPER = 30,
  MAINTAINER = 40,
  OWNER = 50,
  ADMIN = 60,
}

/**
 * Schemas for GitLab API responses
 */
export const GitLabGroupSchema = v.pipe(
  v.object({
    id: v.number(),
    name: v.string(),
    full_path: v.string(),
    description: v.nullable(v.string()),
    web_url: v.string(),
    visibility: v.string(),
  }),
  v.transform((data) => {
    return {
      id: data.id,
      name: data.name,
      path: data.full_path,
      description: data.description,
      webUrl: data.web_url,
      visibility: data.visibility,
    };
  })
);

export const GitLabProjectSchema = v.pipe(
  v.object({
    id: v.number(),
    name: v.string(),
    path_with_namespace: v.string(),
    description: v.nullable(v.string()),
    web_url: v.string(),
    visibility: v.string(),
  }),
  v.transform((data) => {
    return {
      id: data.id,
      name: data.name,
      path: data.path_with_namespace,
      description: data.description,
      webUrl: data.web_url,
      visibility: data.visibility,
    };
  })
);

export const GitLabUserSchema = v.pipe(
  v.object({
    id: v.number(),
    name: v.string(),
    username: v.string(),
    state: v.string(),
    avatar_url: v.nullable(v.string()),
    web_url: v.nullable(v.string()),
    access_level: v.enum(GitLabAccessLevel),
  }),
  v.transform((data) => {
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      state: data.state,
      avatarUrl: data.avatar_url,
      webUrl: data.web_url,
      accessLevel: data.access_level,
    };
  })
);

/**
 * Types for GitLab API responses
 */
export type GitLabGroup = v.InferOutput<typeof GitLabGroupSchema>;
export type GitLabProject = v.InferOutput<typeof GitLabProjectSchema>;
export type GitLabUser = v.InferOutput<typeof GitLabUserSchema>;
export type GitLabUserWithResources = GitLabUser & {
  groups: Record<number, GitLabGroup & { membersCount: number; accessLevel: GitLabAccessLevel }>;
  projects: Record<number, GitLabProject & { membersCount: number; accessLevel: GitLabAccessLevel }>;
};
