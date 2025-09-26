export type SectionTag =
  | "education"
  | "work_experience"
  | "skills"
  | "awards"
  | "honors"
  | "publications"
  | "extracurricular"
  | "projects"
  | "certifications"
  | "talks"
  | "patents"
  | "volunteering"
  | "leadership"
  | "teaching"
  | "coursework"
  | "languages"
  | "interests"
  | "grants"
  | "thesis"
  | "press"
  | "references"
  | "objective"
  | "summary"
  | "scholarships" // stipend/fellowship lines
  | "competitions" // contests, olympiads
  | "hackathons" // hackathon participation/wins
  | "service" // academic/community service & committees
  | "preprints" // arXiv etc., distinct from pubs
  | "software" // released tools/packages
  | "datasets" // released datasets
  | "courses_taught"; // if you split from teaching;

export type EntityTagBase =
  // Academia & research
  | "university"
  | "college"
  | "school"
  | "department"
  | "institute"
  | "center"
  | "lab"
  | "research_group"
  // Student / community orgs
  | "student_club"
  | "student_association"
  | "student_chapter"
  | "professional_society"
  | "association"
  | "community"
  | "makerspace"
  | "hackerspace"
  | "sports_club"
  | "team"
  | "student_union"
  | "alumni_association"
  // Companies & orgs
  | "company"
  | "startup"
  | "scaleup"
  | "sme"
  | "enterprise"
  | "cooperative"
  | "nonprofit"
  | "ngo"
  | "charity"
  | "foundation"
  // Public sector & health
  | "government"
  | "agency"
  | "public_institution"
  | "municipality"
  | "hospital"
  | "clinic"
  // Events & publishing & enablement
  | "conference"
  | "workshop"
  | "journal"
  | "publisher"
  | "accelerator"
  | "incubator"
  | "venture_fund"
  | "bootcamp"
  | "training_provider"
  | "think_tank"
  | "open_source_project"
  | "symposium"
  | "meetup"
  | "summer_school"
  | "hackathon"
  | "competition";

export type SectorTag =
  | "software"
  | "saas"
  | "cloud"
  | "cybersecurity"
  | "ai"
  | "robotics"
  | "automotive"
  | "mobility"
  | "aerospace"
  | "semiconductors"
  | "finance"
  | "fintech"
  | "insurance"
  | "healthcare"
  | "biotech"
  | "pharma"
  | "medtech"
  | "education"
  | "research"
  | "public_sector"
  | "defense"
  | "energy"
  | "renewables"
  | "utilities"
  | "ecommerce"
  | "retail"
  | "logistics"
  | "manufacturing"
  | "telecom"
  | "media"
  | "gaming"
  | "agriculture"
  | "food_beverage"
  | "travel"
  | "hospitality"
  | "real_estate"
  | "construction"
  | "consulting"
  | "professional_services"
  | "legal"
  | "advertising_marketing"
  | "sports"
  | "arts_culture"
  | "entertainment"
  | "transportation"
  | "shipping"
  | "rail"
  | "maritime"
  | "oil_gas"
  | "mining"
  | "chemicals"
  | "environmental_services";

// === Facets: unbounded, easy to query by prefix ===
export type EntityTagFacet =
  | `sector:${SectorTag}` // sector:education, sector:automotive
  | `domain:${string}` // domain:autonomous_driving, domain:ml_ops
  | `size:${"micro" | "small" | "medium" | "large" | "enterprise"}`
  | `stage:${
      | "pre_seed"
      | "seed"
      | "series_a"
      | "series_b"
      | "series_c"
      | "ipo"
      | "public"}`
  | `ownership:${
      | "private"
      | "public"
      | "state_owned"
      | "family_owned"
      | "cooperative"}`
  | `affiliation:${string}` // affiliation:TUM, affiliation:IEEE
  | `network:${string}` // network:Erasmus, network:DAAD
  | `accredited:${string}` // accredited:ABET
  | `region:${"eu" | "na" | "apac" | "latam" | "mea"}`
  | `country:${string}` // country:DE
  | `city:${string}` // city:Munich
  | `campus:${string}` // campus:Garching
  | `remote:${"remote_first" | "distributed"}`; // org-level culture

export type EntityTag = EntityTagBase | EntityTagFacet;

export type RoleTagBase =
  // employment type
  | "full_time"
  | "part_time"
  | "internship"
  | "working_student"
  | "contract"
  | "freelance"
  | "volunteer"
  | "apprenticeship"
  | "trainee"
  | "co_op"
  | "fellowship" // Academic/common roles for easy querying across languages/titles:
  | "research_assistant"
  | "teaching_assistant"
  | "postdoc"
  | "phd_candidate"
  // Open-source & event roles:
  | "maintainer"
  | "contributor"
  | "organizer"
  | "speaker"
  | "mentor"
  | "coach"
  | "captain"
  // function / scope
  | "software_engineering"
  | "data_science"
  | "ml_engineering"
  | "research"
  | "teaching"
  | "product_management"
  | "design"
  | "leadership"
  | "management"
  | "individual_contributor"
  // modality
  | "remote"
  | "hybrid"
  | "on_site"
  // focus areas
  | "backend"
  | "frontend"
  | "fullstack"
  | "mobile"
  | "cloud"
  | "devops"
  | "security"
  | "embedded"
  | "cv"
  | "nlp"
  | "robotics"
  | "data_engineering";

export type RoleTagFacet =
  | `level:${"entry" | "junior" | "mid" | "senior" | "lead"}`
  | `domain:${string}` // e.g., domain:autonomous_driving
  | `tech:${string}` // e.g., tech:python, tech:react, tech:postgres
  | `framework:${string}` // e.g., framework:spring, framework:pytorch
  | `tool:${string}` // e.g., tool:docker, tool:git
  | `method:${string}` // e.g., method:ab_testing, method:agile
  | `position:${string}` // normalized canonical role, e.g., position:ra, position:ta
  | `program:${string}` // program:Erasmus, program:DAAD, program:Honors
  | `track:${string}`; // track:research, track:management (if you split ladders)

export type RoleTag = RoleTagBase | RoleTagFacet;
