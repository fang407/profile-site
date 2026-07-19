const SKILLS = [
  { category: 'Programming', items: ['Python', 'JavaScript / TypeScript'] },
  { category: 'Test Automation', items: ['PyTest', 'API Testing', 'UI Testing', 'Generative AI Integration', 'Postman', 'Charles Proxy'] },
  { category: 'DevOps & Infrastructure', items: ['CI/CD Quality Gate Governance', 'Dashboards & Data Viz', 'AWS Cloud'] },
  { category: 'Domain Expertise', items: ['Trust & Safety Testing', 'Content Moderation Workflows', 'Data Center Acceptance'] },
  { category: 'Language', items: ['English', 'Chinese', 'Japanese (N2)'] },
];

const EXPERIENCE = [
  {
    company: 'TikTok, Singapore',
    role: 'Software Development Engineer in Test',
    dates: 'Jun 2022 – Nov 2025',
    groups: [
      {
        heading: 'Automation & AI-Augmented Engineering',
        bullets: [
          "Designed and published 3 reusable automation builder libraries (Penalty, Audit, Common), reducing average test case complexity from ~80 to ~20 lines per case; adopted by both QA and R&D for daily self-testing.",
          "Shipped a rollback analysis platform using an internal AI-powered development studio — chained API calls and database operations with a two-layer prompt engineering approach, cutting weekly rollback analysis time from ~1 hour to ~15 minutes.",
          "Self-initiated a test-process improvement programme: root-caused 23 historical test requests and packaged domain automation utilities as 25+ GUI-accessible tools on the internal testing platform.",
          "As QA POC for a lane traffic-routing rollout, implemented automation lane injection via a custom middleware extension to the internal Euler Python framework, enabling automation traffic to reach dedicated lane instances before production onboarding.",
        ],
      },
      {
        heading: 'Quality Infrastructure & Governance',
        bullets: [
          "Introduced the company's centralized CI/CD quality-gate platform to a domain with limited prior deployment controls, growing critical service coverage from 0% to 81% and deployment interception rate from 21% to a peak of 56% over 3 years.",
          "Built a real-time CI/CD health dashboard tracking deployment success rate, rollback distribution, and automation success rate, establishing a data-driven bi-weekly QA/R&D review.",
        ],
      },
      {
        heading: 'Cross-Team Collaboration & Delivery',
        bullets: [
          "Primary QA liaison to US-based testing teams for 3+ years; authored KT frameworks covering 167 test scenarios, reducing cross-regional sync overhead by ~2 person-hours per testing request.",
          "Led acceptance testing for the Chicago data center migration as QA POC, delivering on time with no quality issues; also contributed to Malaysia and Norway data center migrations.",
          "Self-initiated a cross-team retrospective after a major collaboration delay, introducing reciprocal mock test-data tooling to decouple test dependencies across teams.",
        ],
      },
    ],
  },
  {
    company: 'Dyson, Singapore',
    role: 'Software Engineer Intern',
    dates: 'Jun 2021 – Aug 2021',
    groups: [
      {
        heading: null,
        bullets: [
          'Developed data extraction and decoding scripts using Python (Pandas/OpenCV) to evaluate robot performance metrics from raw logs.',
          'Proposed 3 key test metrics for robotics performance and optimized data collection scenarios.',
        ],
      },
    ],
  },
  {
    company: 'Panasonic, Singapore',
    role: 'System Developer Intern',
    dates: 'Dec 2020 – May 2021',
    groups: [
      {
        heading: null,
        bullets: [
          'Built a charging scheme simulator for E-Vehicles using Mixed-Integer Linear Programming to optimize power values and queuing priorities.',
          'Developed a real-time HMI with WebSocket server for monitoring E-Vehicle parameters.',
        ],
      },
    ],
  },
];

function Check() {
  return <span className="text-mint font-mono mr-2 select-none">✓</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-semibold mb-4 mt-12 first:mt-0">
      {children}
    </h2>
  );
}

