import { StyleSheet, Document, Page, Text, View } from "@react-pdf/renderer";
// import { Section } from "./section";
import { SimpleCVSection } from "./sections";
import { CV } from "@/lib/types";

interface SimpleCVDocumentProps {
  data: CV;
}

export const SimpleCVDocument = ({ data }: SimpleCVDocumentProps) => {
  return (
    <Document author="CV Generator by Navid Rajaei" title={`CV - Navid Rajaei`}>
      <Page style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{data.header.name}</Text>
        </View>
        <View
          style={[
            styles.subtitleContainer,
            { marginBottom: data.header.contacts.length !== 0 ? 4 : 0 },
          ]}
          render={() =>
            data.header.contacts.map((c, cI) => (
              <View key={`c-${cI}-${c.label}`} style={styles.contactContainer}>
                <Text>{c.value}</Text>
                {cI < data.header.contacts.length - 1 && (
                  <View style={styles.bulletPoint} />
                )}
              </View>
            ))
          }
        />

        <View
          style={styles.sectionsContainer}
          render={() =>
            data.sections.map((s, i) => (
              <SimpleCVSection
                key={`section-${i}`}
                section={s}
                keyPrefix={`section-${i}`}
              />
            ))
          }
        ></View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: "1.27cm",
    paddingTop: "1.1cm",
    paddingBottom: "0.7cm",
    fontFamily: "Times-Roman",
    fontSize: 11,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  bulletPoint: {
    backgroundColor: "black",
    height: 3,
    width: 3,
  },
  sectionsContainer: {
    gap: 8,
  },
});
