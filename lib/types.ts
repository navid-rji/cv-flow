import { SectionTag, EntityTag, RoleTag } from "./tags";

export interface Bullet {
  label?: string;
  text: string;
}

export interface Role {
  title: string;
  duration?: string;
  bullets: Bullet[];
  tags?: RoleTag[];
}

export interface Entity {
  name: string;
  location?: string;
  roles: Role[];
  tags?: EntityTag[];
}

export interface BaseSection {
  type: "EntitiesSection" | "ItemsSection" | "ListSection";
  title: string;
  tags?: SectionTag[];
}

export interface EntitiesSection extends BaseSection {
  type: "EntitiesSection";
  entities: Entity[];
}

export interface ItemsSection extends BaseSection {
  type: "ItemsSection";
  items: Role[];
}

export interface ListSection extends BaseSection {
  type: "ListSection";
  bullets: Bullet[];
}

export type Section = EntitiesSection | ItemsSection | ListSection;

export interface Meta {
  filename: string;
  locale?: string;
}

export interface Contact {
  label: string;
  value: string;
  url?: string;
}

export interface Header {
  name: string;
  contacts: Contact[];
}

export interface CV {
  meta: Meta;
  header: Header;
  sections: Section[];
}
