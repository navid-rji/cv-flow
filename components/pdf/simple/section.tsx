import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import type { SectionData } from "@/lib/types";

// Output types
export type OutBulletPoint = { title?: string; content: string };
export type OutRole = {
  title?: string;
  duration?: string;
  bulletPoints: OutBulletPoint[];
};
export type OutOrganization = {
  name?: string;
  location?: string;
  roles: OutRole[];
};

/**
 * Convert SectionData.content into organizations with roles and bullet points.
 *
 * Rules:
 * - If a Role/Bulletpoint appears before any Organization, an org with no name is created.
 * - If a Bulletpoint appears before any Role within an org, a role with no title is created.
 */
export function toOrganizations(section: SectionData): OutOrganization[] {
  const result: OutOrganization[] = [];

  let currentOrg: OutOrganization | undefined;
  let currentRole: OutRole | undefined;

  for (const item of section.content) {
    if ("name" in item) {
      // Organization
      const org: OutOrganization = {
        name: item.name,
        location: item.location,
        roles: [],
      };
      result.push(org);
      currentOrg = org;
      currentRole = undefined;
      continue;
    }

    if ("title" in item && !("content" in item)) {
      // Role (not a bulletpoint because it lacks `content`)
      if (!currentOrg) {
        currentOrg = { roles: [] };
        result.push(currentOrg);
      }
      const role: OutRole = {
        title: item.title,
        duration: item.duration,
        bulletPoints: [],
      };
      currentOrg.roles.push(role);
      currentRole = role;
      continue;
    }

    if ("content" in item) {
      // Bulletpoint
      if (!currentOrg) {
        currentOrg = { roles: [] };
        result.push(currentOrg);
      }
      if (!currentRole) {
        currentRole = { bulletPoints: [] };
        currentOrg.roles.push(currentRole);
      }
      currentRole.bulletPoints.push({
        title: item.title,
        content: item.content,
      });
    }
  }

  return result;
}

interface SectionProps {
  data: SectionData;
  bulletPointStyle: Style;
}

export function Section({ data, bulletPointStyle }: SectionProps) {
  

  const formatted = toOrganizations(data);

  return (
    <View>
      <Text style={styles.sectionTitle}>{data.title.toUpperCase()}</Text>
      <View style={styles.horizontalBar} />
      {formatted.map((org, orgIndex) => (
        <View
          key={`${data.title}-org-${orgIndex}`}
          style={styles.organizationContainer}
        >
          {(org.name || org.name) && (
            <View style={styles.infoContainer}>
              <Text style={styles.organizationNameText}>{org.name || ""}</Text>
              <Text>{org.location || ""}</Text>
            </View>
          )}
          {org.roles.map((role, roleIndex) => (
            <View key={`${data.title}-org-${orgIndex}-role-${roleIndex}`}>
              {(role.title || role.duration) && (
                <View style={styles.infoContainer}>
                  <Text style={styles.roleText}>{role.title || ""}</Text>
                  <Text style={styles.timeText}>{role.duration || ""}</Text>
                </View>
              )}
              <View style={styles.bulletPointList}>
                {role.bulletPoints.map((bullet, bulletIndex) => (
                  <View
                    key={`${data.title}-org-${orgIndex}-role-${roleIndex}-bullet-${bulletIndex}`}
                    style={styles.bulletPointContainer}
                    // debug
                  >
                    <View
                      style={[bulletPointStyle, styles.bulletPointMargin]}
                    />
                    <View style={styles.bulletTextContainer}>
                      <Text style={styles.bulletText}>
                        {bullet.title && (
                          <Text style={styles.bulletTitleText}>
                            {bullet.title}
                            {": "}
                          </Text>
                        )}
                        {bullet.content}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
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
  bulletPointMargin: {
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
