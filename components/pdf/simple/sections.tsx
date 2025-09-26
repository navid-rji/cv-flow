import React from "react";
import { Section, Bullet, Role, Entity } from "@/lib/types";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

interface BulletListProps {
  bullets: Bullet[];
  keyPrefix: string;
}

function BulletList({ bullets, keyPrefix }: BulletListProps) {
  return (
    <View
      style={styles.bulletPointList}
      render={() =>
        bullets.map((bullet, bulletIdx) => (
          <View
            key={`${keyPrefix}-bullet-${bulletIdx}`}
            style={styles.bulletPointContainer}
          >
            <View style={styles.bulletPoint} />
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletText}>
                {bullet.label && (
                  <Text style={styles.bulletTitleText}>
                    {bullet.label}
                    {": "}
                  </Text>
                )}
                {bullet.text}
              </Text>
            </View>
          </View>
        ))
      }
    />
  );
}

interface RoleListProps {
  roles: Role[];
  keyPrefix: string;
}

function RoleList({ roles, keyPrefix }: RoleListProps) {
  return (
    <View
      render={() =>
        roles.map((role, roleIdx) => (
          <View key={`${keyPrefix}-role-${roleIdx}`}>
            <View style={styles.infoContainer}>
              <Text style={styles.roleText}>{role.title}</Text>
              {role.duration && (
                <Text style={styles.timeText}>{role.duration}</Text>
              )}
            </View>
            {role.bullets.length > 0 && (
              <BulletList
                bullets={role.bullets}
                keyPrefix={`${keyPrefix}-role-${roleIdx}`}
              />
            )}
          </View>
        ))
      }
    />
  );
}

interface EntityListProps {
  entities: Entity[];
  keyPrefix: string;
}

function EntityList({ entities, keyPrefix }: EntityListProps) {
  return (
    <View
      render={() =>
        entities.map((ent, entIdx) => (
          <View
            key={`${keyPrefix}-entity-${entIdx}`}
            style={styles.organizationContainer}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.organizationNameText}>{ent.name}</Text>
              {ent.location && <Text>{ent.location}</Text>}
            </View>
            {ent.roles.length > 0 && (
              <RoleList
                roles={ent.roles}
                keyPrefix={`${keyPrefix}-entity-${entIdx}`}
              />
            )}
          </View>
        ))
      }
    />
  );
}

interface SimpleCVSectionProps {
  section: Section;
  keyPrefix: string;
}

export function SimpleCVSection({ section, keyPrefix }: SimpleCVSectionProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
      <View style={styles.horizontalBar} />
      {section.type === "EntitiesSection" && (
        <EntityList entities={section.entities} keyPrefix={keyPrefix} />
      )}
      {section.type === "ItemsSection" && (
        <RoleList roles={section.items} keyPrefix={keyPrefix} />
      )}
      {section.type === "ListSection" && (
        <BulletList bullets={section.bullets} keyPrefix={keyPrefix} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {},
  sectionTitle: {
    fontWeight: "bold",
  },
  horizontalBar: {
    backgroundColor: "black",
    width: "100%",
    height: 1,
  },
  organizationListContainer: { marginTop: 1, gap: 5 },
  organizationContainer: {},
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  organizationNameText: {
    fontWeight: "bold",
  },
  roleText: {
    fontStyle: "italic",
  },
  timeText: {
    fontStyle: "italic",
  },
  bulletPointList: {
    marginTop: 2,
    gap: 1,
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  bulletPoint: {
    backgroundColor: "black",
    height: 3,
    width: 3,
    marginRight: 6,
    marginTop: 4.5,
  },

  bulletTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  bulletText: {
    textAlign: "justify",
  },
  bulletTitleText: {
    fontWeight: "bold",
  },
});
