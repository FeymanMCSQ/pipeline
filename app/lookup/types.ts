// app/lookup/types.ts

export type EntityType = 'subjects' | 'domains' | 'archetypes';

export type SubjectSummary = {
  id: string;
  slug: string;
  title: string;
  order: number;
  summary: string | null;
};

export type DomainSummary = {
  id: string;
  slug: string;
  title: string;
  order: number;
  summary: string | null;
  subjectId: string;
  subjectSlug: string | null;
  subjectTitle: string | null;
};

export type ArchetypeSummary = {
  id: string;
  slug: string;
  title: string;
  stream: string | null;
  order: number;
  domainSlug: string | null;
  domainTitle: string | null;
};

export type SubjectsResponse = { subjects: SubjectSummary[] };
export type DomainsResponse = { domains: DomainSummary[] };
export type ArchetypesResponse = { archetypes: ArchetypeSummary[] };
