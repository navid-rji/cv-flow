// src/stores/useCVStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type {
  CV,
  Header,
  Section,
  EntitiesSection,
  ItemsSection,
  ListSection,
  Entity,
  Role,
  Bullet,
  BaseSection,
  Meta,
} from "@/lib/types";

export const CV_STORE_VERSION = 1; // bump since we add meta to state

// ---- Initial values ----
const defaultHeader: Header = {
  name: "",
  contacts: [],
};

const defaultSections: Section[] = [];

const defaultMeta: CV["meta"] = { filename: "CV" };

// ---- helpers (typed, no any) ----
type Updater<T> = Partial<T> | ((prev: T) => T);

function reorder<T>(arr: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= arr.length ||
    to > arr.length - 1
  ) {
    return arr;
  }
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// Type guards
function isEntitiesSection(s: Section | undefined): s is EntitiesSection {
  return !!s && s.type === "EntitiesSection";
}
function isItemsSection(s: Section | undefined): s is ItemsSection {
  return !!s && s.type === "ItemsSection";
}
function isListSection(s: Section | undefined): s is ListSection {
  return !!s && s.type === "ListSection";
}

// Convenient derived types
type Entities = EntitiesSection["entities"]; // Entity[]
type Items = ItemsSection["items"]; // Role[]
type ListBullets = ListSection["bullets"]; // Bullet[]

