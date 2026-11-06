import pins from '../../firmware.json';

const repositories: Record<string, { license?: string }> = pins.repositories;

/** The license a firmware repository had when firmware.json was last written (`pnpm licenses:update`). */
export function licenseOf(repository: string): string {
  const license = repositories[repository]?.license;
  if (!license) throw new Error(`firmware.json has no license for ${repository}`);
  return license;
}
