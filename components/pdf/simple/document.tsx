import { StyleSheet, Document, Page, Text, View } from "@react-pdf/renderer";
import { Section } from "./section";
import { SectionData } from "@/lib/types";

export const SimpleCVDocument = ({ title }: { title: string }) => {
  const sections = [education, workExperience, extra, skills];

  return (
    <Document author="CV Generator by Navid Rajaei" title={`CV - Navid Rajaei`}>
      <Page style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text>123 Innovation Drive, 54321 Techville </Text>
          <View style={styles.bulletPoint} />
          <Text>alex.smith@example.com</Text>
          <View style={styles.bulletPoint} />
          <Text>+1 234 567 8900</Text>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((s, i) => (
            <Section key={i} data={s} bulletPointStyle={styles.bulletPoint} />
          ))}
        </View>
      </Page>
      {/* <Page style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text>Zedernweg 6, 80939 Munich</Text>
          <View style={styles.bulletPoint} />
          <Text>navid.r@rajaei.de</Text>
          <View style={styles.bulletPoint} />
          <Text>+49 176 30728957</Text>
        </View>
      </Page> */}
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
    marginBottom: 4,
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

const education: SectionData = {
  title: "Education",
  tags: ["education"],
  content: [
    { name: "Global Institute of Technology", location: "Techville, USA" },
    {
      title: "Master of Science in Data Science",
      duration: "September 2021 - June 2023",
    },
    {
      title: "Thesis",
      content:
        "Developed a machine learning pipeline for early disease detection using medical imaging data, achieving a 15% performance improvement over baseline models.",
    },
    { title: "GPA", content: "3.9/4.0" },
    {
      title: "Relevant Coursework",
      content:
        "Advanced Machine Learning, Natural Language Processing, Distributed Systems, Data Visualization",
    },
    {
      content:
        "Served as student representative for the Data Science program, coordinating feedback between students and faculty.",
    },
    { name: "Techville University", location: "Techville, USA" },
    {
      title: "Bachelor of Science in Computer Science",
      duration: "September 2017 - Mai 2021",
    },
    {
      content:
        "Graduated with honors (Magna Cum Laude) and received departmental award for outstanding undergraduate research.",
    },
    {
      content:
        "Led a senior capstone project on scalable cloud architectures in a team of four, delivering a working prototype of a microservices platform.",
    },
    {
      content:
        "Completed additional coursework in mathematics, statistics, and human-computer interaction.",
    },
  ],
};

const workExperience: SectionData = {
  title: "Work Experience",
  tags: ["work_experience"],
  content: [
    { name: "Innovatech Solutions", location: "New York, USA" },
    { title: "Data Scientist", duration: "July 2023 - Present" },
    {
      content:
        "Designed and deployed predictive models for customer churn analysis, increasing retention by 12% within the first year.",
    },
    {
      content:
        "Collaborated with cross-functional teams to integrate machine learning models into production pipelines using AWS SageMaker and Kubernetes.",
    },
    {
      content:
        "Developed dashboards and visual analytics tools in Tableau to communicate results to non-technical stakeholders.",
    },
    {
      content:
        "Mentored two junior data scientists, providing guidance on project planning and technical skills development.",
    },
    { name: "CloudSphere Inc.", location: "San Francisco, USA" },
    {
      title: "Software Engineering Intern",
      duration: "June 2020 - September 2020",
    },
    {
      content:
        "Implemented backend services in Go and Node.js for a cloud-based collaboration platform serving over 50,000 users.",
    },
    {
      content:
        "Wrote integration tests and contributed to CI/CD pipelines, improving build reliability by 20%.",
    },
    {
      content:
        "Collaborated with a team of 8 engineers in an agile environment, participating in sprint planning and code reviews.",
    },
    { name: "Techville University", location: "Techville, USA" },
    { title: "Research Assistant", duration: "September 2019 - May 2021" },
    {
      content:
        "Conducted research on efficient algorithms for large-scale graph processing, co-authoring a paper published at a peer-reviewed international conference.",
    },
    {
      content:
        "Developed prototypes in Python and C++ to test hypotheses and benchmark algorithmic performance.",
    },
    {
      content:
        "Supervised undergraduate assistants in data collection and preprocessing tasks.",
    },
    { title: "Teaching Assistant", duration: "January 2020 - December 2020" },
    {
      content:
        "Led weekly lab sessions and tutorials for the 'Introduction to Algorithms' course, supporting over 100 students.",
    },
    {
      content:
        "Created and graded assignments, providing constructive feedback to improve student understanding.",
    },
  ],
};

const extra: SectionData = {
  title: "Extracurricular Activities",
  tags: ["extracurricular"],
  content: [
    {
      name: "AI Club, Techville University",
      location: "Techville, USA",
    },
    {
      title: "President",
      duration: "September 2020 - June 2021",
    },
    {
      content:
        "Organized guest lectures and workshops on topics such as deep reinforcement learning and computer vision.",
    },
    {
      content:
        "Coordinated a team of 12 club members to host the university’s first AI Hackathon, attracting over 150 participants.",
    },
    {
      name: "Techville Volunteer Network",
      location: "Techville, USA",
    },
    {
      title: "Volunteer Coordinator",
      duration: "2018 - 2020",
    },
    {
      content:
        "Coordinated weekly tutoring sessions for underprivileged high school students in STEM subjects",
    },
    {
      content:
        "Managed a volunteer base of 30+ university students and ensured consistent communication and scheduling.",
    },
  ],
};

const skills: SectionData = {
  title: "Skills and Interests",
  tags: ["skills"],
  content: [
    {
      title: "Programming Languages",
      content: "Python, R, Java, C++, Go, JavaScript, SQL",
    },
    {
      title: "Frameworks and Tools",
      content:
        "TensorFlow, PyTorch, scikit-learn, React, Node.js, Docker, Kubernetes, Git, Tableau",
    },
    {
      title: "Languages",
      content: "English (native), Spanish (C1), German (B2)",
    },
    {
      title: "Interests",
      content:
        "Long-distance running, playing the piano, traveling, orchestral music, and mentoring students in STEM fields",
    },
  ],
};
