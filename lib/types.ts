export type HeaderData = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

export type SectionTags =
  | "education"
  | "work_experience"
  | "skills"
  | "awards"
  | "honors"
  | "publications"
  | "extracurricular"
  | "projects";

export type Bulletpoint = {
  title?: string;
  content: string;
};

export type Organization = {
  name: string;
  location?: string;
};

export type Role = {
  title: string;
  duration?: string;
};

export type SectionData = {
  title: string;
  tags: SectionTags[];
  content: (Organization | Role | Bulletpoint)[];
};

export type CVData = {
  header: HeaderData;
  sections: SectionData[];
};
