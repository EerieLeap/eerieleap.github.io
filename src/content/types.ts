import type { CollectionEntry } from 'astro:content';

// The pages' copy, as their schemas type it (src/content/schemas).
export type Home = CollectionEntry<'home'>['data'];
export type Waitlist = CollectionEntry<'waitlist'>['data'];
export type Firmware = CollectionEntry<'firmware'>['data'];
export type Gefera = CollectionEntry<'gefera'>['data'];
export type About = CollectionEntry<'about'>['data'];
export type Licenses = CollectionEntry<'licenses'>['data'];
export type NotFound = CollectionEntry<'notFound'>['data'];