export default function Resume() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Fang Meiheng</h1>
      <p className="text-sage mt-1">SDET &amp; Quality Engineer</p>
      <p className="text-sm font-mono text-sage mt-2">fang9761@gmail.com</p>

      <SectionTitle>Summary</SectionTitle>
      <p className="text-ink leading-relaxed">
        SDET with 3+ years of experience building reusable automation infrastructure and
        AI-augmented quality tooling at scale. Experience in CI/CD quality gate governance
        and cross-functional, regional collaboration. Seeking SDET or quality engineering
        roles across industries.
      </p>

      <SectionTitle>Skills</SectionTitle>
      <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 items-start">
        {SKILLS.map((group) => (
          <>
            <span key={group.category + '-label'} className="text-sm text-sage pt-1">{group.category}</span>
            <div key={group.category + '-tags'} className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-xs font-mono bg-mint-soft text-ink px-2 py-1 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
          ))}
        </div>

      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-10">
        {EXPERIENCE.map((job) => (
          <div key={job.company}>
            <div className="flex justify-between items-baseline flex-wrap gap-1">
              <h3 className="font-display font-semibold">{job.company}</h3>
              <span className="text-xs font-mono text-sage">{job.dates}</span>
            </div>
            <p className="text-sage text-sm mb-3">{job.role}</p>
            {job.groups.map((group, i) => (
              <div key={i} className="mb-4 last:mb-0">
                {group.heading && (
                  <p className="text-sm font-medium mb-2">{group.heading}</p>
                )}
                <ul className="space-y-2">
                  {group.bullets.map((bullet, j) => (
                    <li key={j} className="flex text-sm leading-relaxed">
                      <Check />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <SectionTitle>Personal Projects</SectionTitle>
      <div>
        <h3 className="font-display font-semibold">
          Serverless AI Code Reviewer
        </h3>
        <a
          href="https://github.com/fang407/ai-code-guardian"
          className="text-xs font-mono text-mint hover:underline"
        >
          github.com/fang407/ai-code-guardian
        </a>
        <ul className="space-y-2 mt-3">
          <li className="flex text-sm leading-relaxed">
            <Check />
            <span>
              Engineered a serverless workflow using AWS Lambda and API Gateway to capture
              GitHub &amp; GitLab webhooks for real-time PR code review, with service
              decoupling via message queue and records stored in DynamoDB for hallucination analysis.
            </span>
          </li>
          <li className="flex text-sm leading-relaxed">
            <Check />
            <span>
              Integrated the Gemini API to perform automated code reviews with a customized
              professional persona, providing instant feedback directly in GitHub &amp; GitLab comments.
            </span>
          </li>
        </ul>
      </div>

      <SectionTitle>Education &amp; Awards</SectionTitle>
      <div>
        <div className="flex justify-between items-baseline flex-wrap gap-1">
          <h3 className="font-display font-semibold">Nanyang Technological University, Singapore</h3>
          <span className="text-xs font-mono text-sage">Aug 2018 – May 2022</span>
        </div>
        <ul className="space-y-2 mt-3">
          <li className="flex text-sm leading-relaxed">
            <Check />
            <span>Honours (Highest Distinction), Electrical and Electronic Engineering, specialized in Info-communications Engineering.</span>
          </li>
          <li className="flex text-sm leading-relaxed">
            <Check />
            <span>NTU Science and Engineering Undergraduate Scholarship | Ministry of Education SM1 Scholarship</span>
          </li>
          <li className="flex text-sm leading-relaxed">
            <Check />
            <span>TikTok Spot Bonus — Achievement Beyond Expectation</span>
          </li>
        </ul>
      </div>

      <SectionTitle>Certifications</SectionTitle>
      <ul className="space-y-2">
        <li className="flex text-sm leading-relaxed">
          <Check />
          <span>AWS Certified Solutions Architect — Associate (AWS SAA)</span>
        </li>
        <li className="flex text-sm leading-relaxed">
          <Check />
          <span>AWS Certified Generative AI Developer – Professional (AWS AIP)</span>
        </li>
      </ul>
    </div>
  );
}
