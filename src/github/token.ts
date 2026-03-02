#!/usr/bin/env bun

export function parseAdditionalPermissions():
  | Record<string, string>
  | undefined {
  const raw = process.env.ADDITIONAL_PERMISSIONS;
  if (!raw || !raw.trim()) {
    return undefined;
  }

  const DEFAULT_PERMISSIONS: Record<string, string> = {
    contents: "write",
    pull_requests: "write",
    issues: "write",
  };

  const additional: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;
    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (key && value) {
      additional[key] = value;
    }
  }

  if (Object.keys(additional).length === 0) {
    return undefined;
  }

  return { ...DEFAULT_PERMISSIONS, ...additional };
}

export function setupGitHubToken(): string {
  // Check if GitHub token was provided as override
  const providedToken = process.env.OVERRIDE_GITHUB_TOKEN;
  if (providedToken) {
    console.log("Using provided GITHUB_TOKEN for authentication");
    return providedToken;
  }

  // Fall back to the default workflow token (github.token)
  const defaultToken = process.env.DEFAULT_WORKFLOW_TOKEN;
  if (defaultToken) {
    console.log("Using default workflow token for authentication");
    return defaultToken;
  }

  throw new Error(
    "No GitHub token available. Provide a github_token input or ensure the default workflow token is available.",
  );
}
