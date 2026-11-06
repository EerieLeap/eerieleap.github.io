import pins from '../../firmware-docs.json';

const repositories: Record<string, { commit?: string; license?: string }> = pins.repositories;

/** The license a firmware repository had when its pin was last moved (`pnpm pins:update`). */
export function licenseOf(repository: string): string {
  const license = repositories[repository]?.license;
  if (!license) throw new Error(`firmware-docs.json has no license for ${repository}`);
  return license;
}
