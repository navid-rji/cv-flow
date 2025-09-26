import { CV } from "@/lib/types";

export const sample_cv: CV = {
  meta: {
    filename: "sample_CV",
  },
  header: {
    name: "Alex Smith",
    contacts: [
      {
        label: "address",
        value: "123 Innovation Drive, 54321 Techville ",
      },
      {
        label: "email",
        value: "alex.smith@example.com",
      },
      { label: "phone", value: "+1 234 567 8900" },
    ],
  },
  sections: [
    {
      type: "EntitiesSection",
      title: "Education",
      entities: [
        {
          name: "Global Institute of Technology",
          location: "Techville, USA",
          roles: [
            {
              title: "Master of Science in Data Science",
              duration: "September 2021 - June 2023",
              bullets: [
                {
                  label: "Thesis",
                  text: "Developed a machine learning pipeline for early disease detection using medical imaging data, achieving a 15% performance improvement over baseline models.",
                },
                { label: "GPA", text: "3.9/4.0" },
                {
                  label: "Relevant Coursework",
                  text: "Advanced Machine Learning, Natural Language Processing, Distributed Systems, Data Visualization",
                },
                {
                  text: "Served as student representative for the Data Science program, coordinating feedback between students and faculty.",
                },
              ],
            },
          ],
        },
            {
              name: "Techville University",
              location: "Techville, USA",
              roles: [
                {
                  title: "Bachelor of Science in Computer Science",
                  duration: "September 2017 - Mai 2021",
                  bullets: [
                    {
                      text: "Graduated with honors (Magna Cum Laude) and received departmental award for outstanding undergraduate research.",
                    },
                    {
                      text: "Led a senior capstone project on scalable cloud architectures in a team of four, delivering a working prototype of a microservices platform.",
                    },
                    {
                      text: "Completed additional coursework in mathematics, statistics, and human-computer interaction.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "EntitiesSection",
          title: "Work Experience",
          entities: [
            {
              name: "Innovatech Solutions",
              location: "New York, USA",
              roles: [
                {
                  title: "Data Scientist",
                  duration: "July 2023 - Present",
                  bullets: [
                    {
                      text: "Designed and deployed predictive models for customer churn analysis, increasing retention by 12% within the first year.",
                    },
                    {
                      text: "Collaborated with cross-functional teams to integrate machine learning models into production pipelines using AWS SageMaker and Kubernetes.",
                    },
                    {
                      text: "Developed dashboards and visual analytics tools in Tableau to communicate results to non-technical stakeholders.",
                    },
                    {
                      text: "Mentored two junior data scientists, providing guidance on project planning and technical skills development.",
                    },
                  ],
                },
              ],
            },
            {
              name: "CloudSphere Inc.",
              location: "San Francisco, USA",
              roles: [
                {
                  title: "Software Engineering Intern",
                  duration: "June 2020 - September 2020",
                  bullets: [
                    {
                      text: "Implemented backend services in Go and Node.js for a cloud-based collaboration platform serving over 50,000 users.",
                    },
                    {
                      text: "Wrote integration tests and contributed to CI/CD pipelines, improving build reliability by 20%.",
                    },
                    {
                      text: "Collaborated with a team of 8 engineers in an agile environment, participating in sprint planning and code reviews.",
                    },
                  ],
                },
              ],
            },
            {
              name: "Techville University",
              location: "Techville, USA",
              roles: [
                {
                  title: "Research Assistant",
                  duration: "September 2019 - May 2021",
                  bullets: [
                    {
                      text: "Conducted research on efficient algorithms for large-scale graph processing, co-authoring a paper published at a peer-reviewed international conference.",
                    },
                    {
                      text: "Developed prototypes in Python and C++ to test hypotheses and benchmark algorithmic performance.",
                    },
                    {
                      text: "Supervised undergraduate assistants in data collection and preprocessing tasks.",
                    },
                  ],
                },
                {
                  title: "Teaching Assistant",
                  duration: "January 2020 - December 2020",
                  bullets: [
                    {
                      text: "Led weekly lab sessions and tutorials for the 'Introduction to Algorithms' course, supporting over 100 students.",
                    },
                    {
                      text: "Created and graded assignments, providing constructive feedback to improve student understanding.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "EntitiesSection",
          title: "Extracurricular Activites",
          entities: [
            {
              name: "AI Club, Techville University",
              location: "Techville, USA",
              roles: [
                {
                  title: "President",
                  duration: "September 2020 - June 2021",
                  bullets: [
                    {
                      text: "Organized guest lectures and workshops on topics such as deep reinforcement learning and computer vision.",
                    },
                    {
                      text: "Coordinated a team of 12 club members to host the university’s first AI Hackathon, attracting over 150 participants.",
                    },
                  ],
                },
              ],
            },
            {
              name: "Techville Volunteer Network",
              location: "Techville, USA",
              roles: [
                {
                  title: "Volunteer Coordinator",
                  duration: "2018 - 2020",
                  bullets: [
                    {
                      text: "Coordinated weekly tutoring sessions for underprivileged high school students in STEM subjects",
                    },
                    {
                      text: "Managed a volunteer base of 30+ university students and ensured consistent communication and scheduling.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "ListSection",
          title: "Skills and Interests",
          bullets: [
            {
              label: "Programming Languages",
              text: "Python, R, Java, C++, Go, JavaScript, SQL",
            },
            {
              label: "Frameworks and Tools",
              text: "TensorFlow, PyTorch, scikit-learn, React, Node.js, Docker, Kubernetes, Git, Tableau",
            },
            {
              label: "Languages",
              text: "English (native), Spanish (C1), German (B2)",
            },
            {
              label: "Interests",
              text: "Long-distance running, playing the piano, traveling, orchestral music, and mentoring students in STEM fields",
            },
      ],
    },
  ],
};