type CVState = {
  meta: CV["meta"];
  header: Header;
  sections: Section[];

  // CV-level
  replaceCV: (next: Partial<Pick<CV, "header" | "sections" | "meta">>) => void;
  patchMeta: (patch: Partial<CV["meta"]>) => void;

  // Header
  replaceHeader: (next: Header) => void;
  patchHeader: (patch: Partial<Header>) => void;

  // Contacts (optional niceties)
  addContact: (
    index: number | undefined,
    contact: Header["contacts"][number]
  ) => void;
  updateContact: (index: number, next: Header["contacts"][number]) => void;
  removeContact: (index: number) => void;
  moveContact: (from: number, to: number) => void;

  // Sections (top-level)
  setSections: (next: Section[]) => void;
  addSection: (section: Section, index?: number) => void;
  updateSection: (index: number, next: Section) => void;
  removeSection: (index: number) => void;
  moveSection: (from: number, to: number) => void;

  // Patch only BaseSection fields (title/tags) without touching content
  patchSectionBase: (index: number, patch: Partial<BaseSection>) => void;

  // Content-only patchers (keep title/tags as-is)
  patchSectionContent(
    index: number,
    type: "EntitiesSection",
    patch: Updater<{ entities: Entities }>
  ): void;
  patchSectionContent(
    index: number,
    type: "ItemsSection",
    patch: Updater<{ items: Items }>
  ): void;
  patchSectionContent(
    index: number,
    type: "ListSection",
    patch: Updater<{ bullets: ListBullets }>
  ): void;

  // Reordering inside EntitiesSection
  moveEntity: (sectionIndex: number, from: number, to: number) => void;
  moveRoleInEntity: (
    sectionIndex: number,
    entityIndex: number,
    from: number,
    to: number
  ) => void;
  moveBulletInEntityRole: (
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number,
    from: number,
    to: number
  ) => void;

  // Reordering inside ItemsSection (roles array)
  moveItemRole: (sectionIndex: number, from: number, to: number) => void;
  moveBulletInItemRole: (
    sectionIndex: number,
    roleIndex: number,
    from: number,
    to: number
  ) => void;

  // Reordering inside ListSection (bullets array)
  moveListBullet: (sectionIndex: number, from: number, to: number) => void;

  // EntitiesSection CRUD
  addEntity: (sectionIndex: number, entity: Entity, index?: number) => void;
  updateEntity: (
    sectionIndex: number,
    entityIndex: number,
    next: Entity
  ) => void;
  removeEntity: (sectionIndex: number, entityIndex: number) => void;

  addRoleInEntity: (
    sectionIndex: number,
    entityIndex: number,
    role: Role,
    index?: number
  ) => void;
  updateRoleInEntityItem: (
    // name avoids clash with moveRoleInEntity
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number,
    next: Role
  ) => void;
  removeRoleInEntity: (
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number
  ) => void;

  addBulletInEntityRole: (
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number,
    bullet: Bullet,
    index?: number
  ) => void;
  updateBulletInEntityRoleItem: (
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number,
    bulletIndex: number,
    next: Bullet
  ) => void;
  removeBulletInEntityRole: (
    sectionIndex: number,
    entityIndex: number,
    roleIndex: number,
    bulletIndex: number
  ) => void;

  // Cross-moves (optional)
  moveRoleBetweenEntities: (
    sectionIndex: number,
    fromEntity: number,
    fromRole: number,
    toEntity: number,
    toRoleIndex?: number
  ) => void;
  moveBulletBetweenEntityRoles: (
    sectionIndex: number,
    fromEntity: number,
    fromRole: number,
    fromBullet: number,
    toEntity: number,
    toRole: number,
    toBulletIndex?: number
  ) => void;

  // ItemsSection CRUD
  addItemRole: (sectionIndex: number, role: Role, index?: number) => void;
  updateItemRole: (sectionIndex: number, roleIndex: number, next: Role) => void;
  removeItemRole: (sectionIndex: number, roleIndex: number) => void;

  addBulletInItemRole: (
    sectionIndex: number,
    roleIndex: number,
    bullet: Bullet,
    index?: number
  ) => void;
  updateBulletInItemRole: (
    sectionIndex: number,
    roleIndex: number,
    bulletIndex: number,
    next: Bullet
  ) => void;
  removeBulletInItemRole: (
    sectionIndex: number,
    roleIndex: number,
    bulletIndex: number
  ) => void;

  // ListSection CRUD
  addListBullet: (sectionIndex: number, bullet: Bullet, index?: number) => void;
  updateListBullet: (
    sectionIndex: number,
    bulletIndex: number,
    next: Bullet
  ) => void;
  removeListBullet: (sectionIndex: number, bulletIndex: number) => void;

  reset: () => void;
};

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      meta: defaultMeta,
      header: defaultHeader,
      sections: defaultSections,

      // --- CV-level ---
      replaceCV: (next) =>
        set((s) => {
          // keep meta.filename as a definite string
          const meta = next.meta
            ? {
                filename:
                  next.meta.filename !== undefined
                    ? next.meta.filename
                    : s.meta.filename,
                ...(next.meta.locale !== undefined
                  ? { locale: next.meta.locale }
                  : s.meta.locale !== undefined
                  ? { locale: s.meta.locale }
                  : {}),
              }
            : s.meta;

          return {
            meta,
            header: next.header ?? s.header,
            sections: next.sections ?? s.sections,
          };
        }),

      patchMeta: (patch) =>
        set((s) => {
          const meta = {
            filename:
              patch.filename !== undefined ? patch.filename : s.meta.filename,
            ...(patch.locale !== undefined
              ? { locale: patch.locale }
              : s.meta.locale !== undefined
              ? { locale: s.meta.locale }
              : {}),
          } as const; // keeps filename as string

          return { meta };
        }),

      // --- Header ---
      replaceHeader: (next) => set({ header: next }),
      patchHeader: (patch) =>
        set((s) => ({ header: { ...s.header, ...patch } })),

      addContact: (index, contact) =>
        set((s) => {
          const arr = s.header.contacts.slice();
          if (index === undefined || index < 0 || index > arr.length) {
            arr.push(contact);
          } else {
            arr.splice(index, 0, contact);
          }
          return { header: { ...s.header, contacts: arr } };
        }),
      updateContact: (index, next) =>
        set((s) => {
          if (index < 0 || index >= s.header.contacts.length) return {};
          const arr = s.header.contacts.slice();
          arr[index] = next;
          return { header: { ...s.header, contacts: arr } };
        }),
      removeContact: (index) =>
        set((s) => {
          if (index < 0 || index >= s.header.contacts.length) return {};
          const arr = s.header.contacts.slice();
          arr.splice(index, 1);
          return { header: { ...s.header, contacts: arr } };
        }),
      moveContact: (from, to) =>
        set((s) => {
          const arr = reorder(s.header.contacts, from, to);
          if (arr === s.header.contacts) return {};
          return { header: { ...s.header, contacts: arr } };
        }),

      // --- Sections (top-level) ---
      setSections: (next) => set({ sections: next }),

      addSection: (section, index) =>
        set((s) => {
          const arr = s.sections.slice();
          if (index === undefined || index < 0 || index > arr.length) {
            arr.push(section);
          } else {
            arr.splice(index, 0, section);
          }
          return { sections: arr };
        }),

      updateSection: (index, next) =>
        set((s) => {
          if (index < 0 || index >= s.sections.length) return {};
          const arr = s.sections.slice();
          arr[index] = next;
          return { sections: arr };
        }),

      removeSection: (index) =>
        set((s) => {
          if (index < 0 || index >= s.sections.length) return {};
          const arr = s.sections.slice();
          arr.splice(index, 1);
          return { sections: arr };
        }),

      moveSection: (from, to) =>
        set((s) => {
          const arr = s.sections.slice();
          if (
            from < 0 ||
            from >= arr.length ||
            to < 0 ||
            to >= arr.length ||
            from === to
          ) {
            return {};
          }
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { sections: arr };
        }),

      // --- Patch BaseSection fields only ---
      patchSectionBase: (index, patch) =>
        set((s) => {
          const cur = s.sections[index];
          if (!cur) return {};
          const next = { ...cur, ...patch, type: cur.type } as Section;
          const arr = s.sections.slice();
          arr[index] = next;
          return { sections: arr };
        }),

      // --- Patch content only (entities/items/bullets) ---
      patchSectionContent(index, type, patch) {
        set((s) => {
          const cur = s.sections[index];
          if (!cur || cur.type !== type) return {};

          if (type === "EntitiesSection" && isEntitiesSection(cur)) {
            const prev = { entities: cur.entities };
            const next =
              typeof patch === "function"
                ? (
                    patch as (p: { entities: Entities }) => {
                      entities: Entities;
                    }
                  )(prev)
                : { ...prev, ...(patch as Partial<{ entities: Entities }>) };
            const arr = s.sections.slice();
            arr[index] = { ...cur, entities: next.entities };
            return { sections: arr };
          }

          if (type === "ItemsSection" && isItemsSection(cur)) {
            const prev = { items: cur.items };
            const next =
              typeof patch === "function"
                ? (patch as (p: { items: Items }) => { items: Items })(prev)
                : { ...prev, ...(patch as Partial<{ items: Items }>) };
            const arr = s.sections.slice();
            arr[index] = { ...cur, items: next.items };
            return { sections: arr };
          }

          if (type === "ListSection" && isListSection(cur)) {
            const prev = { bullets: cur.bullets };
            const next =
              typeof patch === "function"
                ? (
                    patch as (p: { bullets: ListBullets }) => {
                      bullets: ListBullets;
                    }
                  )(prev)
                : { ...prev, ...(patch as Partial<{ bullets: ListBullets }>) };
            const arr = s.sections.slice();
            arr[index] = { ...cur, bullets: next.bullets };
            return { sections: arr };
          }

          return {};
        });
      },

      // --- EntitiesSection: reorder entities/roles/bullets ---
      moveEntity: (sectionIndex, from, to) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const newEntities = reorder<Entity>(sec.entities, from, to);
          if (newEntities === sec.entities) return {};
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: newEntities };
          return { sections: arr };
        }),

      moveRoleInEntity: (sectionIndex, entityIndex, from, to) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const newRoles = reorder<Role>(ent.roles, from, to);
          if (newRoles === ent.roles) return {};
          const newEntities = sec.entities.slice();
          newEntities[entityIndex] = { ...ent, roles: newRoles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: newEntities };
          return { sections: arr };
        }),

      moveBulletInEntityRole: (
        sectionIndex,
        entityIndex,
        roleIndex,
        from,
        to
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const role = ent.roles[roleIndex];
          if (!role) return {};
          const newBullets = reorder<Bullet>(role.bullets, from, to);
          if (newBullets === role.bullets) return {};
          const newRoles = ent.roles.slice();
          newRoles[roleIndex] = { ...role, bullets: newBullets };
          const newEntities = sec.entities.slice();
          newEntities[entityIndex] = { ...ent, roles: newRoles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: newEntities };
          return { sections: arr };
        }),

      // --- ItemsSection (roles array) ---
      moveItemRole: (sectionIndex, from, to) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const newItems = reorder<Role>(sec.items, from, to);
          if (newItems === sec.items) return {};
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items: newItems };
          return { sections: arr };
        }),

      moveBulletInItemRole: (sectionIndex, roleIndex, from, to) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const role = sec.items[roleIndex];
          if (!role) return {};
          const newBullets = reorder<Bullet>(role.bullets, from, to);
          if (newBullets === role.bullets) return {};
          const newItems = sec.items.slice();
          newItems[roleIndex] = { ...role, bullets: newBullets };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items: newItems };
          return { sections: arr };
        }),

      // --- ListSection (bullets array) ---
      moveListBullet: (sectionIndex, from, to) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isListSection(sec)) return {};
          const newBullets = reorder<Bullet>(sec.bullets, from, to);
          if (newBullets === sec.bullets) return {};
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, bullets: newBullets };
          return { sections: arr };
        }),

      // ---------- EntitiesSection CRUD ----------
      addEntity: (sectionIndex, entity, idx) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ents = sec.entities.slice();
          const i =
            idx === undefined || idx < 0 || idx > ents.length
              ? ents.length
              : idx;
          ents.splice(i, 0, entity);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      updateEntity: (sectionIndex, entityIndex, next) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          if (entityIndex < 0 || entityIndex >= sec.entities.length) return {};
          const ents = sec.entities.slice();
          ents[entityIndex] = next;
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      removeEntity: (sectionIndex, entityIndex) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          if (entityIndex < 0 || entityIndex >= sec.entities.length) return {};
          const ents = sec.entities.slice();
          ents.splice(entityIndex, 1);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      addRoleInEntity: (sectionIndex, entityIndex, role, idx) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const roles = ent.roles.slice();
          const i =
            idx === undefined || idx < 0 || idx > roles.length
              ? roles.length
              : idx;
          roles.splice(i, 0, role);
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      updateRoleInEntityItem: (sectionIndex, entityIndex, roleIndex, next) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent || roleIndex < 0 || roleIndex >= ent.roles.length) return {};
          const roles = ent.roles.slice();
          roles[roleIndex] = next;
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      removeRoleInEntity: (sectionIndex, entityIndex, roleIndex) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent || roleIndex < 0 || roleIndex >= ent.roles.length) return {};
          const roles = ent.roles.slice();
          roles.splice(roleIndex, 1);
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      addBulletInEntityRole: (
        sectionIndex,
        entityIndex,
        roleIndex,
        bullet,
        idx
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const role = ent.roles[roleIndex];
          if (!role) return {};
          const bullets = role.bullets.slice();
          const i =
            idx === undefined || idx < 0 || idx > bullets.length
              ? bullets.length
              : idx;
          bullets.splice(i, 0, bullet);
          const roles = ent.roles.slice();
          roles[roleIndex] = { ...role, bullets };
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      updateBulletInEntityRoleItem: (
        sectionIndex,
        entityIndex,
        roleIndex,
        bulletIndex,
        next
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const role = ent.roles[roleIndex];
          if (!role || bulletIndex < 0 || bulletIndex >= role.bullets.length)
            return {};
          const bullets = role.bullets.slice();
          bullets[bulletIndex] = next;
          const roles = ent.roles.slice();
          roles[roleIndex] = { ...role, bullets };
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      removeBulletInEntityRole: (
        sectionIndex,
        entityIndex,
        roleIndex,
        bulletIndex
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ent = sec.entities[entityIndex];
          if (!ent) return {};
          const role = ent.roles[roleIndex];
          if (!role || bulletIndex < 0 || bulletIndex >= role.bullets.length)
            return {};
          const bullets = role.bullets.slice();
          bullets.splice(bulletIndex, 1);
          const roles = ent.roles.slice();
          roles[roleIndex] = { ...role, bullets };
          const ents = sec.entities.slice();
          ents[entityIndex] = { ...ent, roles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      // Cross-moves (optional)
      moveRoleBetweenEntities: (
        sectionIndex,
        fromEntity,
        fromRole,
        toEntity,
        toRoleIndex
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ents = sec.entities.slice();
          const src = ents[fromEntity];
          const dst = ents[toEntity];
          if (!src || !dst) return {};
          if (fromRole < 0 || fromRole >= src.roles.length) return {};
          const newSrcRoles = src.roles.slice();
          const [removed] = newSrcRoles.splice(fromRole, 1);
          if (!removed) return {};
          const newDstRoles = dst.roles.slice();
          const insertAt =
            toRoleIndex === undefined ||
            toRoleIndex < 0 ||
            toRoleIndex > newDstRoles.length
              ? newDstRoles.length
              : toRoleIndex;
          newDstRoles.splice(insertAt, 0, removed);
          ents[fromEntity] = { ...src, roles: newSrcRoles };
          ents[toEntity] = { ...dst, roles: newDstRoles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      moveBulletBetweenEntityRoles: (
        sectionIndex,
        fromEntity,
        fromRole,
        fromBullet,
        toEntity,
        toRole,
        toBulletIndex
      ) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isEntitiesSection(sec)) return {};
          const ents = sec.entities.slice();
          const srcEnt = ents[fromEntity];
          const dstEnt = ents[toEntity];
          if (!srcEnt || !dstEnt) return {};
          const srcRole = srcEnt.roles[fromRole];
          const dstRole = dstEnt.roles[toRole];
          if (!srcRole || !dstRole) return {};
          if (fromBullet < 0 || fromBullet >= srcRole.bullets.length) return {};
          const newSrcBullets = srcRole.bullets.slice();
          const [removed] = newSrcBullets.splice(fromBullet, 1);
          if (!removed) return {};
          const newDstBullets = dstRole.bullets.slice();
          const insertAt =
            toBulletIndex === undefined ||
            toBulletIndex < 0 ||
            toBulletIndex > newDstBullets.length
              ? newDstBullets.length
              : toBulletIndex;
          newDstBullets.splice(insertAt, 0, removed);

          const newSrcRoles = srcEnt.roles.slice();
          newSrcRoles[fromRole] = { ...srcRole, bullets: newSrcBullets };
          const newDstRoles = dstEnt.roles.slice();
          newDstRoles[toRole] = { ...dstRole, bullets: newDstBullets };

          ents[fromEntity] = { ...srcEnt, roles: newSrcRoles };
          ents[toEntity] = { ...dstEnt, roles: newDstRoles };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, entities: ents };
          return { sections: arr };
        }),

      // ---------- ItemsSection CRUD ----------
      addItemRole: (sectionIndex, role, idx) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const items = sec.items.slice();
          const i =
            idx === undefined || idx < 0 || idx > items.length
              ? items.length
              : idx;
          items.splice(i, 0, role);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      updateItemRole: (sectionIndex, roleIndex, next) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          if (roleIndex < 0 || roleIndex >= sec.items.length) return {};
          const items = sec.items.slice();
          items[roleIndex] = next;
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      removeItemRole: (sectionIndex, roleIndex) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          if (roleIndex < 0 || roleIndex >= sec.items.length) return {};
          const items = sec.items.slice();
          items.splice(roleIndex, 1);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      addBulletInItemRole: (sectionIndex, roleIndex, bullet, idx) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const role = sec.items[roleIndex];
          if (!role) return {};
          const bullets = role.bullets.slice();
          const i =
            idx === undefined || idx < 0 || idx > bullets.length
              ? bullets.length
              : idx;
          bullets.splice(i, 0, bullet);
          const items = sec.items.slice();
          items[roleIndex] = { ...role, bullets };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      updateBulletInItemRole: (sectionIndex, roleIndex, bulletIndex, next) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const role = sec.items[roleIndex];
          if (!role || bulletIndex < 0 || bulletIndex >= role.bullets.length)
            return {};
          const bullets = role.bullets.slice();
          bullets[bulletIndex] = next;
          const items = sec.items.slice();
          items[roleIndex] = { ...role, bullets };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      removeBulletInItemRole: (sectionIndex, roleIndex, bulletIndex) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isItemsSection(sec)) return {};
          const role = sec.items[roleIndex];
          if (!role || bulletIndex < 0 || bulletIndex >= role.bullets.length)
            return {};
          const bullets = role.bullets.slice();
          bullets.splice(bulletIndex, 1);
          const items = sec.items.slice();
          items[roleIndex] = { ...role, bullets };
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, items };
          return { sections: arr };
        }),

      // ---------- ListSection CRUD ----------
      addListBullet: (sectionIndex, bullet, idx) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isListSection(sec)) return {};
          const bullets = sec.bullets.slice();
          const i =
            idx === undefined || idx < 0 || idx > bullets.length
              ? bullets.length
              : idx;
          bullets.splice(i, 0, bullet);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, bullets };
          return { sections: arr };
        }),

      updateListBullet: (sectionIndex, bulletIndex, next) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isListSection(sec)) return {};
          if (bulletIndex < 0 || bulletIndex >= sec.bullets.length) return {};
          const bullets = sec.bullets.slice();
          bullets[bulletIndex] = next;
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, bullets };
          return { sections: arr };
        }),

      removeListBullet: (sectionIndex, bulletIndex) =>
        set((s) => {
          const sec = s.sections[sectionIndex];
          if (!isListSection(sec)) return {};
          if (bulletIndex < 0 || bulletIndex >= sec.bullets.length) return {};
          const bullets = sec.bullets.slice();
          bullets.splice(bulletIndex, 1);
          const arr = s.sections.slice();
          arr[sectionIndex] = { ...sec, bullets };
          return { sections: arr };
        }),

      // --- Reset ---
      reset: () =>
        set({
          meta: defaultMeta,
          header: defaultHeader,
          sections: defaultSections,
        }),
    }),
    {
      name: "cvflow-store",
      storage: createJSONStorage(() => localStorage),
      version: CV_STORE_VERSION,
      // Optionally only persist specific keys (meta/header/sections)
      // partialize: (state) => ({
      //   meta: state.meta,
      //   header: state.header,
      //   sections: state.sections,
      // }),
    }
  )
);

//#region: Selectors
// ─────────────────────────────────────────────────────────
// Optional: Selectors (ergonomic and render-friendly)
// ─────────────────────────────────────────────────────────

export const useCVData = () =>
  useCVStore(
    useShallow((s) => ({
      meta: s.meta as Meta,
      header: s.header as Header,
      sections: s.sections as Section[],
    }))
  );

export const useHeader = () =>
  useCVStore(
    useShallow((s) => ({
      header: s.header as Header,
      replaceHeader: s.replaceHeader,
      patchHeader: s.patchHeader,
      addContact: s.addContact,
      updateContact: s.updateContact,
      removeContact: s.removeContact,
      moveContact: s.moveContact,
    }))
  );
