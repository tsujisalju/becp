Acknowledgement

The author would like to extend his appreciation to Asia Pacific
University (APU) for giving him the opportunity and a second chance to
pursue software engineering and provided the knowledge and experience in
the process of software development across various domains such as web
development, database management, development methodologies and
blockchain development, all of which will be utilized in the development
of this final year project. Moreover, the author would take this
opportunity to thank the APU Blockchain and Cryptocurrency Club (APUBCC)
for opening the doors to an abundance of opportunities provided to
participate in blockchain hackathons to learn more about blockchain
ecosystem and provided a platform to build a rudimentary prototype of
the blockchain-based extracurricular credentials system, which has
become the basis of this final year project. Moreover, the author would
give honorable mention to his initial teammates from the DevMatch 2024
hackathon and now great friends Heng Jun Yong, Rong Sheng, Ling Yu Qian
and Teshwindev Singh Bhatt for their contribution in developing the
foundational prototype in the short time they have spent together during
the hackathon. Next, the author would like to give his appreciation to
his supervisor Dr. Mohd Nizam Bin A. Badaruddin for his constructive
feedback and insights on approaching the development of the
investigation report to ensure it remains grounded and realistic, while
still giving the author plenty of autonomy to work on his preferred
solutions. Finally, the author would give his sincerest gratitude to his
parents for always supporting his endeavors and his siblings for always
giving him a smile on his face during tough times in university. This
project would not come to fruition without the contributions of the
wonderful people surrounding the author, no matter how big or small
their contributions are, as they all culminate in the author's own
personal development and growth as an aspiring software engineer.

Abstract

University graduates need not only great academic performance but also
the right technical and soft skills necessary to pursue their career of
choice. Beyond the standard curriculum, these skills can be obtained by
partaking in extracurricular activities (ECAs). However, the skills
obtained from ECAs are fragmented and difficult to verify, leaving
university students unclear of their overall skills and how they can
better improve their chances of success. Moreover, this difficulty
affects the hiring process as well, as candidates must undergo further
probation to prove the skills they already have, resulting in
inefficient use of time and resources. The current approach of resumes
and applicant tracking systems (ATS) for improving application screening
has the unintended effect of keyword exploitation and credential fraud,
rather than authentic skill development among candidates. This research
aims to develop a prototype for issuing verifiable blockchain-based
certificates for university extracurricular activities and a method to
quantify students' skills based on certificate metadata to better
communicate students' employability and improve efficiency of the hiring
flow. This research conducted extensive literature review on the current
landscape of extracurricular activities, how the value of
extracurricular activities is perceived among university students, the
use of blockchain technology in the education sector and the best
approach for measuring skill development using blockchain-based
micro-credentials. An online survey of 30 respondents has been conducted
to ascertain the claims in literature and collect feedback and concerns
from university students for consideration during the development of the
proposed system.

Keywords: Blockchain Technology, Smart Contracts, NFT, Recruitment and
Selection, Training and Development, Extracurricular Activities

**SDG Goal 9: Quality Education**

# **Table of Contents** {#table-of-contents .TOC-Heading}

[Chapter 1: Introduction
[10](#chapter-1-introduction)](#chapter-1-introduction)

[1.1 Introduction [10](#introduction)](#introduction)

[1.2 Problem Background [12](#problem-background)](#problem-background)

[1.2.1 Students lack a clear and standardized way of showcasing
extracurricular skills alongside academic achievements
[12](#students-lack-a-clear-and-standardized-way-of-showcasing-extracurricular-skills-alongside-academic-achievements)](#students-lack-a-clear-and-standardized-way-of-showcasing-extracurricular-skills-alongside-academic-achievements)

[1.2.2 Employers face inefficiencies and fraud in recruitment due to
unreliable resumes and ATS systems
[12](#employers-face-inefficiencies-and-fraud-in-recruitment-due-to-unreliable-resumes-and-ats-systems)](#employers-face-inefficiencies-and-fraud-in-recruitment-due-to-unreliable-resumes-and-ats-systems)

[1.2.3 There is no unified platform that connects students,
universities, event organizers and employers under a trusted
certification system
[14](#there-is-no-unified-platform-that-connects-students-universities-event-organizers-and-employers-under-a-trusted-certification-system)](#there-is-no-unified-platform-that-connects-students-universities-event-organizers-and-employers-under-a-trusted-certification-system)

[1.3 Project Aim [15](#project-aim)](#project-aim)

[1.4 Objectives [15](#objectives)](#objectives)

[1.5 Scope [16](#scope)](#scope)

[1.5.1 In-Scope Activities
[16](#in-scope-activities)](#in-scope-activities)

[1.5.2 Out-of-Scope Activities
[16](#out-of-scope-activities)](#out-of-scope-activities)

[1.6 Potential Benefits [18](#potential-benefits)](#potential-benefits)

[1.6.1 Tangible Benefits [18](#tangible-benefits)](#tangible-benefits)

[1.6.2 Intangible Benefits
[18](#intangible-benefits)](#intangible-benefits)

[1.6.3 Target Users [19](#target-users)](#target-users)

[1.6.4 Functionalities / Deliverables
[19](#functionalities-deliverables)](#functionalities-deliverables)

[1.7 Overview of IR [20](#overview-of-ir)](#overview-of-ir)

[1.8 Project Plan [22](#project-plan)](#project-plan)

[Chapter 2: Literature Review
[23](#chapter-2-literature-review)](#chapter-2-literature-review)

[2.1 Introduction [23](#introduction-1)](#introduction-1)

[2.2 Research Areas [23](#research-areas)](#research-areas)

[2.2.1 Recognition and Value of Extracurricular Activities
[23](#recognition-and-value-of-extracurricular-activities)](#recognition-and-value-of-extracurricular-activities)

[2.2.2 Measuring Skill Development using Micro-Credentials
[25](#measuring-skill-development-using-micro-credentials)](#measuring-skill-development-using-micro-credentials)

[2.2.3 Blockchain Platforms & Smart Contracts
[26](#blockchain-platforms-smart-contracts)](#blockchain-platforms-smart-contracts)

[2.2.4 Recruitment Processes & Applicant Tracking Systems
[28](#recruitment-processes-applicant-tracking-systems)](#recruitment-processes-applicant-tracking-systems)

[2.2.5 Integration of AI & Blockchain in Education
[29](#integration-of-ai-blockchain-in-education)](#integration-of-ai-blockchain-in-education)

[2.2.6 Adoption & Stakeholder Incentives
[30](#adoption-stakeholder-incentives)](#adoption-stakeholder-incentives)

[2.3 Similar Systems / Works
[31](#similar-systems-works)](#similar-systems-works)

[2.3.1 Proof of Attendance Protocol (POAP)
[31](#proof-of-attendance-protocol-poap)](#proof-of-attendance-protocol-poap)

[2.3.2 UniLah: The Student App
[33](#unilah-the-student-app)](#unilah-the-student-app)

[2.3.3 Comparison [37](#comparison)](#comparison)

[2.3.4 Conclusion [38](#conclusion)](#conclusion)

[2.4 Technical Research [38](#technical-research)](#technical-research)

[2.4.1 System Requirements Analysis
[38](#system-requirements-analysis)](#system-requirements-analysis)

[2.4.2 Programming Language Chosen
[41](#programming-language-chosen)](#programming-language-chosen)

[2.4.3 Integrated Development Environment (IDE) Chosen: Zed
[44](#integrated-development-environment-ide-chosen-zed)](#integrated-development-environment-ide-chosen-zed)

[2.4.4 Database Management System Chosen: Pinata (Interplanetary File
System - IPFS)
[46](#database-management-system-chosen-pinata-interplanetary-file-system---ipfs)](#database-management-system-chosen-pinata-interplanetary-file-system---ipfs)

[2.4.5 Blockchain Platform Chosen: Optimism
[47](#blockchain-platform-chosen-optimism)](#blockchain-platform-chosen-optimism)

[2.4.6 Web Server Chosen: Node.js
[49](#web-server-chosen-node.js)](#web-server-chosen-node.js)

[2.4.7 Additional Tools and Libraries Used
[50](#additional-tools-and-libraries-used)](#additional-tools-and-libraries-used)

[Chapter 3: Development and Data Gathering Methodology
[54](#chapter-3-development-and-data-gathering-methodology)](#chapter-3-development-and-data-gathering-methodology)

[3.1 System Development Methodology
[54](#system-development-methodology)](#system-development-methodology)

[3.1.1 Introduction [54](#introduction-2)](#introduction-2)

[3.1.2 Methodology Choice and Justification
[54](#methodology-choice-and-justification)](#methodology-choice-and-justification)

[3.1.3 Activities and Processes
[57](#activities-and-processes)](#activities-and-processes)

[3.2 Data Gathering Design
[61](#data-gathering-design)](#data-gathering-design)

[3.2.1 Data Collection Method
[61](#data-collection-method)](#data-collection-method)

[3.2.2 Comparison [61](#comparison-1)](#comparison-1)

[3.2.3 Survey Structure [62](#survey-structure)](#survey-structure)

[3.2.4 Question Bank [63](#question-bank)](#question-bank)

[3.3 Data Analysis [67](#data-analysis)](#data-analysis)

[3.3.1 Demographic Information
[67](#demographic-information)](#demographic-information)

[3.3.2 Extracurricular Participation and Skill Recognition
[78](#extracurricular-participation-and-skill-recognition)](#extracurricular-participation-and-skill-recognition)

[3.3.3 Opinions on skill credentials, blockchain adoption and feature
priorities
[85](#opinions-on-skill-credentials-blockchain-adoption-and-feature-priorities)](#opinions-on-skill-credentials-blockchain-adoption-and-feature-priorities)

[3.3.4 Survey Summary [91](#survey-summary)](#survey-summary)

[Chapter 4: Conclusion
[93](#chapter-4-conclusion)](#chapter-4-conclusion)

[References [95](#references)](#references)

[Appendix A: PPF -Title Registration Proposal
[98](#appendix-a-ppf--title-registration-proposal)](#appendix-a-ppf--title-registration-proposal)

[Appendix B: Ethics Form (Fast-Track)
[111](#appendix-b-ethics-form-fast-track)](#appendix-b-ethics-form-fast-track)

[Appendix C: Meeting Log Sheets
[115](#appendix-c-meeting-log-sheets)](#appendix-c-meeting-log-sheets)

[Appendix D: Gantt Chart
[118](#appendix-d-gantt-chart)](#appendix-d-gantt-chart)

[Appendix E: Respondence Demographic Profile
[119](#appendix-e-respondence-demographic-profile)](#appendix-e-respondence-demographic-profile)

**List of Figures**

[Figure 1: Mean scores of barriers to participation in extracurricular
activities. Note: Q1: Lack of motivation, Q2: Lack of confidence, Q3:
Unaware of available activities, Q4: Unappreciative towards value of
activities Q5: Busy social life, Q6: Commitment/time for academic study,
Q7: Work commitments, Q8: Family/caring commitments Q9: Discouragement
from family/friends, Q10: Discouragement from professional connections
(co-workers/manager), Q11: Financial reasons, Q12: Physical/Mental
health concerns. Error bars represent the standard deviation from the
mean score. Adapted from (Jackson et al., 2024).
[24](#_Toc216886225)](#_Toc216886225)

[Figure 2: Blockchain platforms used in initiatives. Adapted from
(Silaghi & Popescu, 2025). [27](#_Toc216886226)](#_Toc216886226)

[Figure 3: Technologies used for handling recruitment processes among 50
companies. Adapted from (Sharani et al., 2023).
[28](#_Toc216886227)](#_Toc216886227)

[Figure 4: POAP gallery page screenshot displaying a gallery of featured
POAPs issued for various events, conferences and certifications. Adapted
from (POAP Inc., n.d.) [31](#_Toc216886228)](#_Toc216886228)

[Figure 5: UniLah menu dashboard. Adapted from (Apple App Store, n.d.)
[34](#_Toc216886229)](#_Toc216886229)

[Figure 6: UniEvents feature. Adapted from (Apple App Store, n.d.)
[35](#_Toc216886230)](#_Toc216886230)

[Figure 7: Screenshot of Zed landing page (Zed Industries, n.d.)
[44](#_Toc216886231)](#_Toc216886231)

[Figure 8: Screenshot of Pinata landing page (Pinata, n.d.)
[46](#_Toc216886232)](#_Toc216886232)

[Figure 9: Screenshot of Optimism OP Stack landing page (Optimism
Foundation, n.d.) [47](#_Toc216886233)](#_Toc216886233)

[Figure 10: Screenshot of the Vercel homepage (Vercel Inc., n.d.)
[53](#_Toc216886234)](#_Toc216886234)

[Figure 11: Extreme Programming Project Flow. Adapted from (Wells,
2000). [57](#_Toc216886235)](#_Toc216886235)

[Figure 12: Doughnut chart presenting the gender composition among 30
survey respondents [68](#_Ref216732051)](#_Ref216732051)

[Figure 13: Vertical bar chart presenting the composition of age group
among survey respondents [69](#_Ref216732036)](#_Ref216732036)

[Figure 14: Horizontal bar chart presenting the composition of
universities enrolled among survey respondents
[70](#_Ref216732088)](#_Ref216732088)

[Figure 15: Pie chart showing the composition of occupation among survey
respondents [71](#_Ref216732121)](#_Ref216732121)

[Figure 16: Doughnut chart showing the current year of study
distribution of survey respondents [72](#_Ref216732232)](#_Ref216732232)

[Figure 17: Horizontal stacked bar chart showing the current program of
study of survey respondents, separated by year of study
[72](#_Ref216732246)](#_Ref216732246)

[Figure 18: Vertical stacked bar chart showing the frequency of ECA
participation distribution of survey respondents, separated by
university [74](#_Ref216732266)](#_Ref216732266)

[Figure 19: Vertical stacked bar chart showing the frequency of ECA
participation distribution of survey respondents, separated by program
of study [74](#_Ref216732278)](#_Ref216732278)

[Figure 20: Vertical stacked bar chart showing the frequency of ECA
participation distribution of survey respondents, separated by year of
study [75](#_Ref216732367)](#_Ref216732367)

[Figure 21: Horizontal bar chart showing the distribution of familiarity
with blockchain technology among survey respondents
[77](#_Ref216783140)](#_Ref216783140)

[Figure 22: Horizontal stacked bar chart showing the Likert scale of
statements relating to barriers to participating in ECAs
[79](#_Ref216789502)](#_Ref216789502)

[Figure 23: Horizontal stacked bar chart showing the Likert scale of
statements relating to perceived outcomes of ECA participation
[80](#_Ref216791237)](#_Ref216791237)

[Figure 24: Horizontal stacked bar chart showing the Likert scale of how
well skills are recognized [81](#_Ref216792156)](#_Ref216792156)

[Figure 25: Horizontal bar chart presenting the methods of showcasing
extracurricular skills in percentage of survey respondents
[82](#_Ref216793042)](#_Ref216793042)

[Figure 26: Horizontal bar chart presenting the challenges when
showcasing extracurricular skills faced by percentages of survey
respondents [83](#_Ref216794332)](#_Ref216794332)

[Figure 27: Horizontal stacked bar chart showing the Likert scale of
statements relating to preferences on skill credentials
[85](#_Ref216810120)](#_Ref216810120)

[Figure 28: Horizontal stacked bar chart showing the Likert scale of the
statement relating to readiness in adopting blockchain technology
[86](#_Ref216810847)](#_Ref216810847)

[Figure 29: Horizontal bar chart showing the percentage of respondents
selecting trust factors for a blockchain-based certificate
[87](#_Ref216811715)](#_Ref216811715)

[Figure 30: Radial chart showing the ranking of features for the BECP
system [88](#_Ref216813775)](#_Ref216813775)

**List of Tables**

[Table 1: BECP Investigation Report Project Plan
[22](#_Toc216886255)](#_Toc216886255)

[Table 2: Feature comparison between systems similar to the proposed
BECP system [37](#_Toc216886256)](#_Toc216886256)

[Table 3: Aspect comparison between XP, Agile and Lean development
methodology [56](#_Toc216886257)](#_Toc216886257)

[Table 4: Advantages and Disadvantages between Surveys and Interviews
[61](#_Toc216886258)](#_Toc216886258)

[Table 5: Sections, number of questions and purpose for survey structure
[62](#_Toc216886259)](#_Toc216886259)

[Table 6: Questions and Objectives for the Survey Question
[63](#_Toc216886260)](#_Toc216886260)

[Table 7: Themes and actual responses to feedback on feature ideas for
the proposed BECP system [89](#_Ref216813131)](#_Ref216813131)

[Table 8: Themes and actual response to feedback on disliked features to
avoid for the proposed BECP system [90](#_Toc216886262)](#_Toc216886262)

# Chapter 1: Introduction

## 1.1 Introduction

Participation in extracurricular activities (ECAs) is highly encouraged
among university students as an addition to their standard learning in
their curriculum. When it comes to employability, Jackson et al. (2024)
argued that it is not determined by prerequisite theoretical knowledge
and practical skills alone, but a multi-dimensional measure that is
influenced by social connectedness and professional identity, all of
which can be developed by engaging in ECAs. Activities such as
work-integrated learning, global exchange programs and holding positions
of responsibility in community groups can expose students to
professional working environments, strengthen cultural adaptability and
open new networking opportunities (Jackson et al., 2024). It is proven
that participation in extracurricular activities is linked to supporting
educational success, developing essential attributes among graduates and
strategic long-term career advantages (Nguyen et al., 2025).

However, despite these benefits, participation in ECAs appears to be
lackluster. Primarily, there is a lack of understanding among students
about the value of extracurricular activities. Students' desire to
participate in extracurricular activities is reliant on passion towards
the activity and clear understanding of outcomes towards future
employability (Jackson et al., 2024), in which the latter is often not
visualized clearly. Moreover, extracurricular activities are perceived
as separate from formal education among university management and
students, highlighting a misalignment between extracurricular activity
outcomes and the university's overall student development objectives
(Nguyen et al., 2025). Stemming from this disconnect, studies also
identified social barriers that can limit extracurricular participation
such as work obligations, financial strain and limited accessibility for
the physically impaired (The Edge Malaysia, 2025; Jackson et al. 2024).

Current systems for learning assessments in universities only cater for
academic credentials with no standard recognition for extracurricular
credentials, thus contributing to the perceived separation between
extracurriculars and academics. As a result, awards and certificates
gained from extracurricular participation are often fragmented in many
locations and lack detail about the actual skills that the student has
gained. This lack of integration with the standard curriculum leaves
students in the dark about their personal skill development.

The difficulty of verifying students' extracurricular skills
consequently impacts the selection and recruitment process in company
organizations. In existing systems, employers rely on resumes and ATS
systems that prioritize keywords rather than verified skills. Credential
fraud and misrepresentation of skills remain a global issue in
education, with Rustemi et al. (2023) reporting over 7 billion USD in
projected revenue generated from degree mill syndicates creating
fraudulent certifications. This undermines trust in the recruitment
process. Companies prioritize filling job positions as quickly as
possible while minimizing costs (Sharani et al., 2023), but current
systems force them to spend additional resources on time-consuming
probation phases to verify candidate claims.

Ultimately, the background of this study arrives at two converging
needs. On one end, students require a platform where their
extracurricular skill development can be recognized in a transparent and
verifiable manner to help better showcase their skills and competencies
in addition to their academic records. On the other hand, employers need
a trustworthy and verifiable credentials system to streamline their
recruitment process. In response to these issues, blockchain technology
offers immutability, transparency and decentralized verification viable
for use in registering extracurricular skill credentials. The issuance
of credentials can be automated using smart contracts that ensure
authenticity by validating participation of events and completed
outcomes, while preventing forgery by linking credentials with student
identification and verified event organizer credibility. Non-fungible
tokens (NFTs) allow credentials to carry unique metadata that holds more
information about the specific skills gained from the activity, and
ensuring the student maintains ownership of the credentials as it
resides in the student's personal wallet address. Moreover, artificial
intelligence can leverage blockchain's immutable and tamper-proof nature
to make decisions with a high level of integrity not achievable with
centralized solutions, enabling credential skills to be inferred from
event descriptions and develop personalized student development plans
tailormade to the student's career goals.

## 1.2 Problem Background

### 1.2.1 Students lack a clear and standardized way of showcasing extracurricular skills alongside academic achievements

Research shows that ECAs contribute significantly to students'
employability by building social connectedness, professional identity
and transferable skills (Jackson et al., 2024). However, these
activities are often treated as separate from formal education, creating
a misalignment between student perceptions and university development
objectives (Nguyen et al., 2025). Barriers to entry such as financial
constraints, poor sense of belonging and limited accessibility further
reduces participation, meaning many students miss out on opportunities
to develop their employability skills (The Edge Malaysia, 2025). Current
recognition methods such as certificates and awards are fragmented,
paper-based, and lack standardized data to describe actual skills gained
from participating in extracurricular activities. This leaves students
without a clear, verifiable way to showcase extracurricular achievement
alongside academic transcripts.

Usually, participation in extracurricular activities is documented
manually when preparing a curriculum vitae (CV) or resume. Though, it is
up to the students to reflect on their personal experiences to retell
what they have learned and the skills they have gained. This method is
not without its weaknesses as the student might miss including crucial
information that could potentially present their capabilities more
effectively. Sometimes, some students go over the top with their
portrayal and make their competencies appear better than what it seems.

### 1.2.2 Employers face inefficiencies and fraud in recruitment due to unreliable resumes and ATS systems

Consequent with the previous problem statement, recruitment processes
often rely on resumes and ATS, which prioritizes keyword matching rather
than verified competencies. This leads to misrepresentation of skills
and forces employers to conduct costly probation periods or multiple
recruitment phases to validate candidate claims (Sharani et al., 2023).
Employers prioritize speed, cost reduction and the quality of
candidates, but current systems struggle to balance efficiency with
integrity.

The impact of this problem is compounded on the graduates who are
applying for jobs in the industry. In the ever-competitive job market,
it is not uncommon for job seekers to apply for hundreds of job
applications, and for fresh graduates, this can be overwhelming. Each
application requires a tailormade resume to perfectly fit the job
description for a slim chance at getting filtered by the ATS, and yet
they still must go through several short listings to test on the skills
and competencies they already have. Rinse and repeat across several
applications and it can clearly be seen how the redundant recruitment
process and the lack of confidence between graduates and employers can
lead to frustration and fatigue.

Blockchain-based certificates could address these inefficiencies by
providing tamper-proof and skill-rich credentials that reduce reliance
on keyword-based ATS filtering. Students can develop their skills by
participating in extracurricular activities, which are then logged into
the blockchain as verifiable micro-credentials, developing a
comprehensive overview of the student's competencies without the need
for second-guessing. While existing AI solutions for resume creation
risk misrepresentation of skills and outright fraud due to unreliable
data and assumptions, AI with blockchain as its source of truth offers
unprecedented functionality to automate the application process by
matching job descriptions with on-chain skill credentials with a high
level of assurance, thus increasing effectiveness of applications rather
than shooting in the dark. Better job matching also ensures employers
receive higher quality candidates with instant verification of their
skills, resulting in faster hires and eliminating the need for further
probation.

### 1.2.3 There is no unified platform that connects students, universities, event organizers and employers under a trusted certification system

Blockchain technology for education systems is not new in the industry.
Silaghi and Popescu (2025) report a steady growth on the number of
research papers published on the topic, with over 2700 papers published
as of year 2024, highlighting the immutable and decentralized properties
of blockchain as a strong proponent for secure and veritable academic
records. Even so, current blockchain initiatives in education focus
primarily on academic transcripts and degree verification, which other
aspects of education such as extracurricular recognition remain
underdeveloped (Rustemi et al., 2023; Silaghi & Popescu, 2025).
Universities and event organizers lack integration mechanisms to issue
verifiable extracurricular certificates, while employers lack tools to
instantly validate them. This creates fragmentation across stakeholders,
each with their own independent systems. Literature suggests future
research should focus on more comprehensive academic portfolios that
integrate blockchain with external systems, and AI-driven
personalization of training programs (Silaghi & Popescu, 2025).

Without a unified and trusted platform, students cannot fully leverage
the employability outcomes of extracurricular achievements, universities
cannot align ECAs with the objectives of the curriculum, event
organizers cannot demonstrate credibility, and employers cannot
streamline recruitment.

## 1.3 Project Aim

To design and implement a blockchain-based credentials system for
extracurricular activities that registers student skill development,
ensures authenticity and ownership of credentials, and enabling more
efficient verification of certificates for recruitment processes.

## 1.4 Objectives

-   To evaluate popular blockchain platforms for speed, scalability,
    security and sustainability, identifying trade-offs between public
    and hybrid blockchain approaches.

-   To design a method of quantifying skill development by representing
    extracurricular outcomes as micro-credentials and badges with
    embedded metadata capturing technical and soft skills, presenting a
    detailed overview of student's skill progression.

-   To develop a smart contract that automates certificate issuance by
    verifying event participation, prevent forgery by linking student
    identity and organizer credibility and maintain student ownership of
    personal skill development.

-   To design a student skills dashboard that implements a gamified
    approach to skill progression with role-playing game (RPG) elements,
    offer personalized recommendations for activities aligned with
    career goals to encourage extracurricular participation.

-   To develop verification tools for recruiters to instantly check
    certificate authenticity using QR codes and hyperlinks to blockchain
    records, eliminating the need for further validation in ATS systems
    and lowering recruitment costs and probationary periods.

## 1.5 Scope

### 1.5.1 In-Scope Activities

The scope of the project will mainly focus on the implementation of a
blockchain-based extracurricular credentials platform (BECP) that
interacts with the blockchain and develop the necessary requirements and
functionality for the extracurricular micro-credentials and verification
platform The project will conduct evaluation on popular blockchain
platforms such as Ethereum, Cardano, Solana, as well as permissioned
platforms such as Hyperledger Fabric to find the most suitable approach
for the application architecture. Next, the smart contract for the
issuance of on-chain extracurricular micro-credentials will be developed
and deployed on the chosen blockchain. The project will evaluate the
suitable data format and specifications for the NFT-based certificates
and micro-credentials to ensure compatibility with existing credentials
standards in the industry. The project will develop a skill
quantification framework around the micro-credentials, giving more
insight into the skills developed from the extracurricular activities.
The project will include the development of a skill dashboard interface
to visualize the student's skill progression based on the skill
quantification framework and suggest activities aligned with career
goals in a gamified approach. Verification tools will also be developed
for employers to easily verify candidate skills on the blockchain during
the recruitment process. The project will allow organizers to issue
certificates through the system in the event marketplace, with AI-driven
skill inferencing from event descriptions. Lastly, the project will
explore incentive strategies for universities, employers and organizers
to adopt the system.

### 1.5.2 Out-of-Scope Activities

To meet constraints and limitations, there are certain activities that
will not be performed within the scope of the project. The project will
not pursue a full-scale deployment of the prototype across universities,
and only to demonstrate feasibility. The project does not intend to
replace existing academic transcript systems and focuses only on
extracurricular certification. The project will not build a complete ATS
system but rather integrate with existing recruitment workflows. The
project will not conduct any advanced AI model training and instead use
existing Large Language Models (LLMs) in the market for basic skill
inferencing and tagging. The project may consider data privacy and
ownership concerns in the prototype design but will not be designing
full legal and regulatory policies. The project will not build a new
blockchain network and novel consensus mechanisms and instead deploy the
smart contract on existing blockchain platforms. Lastly, the project
will not develop a commercial event marketplace and will be limited to
university student activities only.

## 1.6 Potential Benefits

### 1.6.1 Tangible Benefits

  -----------------------------------------------------------------------
  **Verified skill       Students can definitively measure their
  portfolio**            technical and soft skills that are verifiable on
                         the blockchain in the form of NFTs and
                         micro-credentials.
  ---------------------- ------------------------------------------------
  **Reduced              Smart contracts automate certificate issuance by
  administrative         ensuring certificates are only generated when
  burden**               participation is verified

  **Instant employer     Recruiters can validate certificates directly
  verification**         on-chain, reducing reliance on ATS
                         keyword-matching and lowering recruitment costs.

  **Standardized         Extracurricular activities can better integrate
  recognition of         into formal student records
  extracurriculars**     

  **Higher               Demand for extracurricular activities rises as
  extracurricular        students seek to develop their skill portfolio,
  activity               benefiting extracurricular event organizers.
  participation**        
  -----------------------------------------------------------------------

  : []{#_Toc216886255 .anchor}Table 1: BECP Investigation Report Project
  Plan

### 1.6.2 Intangible Benefits

  -----------------------------------------------------------------------
  **Enhanced student      Gamified elements and clear sense of progress
  motivation and          encourage continuous skill development among
  engagement**            students.
  ----------------------- -----------------------------------------------
  **Improved              Verified extracurricular achievements lead to
  employability           clearer pathways to career readiness for
  confidence**            students.

  **Institutional         Universities and employers utilizing blockchain
  innovation and          technology in their systems stand out as
  reputation**            progressive and future-ready among the
                          competing institutions.

  **Trust and             Single source of truth on the blockchain builds
  transparency across     confidence among students, universities,
  stakeholders**          employers and event organizers.

  **Long-term             Unified and standardized credentials platform
  partnerships**          can strengthen partnerships between
                          universities, event organizers and employers.
  -----------------------------------------------------------------------

  : []{#_Toc216886256 .anchor}Table 2: Feature comparison between
  systems similar to the proposed BECP system

### 1.6.3 Target Users

-   University Students

-   University Administrators

-   Human Resources (HR) Recruitment Managers

-   Extracurricular Event Organizers

### 1.6.4 Functionalities / Deliverables

The BECP will allow university students:

-   To sign in using university credentials or blockchain wallet.

-   To view blockchain-issued extracurricular certificates stored in
    their wallet.

-   To view recommendations for extracurricular activities based on
    career goals.

-   To register for extracurricular activities in the events
    marketplace.

-   To export blockchain-linked resumes with QR codes or hyperlinks for
    certificate verification.

The BECP will allow HR recruitment managers:

-   To open links to student certificates on-chain for validating
    authenticity.

-   To access detailed metadata on candidate skills and competencies.

-   To integrate certificate verification into recruitment workflows.

-   To filter candidates based on verified extracurricular skills
    relevant to job requirements.

The BECP will allow university administrators:

-   To integrate extracurricular achievements into student records
    alongside academic transcripts.

-   To verify student university enrollment to the BECP through the
    university identity management system.

-   To monitor participation data for reporting and alignment with
    curriculum objectives.

The BECP will allow extracurricular event organizers:

-   To create events in the events marketplace and register
    participants.

-   To issue certificates to students through blockchain smart contracts
    after event completion.

-   To tag events with skills using AI-driven inference from event
    descriptions.

## 1.7 Overview of IR

The contents of this Investigation Report (IR) are divided into four
chapters, each addressing key aspects of the project:

**Chapter 1: Introduction**

This chapter lays the foundation for the project, providing an overview
on the main topics of the project, problem statements, project aim and
objectives, scope of work and potential benefits of the proposed BECP
project.

**Chapter 2: Literature Review**

This chapter explores existing literature on research areas relating to
ECAs and the use of blockchain technology in education. Key topics of
interest are divided into several sub-chapters compiling related
findings from various sources. From there, gaps or further suggestions
in research can be identified as opportunities for the proposed solution
to address. Moreover, the chapter also provides thorough discussion on
the system requirements, programming languages, development tools and
frameworks that will be used to develop the proposed solution.

**Chapter 3: Methodology**

This chapter outlines the development methodology used when developing
the projects, and the framework for the data gathering process.

**Chapter 4: Conclusion**

This chapter summarizes the important findings, insights and lessons
learned from the investigation, identifying key improvements for the
project, revising assumptions and plans in preparation for future work.

## 1.8 Project Plan

  ----------------------------------------------------------------------------------
  Task ID      Task Name             Duration   Start Date   End Date     Status
  ------------ --------------------- ---------- ------------ ------------ ----------
  WBS-IR-0-1   Project plan          ½ day      29/09/2025   29/09/2025   Complete

  WBS-IR-0-2   Project draft         ½ day      29/09/2025   29/09/2025   Complete

                                                                          

               Part 1                                                     

  WBS-IR-1-1   Acknowledgement       1 hour     13/12/2025   13/12/2025   Complete

  WBS-IR-1-2   Abstract              1 hour     13/12/2025   13/12/2025   Complete

  WBS-IR-1-3   Introduction          2 hours    18/10/2025   18/10/2025   Complete

  WBS-IR-1-4   Problem Background    0.5 day    18/10/2025   18/10/2025   Complete

  WBS-IR-1-5   Project Aim           1 hour     19/10/2025   19/10/2025   Complete

  WBS-IR-1-6   Project Objectives    1 hour     19/10/2025   19/10/2025   Complete

  WBS-IR-1-7   Project Scope         1 hour     19/10/2025   19/10/2025   Complete

  WBS-IR-1-8   Potential Benefits    0.5 day    19/10/2025   19/10/2025   Complete

                                                                          

               Part 2                                                     

  WBS-IR-2-1   Literature review     1 week     14/11/2025   21/11/2025   Complete
               research areas                                             

  WBS-IR-2-2   Similar systems       1 day      22/11/2025   22/11/2025   Complete

  WBS-IR-2-3   Technical research    1 day      23/11/2025   23/11/2025   Complete

                                                                          

               Part 3                                                     

  WBS-IR-3-1   System development    0.75 day   24/11/2025   24/11/2025   Complete
               methodology                                                

  WBS-IR-3-2   Data gathering design 0.75 day   25/11/2025   25/11/2025   Complete

  WBS-IR-3-3   Develop survey        0.75 day   25/11/2025   25/11/2025   Complete
               questions                                                  

  WBS-IR-3-4   Ethics form           0.75 day   28/11/2025   28/11/2025   Complete

  WBS-IR-3-5   Survey analysis       1 day      6/12/2025    6/12/2025    Complete

                                                                          

               Part 4                                                     

  WBS-IR-4-1   Conclusion            0.5 day    7/12/2025    7/12/2025    Complete

                                                                          

               Part 5                                                     

  WBS-IR-5-1   Log sheet             1 hour     13/12/2025   13/12/2025   Complete

  WBS-IR-5-2   Respondent list       1 hour     6/12/2025    6/12/2025    Complete

                                                                          
  ----------------------------------------------------------------------------------

  : []{#_Toc216886257 .anchor}Table 3: Aspect comparison between XP,
  Agile and Lean development methodology

# Chapter 2: Literature Review

## 2.1 Introduction

Blockchain technology is seeing increasing adoption in the education
sector, as institutions are taking advantage of its tamper-proof
security and higher transparency, making academic credentials easier to
verify and combat credential fraud that is looming in the industry, thus
improving confidence in graduates' qualifications among employers.
However, ECAs also play a significant role in building essential skills
among students and credentials gained from ECA participation remain
stuck using traditional systems that are fragmented and hard to verify.
This chapter explores the landscape of ECAs in universities, how
students perceive the value of ECAs for their personal development, how
blockchain is being used in the education systems today and how skills
can be measured in a more quantifiable way with blockchain as proof for
validation.

## 2.2 Research Areas

### 2.2.1 Recognition and Value of Extracurricular Activities

Students, university institutions and employers indeed recognize the
value of ECAs in building the necessary skills to increase employability
among students and soon-to-be future graduates and candidates, though
each stakeholder has different incentives that they capitalize on.
Existing literature broadly accepts the hypothesis in which ECA
participation directly correlates to increased employability.
Universities often market themselves with eye-catching slogans like
"100% graduate employability" to entice prospective students to apply
and thus have a vested interest in nurturing student employability in
their curriculum by encouraging ECA participation. Moreover, ECAs were
also shown to improve student adjustment to university life, leading to
higher student engagement and willingness to continue learning.

Further on employability, as previously stated, Jackson et al. (2024)
argue that employability is influenced by multiple factors, not just
technical knowledge, but also evolving skill demands, networking and a
sense of professional self. Participation in ECAs, such as taking on
leadership roles in clubs, volunteering in community service or engaging
in global exchange programs, expose students to teamwork and cultural
adaptability, which are highly sought after among employers. In fact,
recruiters prioritize the potential among candidates in their long-term
growth, not just immediate performance. Key indicators of potential
include strong graduate identity, specific values and principles,
intellect, past performance and social engagement.

![](media/image4.png){width="6.3in" height="4.027386264216973in"}

[]{#_Toc216886225 .anchor}Figure 1: Mean scores of barriers to
participation in extracurricular activities. Note: Q1: Lack of
motivation, Q2: Lack of confidence, Q3: Unaware of available activities,
Q4: Unappreciative towards value of activities Q5: Busy social life, Q6:
Commitment/time for academic study, Q7: Work commitments, Q8:
Family/caring commitments Q9: Discouragement from family/friends, Q10:
Discouragement from professional connections (co-workers/manager), Q11:
Financial reasons, Q12: Physical/Mental health concerns. Error bars
represent the standard deviation from the mean score. Adapted from
(Jackson et al., 2024).

The situation among students tells a more individual story. Students
participate in ECAs for their value of institutional recognition in
terms of future employability. Students who have constant
self-reflection and recognize the need to improve can maximize their
benefits in ECA participation. Student surveys conducted by Thompson et
al. (2013) highlight ECAs as a means of personal fulfillment and coping
mechanism during stressful times, on top of increasing employability
prospects. Students also strategize on which ECAs will benefit them the
most for their future career and express challenges balancing their
academics and extracurriculars. There are many barriers to entry faced
by students, including financial constraints, poor sense of belonging
and limited accessibility, especially for students with physical
impairments (The Edge Malaysia, 2025).

Overall, literature suggests that universities must further tighten the
integration of ECAs into the standard curriculum, reducing barriers to
participation and providing standardized recognition to maximize their
impact on students' future employability.

### 2.2.2 Measuring Skill Development using Micro-Credentials

While ECA participation is important, the outcomes of its benefits are
often superficial and speculative, in which their true impact only
prevails by the time students have graduated and begin applying for
jobs. Therefore, a recurring challenge is how skill development can be
measured objectively from participating in ECAs. McGreal (2023)
introduced the idea of micro-credentials, which are small units of
learning represented as badges or credits, to track skill competencies
in more granular fashion. These micro-credentials can be stacked
according to specific skillset progressions as students participate in
more ECAs, which can give them a good indication of how well they are
developing the skills necessary for their career of choice. Moreover,
the credentials can be embedded with metadata describing both technical
and soft skills gained by the student, making them transferable across
institutions and useful for employers.

Micro-credentials can be a suitable data format that can be recorded on
the blockchain securely. Minting and recording credentials issuance on
the blockchain gives students more ownership over their own personal
development, allowing them to transfer these skills across institutions
easily and control who can view their data. Though, the immutability of
blockchain does raise challenges for compliance with privacy compliance,
such as honoring the right to remove data and not be remembered. Ali
(2024) emphasizes that ensures the integrity of student assessment data,
while enabling AI to generate personalized learning plans and automate
verification processes. Rodriguez et al. (2025) raised concerns that
students remain hesitant to adopt blockchain and AI technology, unless
institutions are committed to implementing these technologies in their
learning infrastructure and policies.

To summarize, to measure skill progression among students as they
participate in ECAs, there is a need to develop a framework that
combines micro-credentials, blockchain metadata and AI-driven
inferencing to provide verifiable, transferable recognition of skills
and competencies, while empowering student ownership of their personal
development.

### 2.2.3 Blockchain Platforms & Smart Contracts

An increasing amount of literature on blockchain-based applications for
education over the years suggests a rising interest in transparent and
verifiable academic credentials, but challenges in combating credential
fraud persist to this day. Rustemi et al. (2023) highlighted the
worrying scale of certification fraud syndicates, with degree mills
generating billions from making fake credentials. Their review on
blockchain-based certification systems suggests a hybrid blockchain
approach that combines public transparency with private institutional
control, offering a better balance between openness and security. Smart
contracts can automate certificate issuance based on specific
requirements and conditions set by the institution, such as specific
learning outcomes met and deliverables completed, ensuring they are only
generated when participation is verified and preventing misuse or manual
errors.

![](media/image5.png){width="6.3in" height="3.5615135608048996in"}

[]{#_Toc216886226 .anchor}Figure 2: Blockchain platforms used in
initiatives. Adapted from (Silaghi & Popescu, 2025).

There are plenty of blockchain-based systems and standards currently
being used in education today that the project can take example from.
Silaghi & Popescu (2025) mentioned initiatives like Blockcerts,
developed by Massachusetts Institute of Technology (MIT) and Block.co by
the University of Nicosia already securing millions of documents in
academia. As for the choice of blockchain platforms, Ethereum remains
the most cited platform for its mature ecosystem and versatility to
cater specialized needs, but there were concerns on scalability and
transaction costs which can limit practicality. Alternatives such as
Cardano, Solana, and permissioned blockchains like Hyperledger Fabric or
the European Blockchain Services Infrastructure (EBSI) offer varying
trade-offs in decentralization, scalability and integration with
enterprise requirements, all of which should be carefully considered by
this project.

In short, literature highlights a need to choose a blockchain platform
that balances scalability, security and sustainability, and also
presents smart contracts as a means to ensure legitimate issuance of
credentials.

### 2.2.4 Recruitment Processes & Applicant Tracking Systems

When graduates apply for jobs, they will usually have to prepare a
resume. Though there is an unspoken rule of how resumes should be
formatted, what on-demand and trendy keywords must they include, as the
resume will most likely be run through an ATS system that prioritizes
keyword matching rather than verified competencies. Sharani et al.
(2023) identified that while 32% of companies use ATS, the majority
still manage their recruitment procedures using spreadsheets or manual
processes. Employers prioritize speed and cost reduction on top
candidate quality, yet current systems struggle to balance efficiency
and integrity of applications.

![](media/image6.png){width="6.3in" height="4.672820428696413in"}

[]{#_Toc216886227 .anchor}Figure 3: Technologies used for handling
recruitment processes among 50 companies. Adapted from (Sharani et al.,
2023).

The issue of fraudulent resumes and certificates as mentioned from the
previous research area exacerbates the problem. Therefore, employers
have no choice but to perform probation periods to validate candidate
claims. Rustemi et al. (2023) emphasizes the use of blockchain-backed
certificates for addressing these inefficiencies by providing
tamper-proof credentials that reliably prove the candidate's
competencies.

To address the shortcomings of existing recruitment processes,
blockchain-based certificates may complement ATS systems by offering
verifiable skill data, increasing integrity and improving overall hiring
efficiency.

### 2.2.5 Integration of AI & Blockchain in Education

AI and blockchain appear to go hand in hand as a novel approach to
enhance the way learning can be assessed and how credentials can be
verified. Ali (2024) proposes a framework that uses blockchain as a
foundation for data integrity while AI capitalizes on the high-integrity
on-chain data to generate personalized learning plans and provide
automatic verification. The combination of these two technologies may
address the limitations of current traditional assessments, such as
subjective grading and cumbersome data management.

Literature puts into perspective on students' wariness in adopting AI
and blockchain technology to assess their learning, as presented by
Rodriguez et al. (2025), often due to lack of awareness of their
benefits. Students tend to depend on their academic institutions to set
up policies for them, therefore institutional commitment to innovating
policies and infrastructure is essential for adoption of AI and
blockchain technology in education. Silaghi & Popescu (2025) suggested
that future research should focus on integrating academic records with
various interoperable systems, enhanced with blockchain technology, to
develop a more comprehensive academic portfolio for students.

AI can further improve blockchain-based extracurricular credentials by
identifying skills that can be gained from extracurricular activities by
inferring their event descriptions and providing personalized
recommendations and development plans to enrich the skill development
experience among students.

### 2.2.6 Adoption & Stakeholder Incentives

To ensure the successful adoption of the proposed BECP, it is worth
identifying how stakeholder incentives align with one another and
capitalize on the missing link. University institutions benefit from
standardized recognition of ECAs to further their mission to develop
employability skills among students (Thompson et al., 2013) and
automated issuance of credentials can help reduce administrative
workload (Rustemi at al., 2023). Employers can reduce recruitment costs
and minimize fraud risks by gaining access to new verification tools
that can instantly verify candidate profiles. Event organizers can also
benefit from the BECP platform with the increased demand for
blockchain-backed certificates and attract more participants.

As for students, the BECP can return ownership of their credentials,
increasing motivation to participate in ECAs thanks to concrete and
tangible progression goals using personalized training plans and
gamified dashboard experiences. As emphasized by Thompson et al. (2023),
students participate in ECAs not only for institutional recognition and
employability outcomes, but also a healthy escape for relief and
personal enjoyment. The BECP may leverage these motivational aspects to
deliver a compelling platform that students will most likely use.

## 2.3 Similar Systems / Works

### 2.3.1 Proof of Attendance Protocol (POAP)

![](media/image7.png){width="6.3in" height="3.742014435695538in"}

[]{#_Toc216886228 .anchor}Figure 4: POAP gallery page screenshot
displaying a gallery of featured POAPs issued for various events,
conferences and certifications. Adapted from (POAP Inc., n.d.)

**Introduction:**

POAP, short for Proof of Attendance Protocol, is a popular
blockchain-based badge collection platform, where event organizers can
issue digital collectibles, or POAPs that attendees can collect and
store in their personal collection, serving as digital proof of their
attendance to the event. POAP serves as an ecosystem for preserving
memories by turning precious moments into collectibles on the
blockchain, ultimately making them last forever. The system was launched
in the year 2019 and its usage was first popularized during the
EthDenver 2019 conference, which captured the interest of many
collectors as a compelling way of commemorating valuable experiences and
human connections through event participation. As of today, POAP
continues to be the platform of choice for incentivizing participation
and event engagement, and developers continue to innovate on top of the
ecosystem to bring more value and utility to collectibles.

**Technical Details:**

In essence, a POAP collectible is a token that implements the ERC-721
standard specification for NFTs on Ethereum. This allows POAPs to
interoperate with other Ethereum smart contracts that follow the same
specifications. The POAP contains metadata that stores various
information about a particular event such as the name, location, date,
website URL and the image of the collectible. Event organizers can issue
their own POAP by interacting with the POAP API to register their event
and the necessary metadata for the POAPs to be issued. During the event,
attendees can claim the POAPs by scanning a QR code or signing a
transaction via wallet integration. For ease of adoption, attendees may
reserve POAPs using their email address, which they can mint later once
they have created their own wallet. Since a POAP is a standard ERC-721
token, developers can build on top of the POAP ecosystem to bring extra
utility to the holders of certain POAPs, such as exclusive access to
content or special discounts and offers. POAP smart contracts were first
deployed on Ethereum but have deployed on L2s and various EVM-compatible
chains to address scalability and reduce transaction fees. Nowadays,
POAPs are minted on Gnosis Chain by default.

The smart contracts and the issuance of POAPs are currently governed by
POAP Inc. The POAP foundation establishes the POAP Curation Body that
provides guidelines for making high-quality POAPs and manually reviews
every POAP issuance. This is to ensure POAPs issued are well-established
with verified event organizers, while preventing POAPs from being used
for harm and nefarious purposes.

**Strengths:**

-   **Verifiable Proof of Participation**: POAP leverages blockchain
    technology to provide immutable evidence that a person has attended
    a particular event.

-   **Engagement and Incentives**: The act of collecting these
    collectibles helps increase event engagement by gamifying the
    participation and help foster stronger community loyalty.

-   **Portability & Ownership**: As POAPs are minted and sent directly
    to the attendees' wallet, they maintain full ownership of the POAP,
    and they can be ported on multiple chains and platforms.

-   **Easy Distribution Experience**: POAP provides an intuitive
    distribution process through the QR code redemption process and
    gives attendees the option to reserve the POAP under their email,
    helping non-crypto savvy people onboard the platform.

**Weaknesses:**

-   **Limited Scope**: POAPs are only used to prove attendance at
    events, but do not provide more information on skills, contributions
    or learning outcomes gained from the event.

-   **Scalability Concerns**: POAP has smart contracts deployed on many
    chains to address scalability issues on Ethereum, which poses its
    own challenges of managing fragmenting POAPs across multiple chains.

-   **Dependence on Organizers**: While every POAP issuance is moderated
    by the POAP foundation, potentially fraudulent organizers can
    undermine trust and authenticity of POAPs.

-   **Superficial Recognition**: Extra work on compliance and depth is
    required to allow POAPs to be recognized for academic or
    professional certification systems.

### 2.3.2 UniLah: The Student App

![](media/image8.png){width="2.336674321959755in"
height="5.061947725284339in"}

[]{#_Toc216886229 .anchor}Figure 5: UniLah menu dashboard. Adapted from
(Apple App Store, n.d.)

**Introduction**:

UniLah is a student lifestyle app co-founded by Shawn Tham in Universiti
Malaya. Previously only an Instagram page that later flourished into a
startup project, UniLah aims to help university students in Malaysia
discover events, find exclusive student deals on products and explore
various career opportunities to help them make the most of their
university life (Disruptr MY, 2023). UniLah collaborates with event
organizers and university clubs to provide a comprehensive listing of
university events, competitions and workshops nationwide for students to
participate in. The platform also partners with popular F&B and fashion
brands to offer attractive deals on products for students and provide
easy redemption using their student card.

  ----------------------------------------------------------------------------------------------------------
  ![](media/image9.png){width="2.3357753718285212in"   ![](media/image10.png){width="2.3357753718285212in"
  height="5.06in"}                                     height="5.06in"}
  ---------------------------------------------------- -----------------------------------------------------

  ----------------------------------------------------------------------------------------------------------

  : []{#_Toc216886258 .anchor}Table 4: Advantages and Disadvantages
  between Surveys and Interviews

[]{#_Toc216886230 .anchor}Figure 6: UniEvents feature. Adapted from
(Apple App Store, n.d.)

However, as of the time of writing this investigation report, the team
at UniLah has pivoted from a mobile app platform to a marketing agency
that holds the largest student database in Malaysia, with over 13000
students contacts, aiming to connect brands with the Gen Z market. This
is because the previous discount app business model did not appeal to
the habits of university students in Malaysia according to their
internal market testing, but their backlog of students helps them pivot
their focus to what UniLah has become today (Kan, 2025). The mobile app
itself appears to have ceased operations.

**Technical Details:**

As far as technicalities go, the UniLah app is a standard mobile
application that is deployed on conventional technologies, some may
refer to as "web2". The app does not use any blockchain technology but
had plans to integrate an AI-based solution for job matching in its
development roadmap (Disruptr MY, 2023).

**Strengths:**

-   **Familiar Interface**: Easy access to events, discount offers and
    career opportunities ensure students are always on top of the latest
    activities.

-   **Strong Partnership with Organizers and Brands**: Event organizers
    and brands can leverage the platform of active university students
    to increase participation and engagement, leading to potential
    partnership opportunities.

**Weaknesses:**

-   **Centralized operation and governance**: The UniLah app has ceased
    operations due to the team pivoting towards different ventures with
    no other party to continue its development, highlighting the need
    for decentralization of the platform and sustainable business model.

-   **No tangible outcome from event participation**: The app only
    serves as a listing for events but has no robust system for tracking
    student skill development.

### 2.3.3 Comparison

  ---------------------------------------------------------------------------
  Feature        POAP (Proof of        UniLah              Proposed BECP
                 Attendance Protocol)                      System
  -------------- --------------------- ------------------- ------------------
  Main Purpose   Provide verifiable    Help students       Provide verifiable
                 proof of attendance   discover the latest blockchain-based
                 at events via         university events   skill credentials
                 blockchain-based      and discount offers when participating
                 NFTs.                 from popular        in ECAs to help
                                       brands.             students measure
                                                           technical and soft
                                                           skills for
                                                           employability.

  Platform       Ethereum and          Web2 only, no       Hybrid blockchain
                 EVM-compatible chains blockchain platform platform

  Certificate    NFT-based digital     No certificates     NFT-based
  Type           collectible with      issued, listings    credentials with
                 event metadata        only                embedded metadata
                                                           describing skills
                                                           gained

  User Ownership Attendees own POAPs   Personal data       Students own
                 in their blockchain   stored in           certificates in
                 wallet                centralized servers their wallet, with
                                                           control over
                                                           sharing and
                                                           visibility

  Gamification   Collectible badges    No gamification     Gamified dashboard
                 encourage community   elements.           visualizes skill
                 engagement.                               progression,
                                                           career goals and
                                                           activity
                                                           recommendations.

  Recruitment    Limited; POAPs are    Connect students    Allow employers to
  Integration    not designed for      with career         verify
                 recruitment workflows opportunities but   certificates with
                                       no integration      QR code to
                                       between systems.    on-chain proof and
                                                           ATS integration.

  Scope of Use   Community events,     University events,  University
                 conferences and       career              extracurricular
                 online gatherings     opportunities and   activities, career
                                       discount offerings. services,
                                                           recruitment
                                                           pipelines

  AI Integration No AI-based feature   Proposed AI-based   Use AI to infer
                 implemented.          job matching in     skills from ECA
                                       roadmap but was not event descriptions
                                       delivered.          and create
                                                           personalized
                                                           learning plans
                                                           aligned with
                                                           career goals.

  Partnership    Provides POAP         Partners with event Aim for
  with           issuance as a         organizers and      collaboration
  Stakeholders   service, with no      brands to list      between university
                 close partnerships.   events and offers.  institutions,
                                                           event organizers
                                                           and recruiters to
                                                           establish a skill
                                                           credentials
                                                           standard
                                                           recognized by all
                                                           stakeholders for
                                                           verifying student
                                                           competencies.
  ---------------------------------------------------------------------------

  : []{#_Toc216886259 .anchor}Table 5: Sections, number of questions and
  purpose for survey structure

### 

### 2.3.4 Conclusion

The proposed BECP may build on POAP's aspects of verifiability, personal
ownership and gamification and enhance its capabilities with more
detailed metadata that outlines specific skills and learning outcomes
gained from event participation, making them more versatile for use in
verifying skills developed from ECAs. At its prime, the UniLah student
lifestyle app showcased a glimpse of the user experience that is
expected of the proposed BECP. Students can discover plenty of
opportunities to engage in ECAs and find the ones that best fit their
career development strategies. It is unfortunate to see that the full
capabilities of UniLah could not come into fruition as many features
were still in development before the shift in operations. Therefore, the
BECP must fill in the gap and bring new incentives to ECA participation
via verifiable recognition of skills, enhance the experience with
AI-driven personalized learning goals and further improve
interoperability with universities and relevant agencies in education to
ensure a more sustainable outcome for the project.

## 2.4 Technical Research

### 2.4.1 System Requirements Analysis

In this section, the author will consider the minimum system
requirements for running the proposed Blockchain-based Extracurricular
Credentials Platform (BECP) on the client. The requirements are
carefully considered based on the key functionalities of the proposed
system. By minimum, the requirements should be able to perform all the
available functions with minimal issues, and anything above this
threshold is expected to deliver a more optimal experience. Outlining
this minimum spec helps provide a baseline for performance evaluation
during the development of the proposed system.

**Minimum Hardware Requirements:**

The proposed BECP system will be built as Progressive Web App (PWA), in
which the web-based platform can be served as a native mobile
application. As such, additional mobile-specific requirements will also
be provided.

***Desktop requirements for student or recruiter device:***

-   **CPU**: Quad-core 64-bit processor, such as Intel Core i3 8^th^ Gen
    or AMD Ryzen 3 1^st^ Gen to ensure processes and background tasks
    are executed efficiently.

-   **Memory (RAM)**: 8 GB minimum to ensure responsive performance when
    viewing various content listings and detailed skill dashboards.

-   **Storage**: 4 GB of minimum available storage, as the system is
    web-based, the storage is only used for caching, installing
    blockchain wallet extensions and downloading exported skill
    credentials portfolio.

-   **Display**: 1366 x 768 minimum resolution to clearly view content
    on the desktop, 1920 x 1080 recommended.

-   **Network**: Stable broadband with minimum of 10 Mbps download speed
    to ensure content is loaded quickly and targeting less than 150ms in
    latency to connect to public gateways.

***Mobile-specific requirements for PWA support:***

-   **Operating System**: Android 10+ or iOS 14+

-   **RAM**: 3 GB minimum

-   Storage: 500 MB

-   **Network**: 4G/LTE minimum, Wi-Fi recommended for faster content
    loading and IPFS fetches.

-   **Accessibility**: Allow the use of keyboard for navigating the
    interface, include a high-contrast setting to make the interface
    clearer, and add support for screen readers.

**Minimum software requirements:**

-   **Operating Systems**: Windows 10/11, macOS 12+, Ubuntu 20.04+ (or
    other modern Linux distros)

-   **Browsers**: Chrome 116+, Edge 116+, Safari 16+, Firefox 115+,
    browsers with support for JavaScript ES2022 specification,
    WebAssembly and WebCrypto.

-   **Wallets (one of)**: MetaMask, Rainbow or Coinbase Wallet,
    supported wallets on mobile are Metamask and WalletConnect.

-   Runtime dependencies:

    -   **Web Crypto API**: Provides necessary cryptographic primitives
        for signature verification and generation of QR codes.

    -   **Service Worker**: Specifically required for supporting PWA
        offline data caching and push updates.

    -   **QR scanner access (optional)**: Camera access permission for
        mobile verification flows.

-   Security features:

    -   **TLS**: The web-based platform should only be accessed via
        HTTPS with HSTS and secure cookies.

    -   **SSO**: Integrates university identity management systems using
        OpenID Connect or OAuth 2.0 for enrollment verification.

    -   **Content security policy (CSP)**: Restrict scripts and
        connection sources such as RPC endpoints and IPFS gateways.

### 2.4.2 Programming Language Chosen

**TypeScript -- Frontend Development**

TypeScript is a statically typed programming language aimed to improve
JavaScript by adding type syntax to explicitly define data types to
enable type checking during compile time, allowing web developers to
avoid the pitfalls of loosely typed programming and detect errors early
during development, and not on runtime. With support for modern
ECMAScript features and improved developer tooling, TypeScript helps
make JavaScript more maintainable for developing large and complex web
applications, while keeping full compatibility with web standards and
popular frontend frameworks.

**Advantages:**

-   **Type safety**: Objects and variables in TypeScript should be
    explicitly defined with static types, interfaces or generics to
    ensure consistency across the codebase and prevent hard-to-find bugs
    such as null references.

-   **Improved developer productivity**: The strict type checking system
    helps enabling code completion, automatic refactoring and real-time
    error detection that would otherwise be unavailable in regular
    JavaScript, allowing for an enjoyable developer experience.

-   **Very high adoption across frameworks**: TypeScript support is
    available on various JavaScript frameworks and browser APIs,
    providing the necessary types and interfaces in packages to further
    enhance maintainability.

-   **Increased performance of compiled JavaScript**: TypeScript code is
    compiled into regular JavaScript code that is minified, reducing
    file size and leading to some performance gains during runtime.

TypeScript is essential for the development of the proposed BECP system
as the platform has complex UI flows for the student dashboard, issuer
portal and verifier views that require careful control when passing
object properties. Moreover, as the platform will handle skill
credentials based on specified standards and data formats, the platform
will greatly benefit from defining interfaces for these specifications
to ensure type consistency across the codebase. External packages such
as wallet providers will usually provide their own types for their
components, making integration with the proposed system easier and
error-free. As the platform will be interoperating with various
university and recruitment systems, outlining these interfaces can
ensure more predictable behavior and reduce regressions as new features
are implemented in the future.

**Solidity -- Smart Contract Backend Development**

The Ethereum smart contract programming language known as Solidity is a
Java-like language that uses static types to build smart contracts that
will live on the decentralized Ethereum blockchain. The functions in the
smart contract is triggered by the Ethereum Virtual Machine (EVM), where
each operation equates to some execution cost known as gas fees, to be
paid by the contract executor. Solidity contracts define functions that
revolve around manipulating state on the blockchain, such as reading
current state and updating to a new state when specific conditions are
met, which can then be used to define various contractual agreements
between parties, with immutable code as the mediator. While new smart
contract languages are available that aim to make development easier
through abstraction and syntactic sugar, Solidity remains a top choice
among developers thanks to the continuous improvements after years of
battle testing and a more developed ecosystem around it.

**Advantages:**

-   **Compatibility across multiple chains**: Many blockchains use EVM
    as the execution layer to maintain compatibility with Solidity
    applications while having their own performance and decentralization
    improvements to suit various needs. This allows developers to write
    a Solidity application once and deploy them to multiple chains
    easily.

-   **Mature standards**: Many Ethereum standards have been implemented
    into battle-tested and security-audited templates that the platform
    can immediately use, such as OpenZeppelin contracts, to develop
    faster while minimizing security flaws.

-   **Extended off-chain infrastructure**: Solidity applications can
    emit on-chain events to perform event-based executions using
    off-chain services such as Alchemy RPC providers and The Graph
    querying service, helping to bridge on-chain state for use in
    real-world applications.

Solidity provides the necessary functionality for developing the smart
contract backed for the proposed BECP system. The platform can make use
of the ERC-1155 standard to manage issuance of credentials in a single
contract to reduce complexity and transaction fees. The expressiveness
of Solidity contracts can describe special roles for the issuer,
maintain student ownership and even 'soul-bound' certain credentials to
prevent transferability depending on use cases. With the option to
deploy the contract on an L2 EVM-compatible blockchain, scalability
issues of Ethereum can be addressed without the need to learn a new
programming language or developer tooling.

### 2.4.3 Integrated Development Environment (IDE) Chosen: Zed

![](media/image11.png){width="6.3in" height="4.214374453193351in"}

[]{#_Toc216886231 .anchor}Figure 7: Screenshot of Zed landing page (Zed
Industries, n.d.)

Zed is an up-and-coming code editor that has been garnering attention in
the developer ecosystem. Founded by the original makers of the Atom code
editor in 2023, Zed strives to improve on its predecessor by rebuilding
the editor from the ground up to take full advantage of multithreaded
CPU processing and GPU rendering to deliver a lightning-fast and
responsive editor, while innovating on collaborative coding between
humans and AI. Zed automatically installs the necessary support packages
and extensions for languages based on the current opened files to enable
instant debugging and ensure only the necessary extensions are loaded.
Zed is constantly updating with new features such as native Git support,
agentic editing, remote development and recently has been made available
on Windows (previously only available on Mac and Linux), slowly turning
the code editor into a full IDE for developers who want to code at the
speed of thought.

**Advantages:**

-   **Multi-threaded processing and GPU rendering**: Zed provides
    separate releases for Mac, Linux and Windows to take advantage of
    the native graphics libraries (DirectX, Metal) of each operating
    system and deliver videogame-like performance and lightning-fast
    responsiveness. Developers no longer need to wait long to load
    complex projects and get started immediately.

-   **First-class integration with popular LLMs**: Zed is built from
    scratch with AI collaborative coding by design. Developers can opt
    for a pay-to-use plan or use their own API key to enable agentic
    editing and advanced code completion to improve developer efficiency
    while maintaining human control.

-   **Open-source software**: Anyone can contribute to Zed's continuous
    development to ensure that new features are prioritized with
    developers' priorities in mind.

-   **Growing ecosystem of extensions**: While Zed is relatively new to
    the developer ecosystem, language support and extensions for Zed are
    growing steadily.

The justification for Zed's use for the development of the proposed BECP
system lies mainly in the author's personal preference. The performance
improvements due to multi-threading and rendering on the GPU is a breath
of fresh air from the previous environment. Moreover, the editor
maintains a minimal working environment throughout the time as most of
the heavy lifting to set up the development environment is done in the
background, letting the author focus on the work at hand without being
bogged down by extension management or troubleshooting misconfigured
setups. The author noticed improved productivity and more personal
enjoyment thanks to these subtle nuances in speed improvements. While
competing code editors achieve cross-compatibility at the cost of
performance overhead of web-based applications, Zed understood the
negative impact of a sluggish user experience and takes a different
route entirely to deliver the fastest code editor in the market, while
still being made available across most operating systems.

### 2.4.4 Database Management System Chosen: Pinata (Interplanetary File System - IPFS)

![](media/image12.png){width="6.3in" height="3.5296161417322836in"}

[]{#_Toc216886232 .anchor}Figure 8: Screenshot of Pinata landing page
(Pinata, n.d.)

Working with blockchain requires a fundamental shift in the way data is
stored and managed to uphold the principles of transparency and
immutability. Traditional DBMSs are well-suited for regular workloads
that require centralized control for data integrity and access
management but are less practical in a decentralized system to ensure
permanent storage and transparent access. Pinata is a content management
service that is built on top of the InterPlanetary File System (IPFS),
which is an open protocol for running a peer-to-peer file storage and
transfer network. Pinata simplifies the usage of IPFS by providing APIs
for storing and retrieving files, pinning services to ensure permanent
storage and gateways for reliable content delivery.

-   **Decentralized storage**: Files on IPFS are stored on a
    decentralized network that makes them tamper-proof and globally
    accessible, perfect for blockchain certificate metadata and event
    records.

-   **Familiar database workflow**: Pinata provides a familiar key-value
    database format that is common in conventional NoSQL database
    solutions like Amazon DynamoDB or Redis, so existing database
    management knowledge can carry over to Pinata.

-   **Easy to use API**: Pinata provides APIs that help simplify
    integration with minimal configuration requirements.

> Pinata, together with IPFS is ideal for the proposed BECP system
> because the blockchain-based ECA credentials require permanent and
> verifiable metadata storage for the skills gained, event details and
> issuer identity. Furthermore, Pinata ensures that employers and
> university administrators can always access certificate metadata
> through IPFS gateways and even from external systems that interoperate
> with the BECP, thus maintaining transparency and the ability to
> self-verify on-chain credentials.

### 2.4.5 Blockchain Platform Chosen: Optimism

![](media/image13.png){width="6.3in" height="3.1823075240594925in"}

[]{#_Toc216886233 .anchor}Figure 9: Screenshot of Optimism OP Stack
landing page (Optimism Foundation, n.d.)

Since the smart contract will be developed using Solidity, there are
plenty of blockchain platforms that the code can be deployed on, not
just on Ethereum. To that end, the author has chosen Optimism as the
platform of choice. Optimism is an Ethereum Layer-2 (L2) scaling
solution that groups transactions together using a method called
optimistic rollups, thus reducing transaction costs by sharing fees
across multiple transactions and increasing throughput while sharing the
security properties of Ethereum. Optimism focuses on developer
ease-of-use and ensure code can deployed on Ethereum can also be
transitioned to Optimism with minimal changes. While alternative L2s or
sidechains such as Arbitrum and Polygon may offer more savings in
transaction fees and faster transaction finality through more advanced
scaling techniques, for the sake of simplicity in developing the
proposed system, Optimism provides a suitable compromise between costs
and easy development.

**Advantages:**

-   **Low transaction fees**: Using optimistic rollups, Optimism can
    significantly reduce gas fees compared to Ethereum mainnet.

-   **High throughput**: Optimism enables faster certificate issuance
    and verification at a larger scale.

-   **Focused on developer ease of use**: Optimism has full
    compatibility with Solidity contracts and existing Ethereum tooling.

-   **Backed by Ethereum security**: Optimism inherits the security
    guarantees of Ethereum for verifying transaction batches to ensure
    high security even with high scalability.

-   **High community adoption**: Optimism is widely used and supported
    by many blockchain wallets and RPC providers.

The smart contracts for credential issuance and verification should
remain affordable and scalable for students and universities. Therefore,
deploying the contracts on Optimism can make the platform more
sustainable and more user-friendly thanks to the reduced transaction
fees and higher throughput, whereas deploying on the Ethereum main
network will make certain transactions prohibitively expensive.
Moreover, its full compatibility with Solidity allows the author to use
existing Solidity knowledge to develop the contracts without setbacks,
ensuring the development of the proposed BECP can be completed within
the project deadlines.

### 2.4.6 Web Server Chosen: Node.js

The JavaScript runtime platform Node.js is designed for enabling
JavaScript to run on the backend for scalable, event-driven
applications, taking advantage of JavaScript's widespread adoption and
ecosystem while delivering sufficient performance improvements using the
high-performant V8 JavaScript engine used in the Chrome browser. Node.js
can behave as a web server by installing specific packages for accepting
HTTP responses. By using Node.js that is already in use for the
development of the proposed BECP frontend, the architecture of the
system can be simplified by using Typescript for both frontend and
backend components and eliminating additional components that may take
up development time and future maintenance.

**Advantages**:

-   **Event-driven architecture**: JavaScript works best using
    event-driven patterns to allow handling of multiple concurrent
    requests efficiently, making it ideal for certificate verification
    queries.

-   **One language for the entire stack**: Node.js enables JavaScript or
    TypeScript to be used across the frontend and backend applications,
    thus making it easy to integrate them together.

-   **Rich ecosystem**: Node.js uses the Node Package Manager (NPM)
    which provides thousands of packages and libraries for APIs,
    authentication and integration with the blockchain.

-   **Cross-platform**: Node.js can be run on Windows, Mac and Linux
    with minimal configuration.

On top of ease of integration with the proposed BECP system
architecture, Node.js can enable real-time certificate verification and
API services using asynchronous event handling to manage concurrent
verification requests from employers and students. The unified stack
under a common programming language helps simplify maintenance and
accelerate development. Common blockchain libraries such as Wagmi and
Pinata APIs all provide packages on NPM, making Node.js the undisputed
choice for a web server runtime.

### 2.4.7 Additional Tools and Libraries Used

**Next.js v16.0.7 -- JavaScript Framework**

Next.js, not to be confused with Node.js the runtime or NestJS the
backend framework, is a comprehensive JavaScript frontend framework that
builds on top of the React user interface library, developed by Vercel.
React itself is a bare bones library for rendering webpages using a
component-based approach and relies on external packages for certain
functionalities such as page routing and data fetching. Next.js
addresses this by providing all these functionalities out-of-the-box
with built-in optimizations for building fast, reliable and accessible
websites using React. The frontend for the proposed BECP system will be
developed using Next.js, taking advantage of its robust React ecosystem
of packages and solutions for delivering the required functionalities
for the front-facing application.

**ShadCN UI v3.5.1 -- UI Library**

ShadCN UI (stylized as shadcn/ui) is a UI component library developed by
shadcn, who currently works at Vercel, which provides essential user
interface components such as buttons, input fields and menus in a
minimal yet professional looking design system. ShadCN UI stands apart
from other UI component libraries by embracing open code principles for
easy modification, composable interface for consistent styling across
the design system and setting good defaults that look great from the
start. For the proposed system, ShadCN UI provides a solid foundation
for building a beautiful and functional user interface for the frontend
to deliver great user experiences for stakeholders.

**Recharts v3.5.1 -- React Charting Library**

Recharts is a charting library for React web applications. It provides
various types of charts for dynamically visualizing data on the webpage,
perfect for the gamified student dashboard for the proposed BECP system.

**Wagmi v3.1.0 -- React Hooks for Ethereum**

Wagmi is a React library providing various React hooks for interacting
with the smart contract on the Ethereum blockchain, in this case on the
EVM-compatible Optimism platform. React hooks are essential functions
that can be called within UI components, enabling the frontend to
execute backend processes. Wagmi provides comprehensive hooks for
connecting the blockchain wallet to the BECP platform, provides
necessary TypeScript interfaces using Viem as the underlying Ethereum
interface module provider, and ensures reliable data consistency and
behavior using TanStack Query.

**RainbowKit v2.2.9 -- Wallet Integration**

RainbowKit is a blockchain wallet integration provider that adds a
user-friendly interface for connecting the user's wallet with the
proposed BECP system for smart contract execution. It integrates well
with Wagmi for a cohesive wallet integration experience.

**Alchemy Node RPC API -- Ethereum Indexing API**

Alchemy is a blockchain infrastructure provider that provides a reliable
developer ecosystem for interacting with various blockchains. The
proposed BECP system will execute smart contract actions by calling the
OP Sepolia RPC API, the testnet for Optimism where the smart contract
will be deployed. The free plan offered by Alchemy is sufficient for
testing smart contracts and demonstrating functionality of the proposed
system.

**Hardhat v3.0.16 -- Smart Contract Development Environment**

Hardhat is a development framework for building smart contracts that
will be deployed on Ethereum-compatible blockchain platforms. It is a
complete framework that has the necessary tools for developing, running
tests and deploying the smart contract on the blockchain. The author has
experience working with Hardhat and it is more than enough to develop
the smart contracts for the proposed BECP system.

**Git v2.52.0 -- Source Control Management (SCM)**

Git is a source control management software that tracks changes in the
codebase and allows developers to commit and stage their changes to the
codebase and keep a trail of development. If something went wrong during
development or to prevent regressions when developing a new feature, Git
can revert changes to a previous commit or create separate development
branches to work on various features in parallel. Git was created by
Linus Torvalds in the year 2005 as he was finding ways to manage the
growing development of the Linux kernel. Git is a mature SCM that is
widely used in any development project today, even with its advanced
learning curve and subtle quirks. Code repository platforms such as
GitHub and Gitlab can host Git repositories on a remote server that is
accessible anywhere, allowing code to be cloned on any machine to ease
development and collaboration between different developers.

**Vercel -- Content Delivery Network (CDN) for Frontend Deployments**

![](media/image14.png){width="6.492361111111111in"
height="3.6791666666666667in"}

[]{#_Toc216886234 .anchor}Figure 10: Screenshot of the Vercel homepage
(Vercel Inc., n.d.)

Vercel is a frontend content distribution (CDN) platform that provides
developer tools and cloud infrastructure to deploy frontend
applications. As the project already uses Next.js, the system will
greatly benefit from deploying the frontend to the Vercel platform,
simplifying the frontend deployment process and delivering them fast to
end users through a global edge network. Vercel supports automatic
builds for the frontend deployment by connecting the code repository
directly from GitHub. The proposed BECP system frontend will be deployed
on Vercel on the free Hobby plan, which is sufficient for prototypes and
personal projects for the time being.

# Chapter 3: Development and Data Gathering Methodology

## 3.1 System Development Methodology

### 3.1.1 Introduction

Now that the technical aspects of the proposed blockchain-based
extracurricular credentials platform (BECP) have been decided, it is
crucial to pair it with a solid development methodology to ensure the
development of the BECP stays organized and deliver a high-quality
minimum viable product (MVP) within the constraints of the final year
semester. The author plans to develop the BECP solo, making use of his
prior experience as a freelance developer and newfound knowledge
throughout his time studying in this degree. This poses a challenge in
staying organized and disciplined as an individual, as many agile
development methodologies out there are collaborative and team based.
Fortunately, these methodologies can be adapted for use in individual
projects as well. After consideration, there are 3 system development
methodologies that can be modified for solo development, which are
standard Agile, Extreme Programming (XP) and Lean Software Development.
The chosen methodology will be explained and justified for use in the
BECP development in the following sections.

### 3.1.2 Methodology Choice and Justification

For the development of the BECP system, the author has opted for the
**Extreme Programming (XP)** methodology. For a project that with
multiple components working together between front-facing user
interfaces and back-end smart contract interactions in a decentralized
blockchain, the XP methodology can deliver on these high technical
demands as opposed to other methodologies, as it places coding activity
first and foremost while still maintaining agility by keeping
stakeholders on the loop throughout the development process and
delivering essential requirements within the limited time constraints.

**Justification:**

XP is a coding-focused agile development methodology that revolves
around user stories, spike solutions and test-driven development. User
stories are written by stakeholders of the system in their own language
to describe exactly what they want the system to do for them. The user
stories are essential for developing the requirements of the system and
the test cases. Every technical hurdle is solved by developing spike
solutions, which are simple prototypes to explore the best
implementation of a particular feature to be integrated into the system.
To ensure utmost code quality and avoid any regressions, the code must
pass all the unit tests and user acceptance tests before they are ready
to be released. Unlike other popular methodologies like Scrum, XP limits
ceremonies and place importance on delivering working code to customers
to fuel continuous feedback and iterating further on small releases.

**Key Benefits of XP:**

-   **Highly Focused on Coding**: XP limits ceremonies and putting the
    most time and resources into producing high-quality code and
    delivering on stakeholder needs. At the end of the day, the only
    important result is the completion and flawless execution of the
    final product that brings real value to the end user.

-   **Test-Driven Development (TDD)**: XP puts emphasis on developing a
    comprehensive suite of test cases that delivers on the requirements
    of the project before writing any actual code. The test suite sets a
    definitive scope of what needs to be done for the project, and the
    completion of each test gives a clear sense of progression, all
    while minimizing bugs and errors in production.

-   **Open Feedback through User Stories**: XP maintains close
    collaboration with stakeholders by collecting user stories to define
    exactly what they need from the system. More user stories are
    collected between the iterations and small releases to ensure the
    system can evolve alongside changing requirements.

-   **Appeals to Developers**: A rather superficial benefit, but as
    described by Mark Janssen (2014), XP lets coders focus on what they
    love to do, coding and seeing their code work correctly with instant
    feedback. Returning the love for programming back to developers
    without the hassle of writing large design documentations allows
    them to perform at their best.

  --------------------------------------------------------------------------
  Aspect            XP                 Agile              Lean Software
                                                          Development
  ----------------- ------------------ ------------------ ------------------
  **Philosophy**    Deliver high       Maintain strong    Taking inspiration
                    quality code       customer           from lean
                    through            collaboration and  manufacturing to
                    test-driven        adaptability for   maximizing value
                    development,       iterative and      and eliminating
                    continuous         incremental        waste during
                    refactoring and    delivery.          development.
                    making frequent                       
                    small releases.                       

  **Structure**     Practice-driven    Framework-driven   Principle-driven
                    structure that     structures such as structure that
                    emphasizes coding  Scrum or Kanban    upholds lean
                    discipline and     which revolves     values throughout
                    rigorous technical around sprints and the development
                    development.       project backlogs.  process.

  **Planning**      Collect user       Sprint planning    Prioritize most
                    stories, estimate  and grooming       important features
                    project velocity   backlogs           to minimize waste
                    and develop a                         and delay
                    release plan for                      decisions until
                    implementation.                       necessary

  **Feedback        Bugs and issues    Sprint reviews and Continuous
  Loops**           from automated     retrospectives.    improvement
                    testing and user                      through reinforced
                    acceptance tests.                     learning and
                                                          self-reflection.

  **Strengths**     Result in high     Good organization  No rigid
                    code quality and   of progress makes  methodology
                    reliability        the project more   activities make
                    suitable for       manageable.        development more
                    critical systems.                     flexible and
                                                          efficient.

  **Weakness**      Not as             Ceremonies can be  Abstract
                    collaborative and  excessive for solo principles require
                    require high       development.       strong discipline
                    self-discipline to                    to apply
                    perform flows.                        correctly.
  --------------------------------------------------------------------------

  : []{#_Toc216886260 .anchor}Table 6: Questions and Objectives for the
  Survey Question

### 3.1.3 Activities and Processes

![](media/image15.png){width="6.492361111111111in"
height="2.4923611111111112in"}

[]{#_Toc216886235 .anchor}Figure 11: Extreme Programming Project Flow.
Adapted from (Wells, 2000).

**1. Collect User Stories**

+----------------+-----------------------------------------------------+
| **Activity**   | -   Collect user stories from stakeholders          |
|                |     (students, employers, university administrators |
|                |     and event organizers), which are small and      |
|                |     narrative descriptions of what they will do     |
|                |     when using the BECP system.                     |
|                |                                                     |
|                | -   Convert collected user stories into a set of    |
|                |     requirements with estimated time to implement   |
|                |     and acceptance tests to create the release      |
|                |     plan.                                           |
+================+=====================================================+
| **Processes**  | -   Approach stakeholders and ask them to describe  |
|                |     what the system needs to do for them. The       |
|                |     stakeholder will write the user stories in      |
|                |     their own words to reflect their understanding  |
|                |     and minimize technical jargon.                  |
|                |                                                     |
|                | -   The collected user stories are given an         |
|                |     estimate of time to implement. Estimated time   |
|                |     to implement is usually set to 1 or 2 weeks. If |
|                |     a user story takes more than 3 weeks, it must   |
|                |     be broken down further into several smaller     |
|                |     stories.                                        |
+----------------+-----------------------------------------------------+

: []{#_Ref216813131 .anchor}Table 7: Themes and actual responses to
feedback on feature ideas for the proposed BECP system

**Example:** For the BECP skill dashboard, ask university students what
they would like to see on the dashboard and what actions they want to do
based on the data displayed.

**2. Create Spike Solutions**

+----------------+-----------------------------------------------------+
| **Activity**   | -   For difficult technical implementations,        |
|                |     explore solutions by building small feature     |
|                |     prototypes.                                     |
|                |                                                     |
|                | -   Evolve system design to work with the spike     |
|                |     solution, while ensuring test cases are still   |
|                |     met without regressions.                        |
+================+=====================================================+
| **Processes**  | -   Create a separate development branch to start   |
|                |     working on a particular feature implementation  |
|                |                                                     |
|                | -   Explore solutions to implement the system,      |
|                |     finding the simplest solution that makes use of |
|                |     existing packages and only bring in new         |
|                |     dependencies when necessary                     |
|                |                                                     |
|                | -   Before merging with main branch, ensure the new |
|                |     implementation passes the test cases for the    |
|                |     new feature and prevent regressions on existing |
|                |     test cases.                                     |
+----------------+-----------------------------------------------------+

: []{#_Toc216886262 .anchor}Table 8: Themes and actual response to
feedback on disliked features to avoid for the proposed BECP system

**Example:** Create a separate development branch to experiment on the
skill dashboard, consider developing solutions using existing packages
or bring in new packages where necessary.

**3. Outline Release Plan**

+----------------+-----------------------------------------------------+
| **Activity**   | -   Prepare a release plan by defining project      |
|                |     velocity, which is the number of features that  |
|                |     can be implemented in a given date, creating a  |
|                |     strategic plan that fits in the development     |
|                |     time frame.                                     |
|                |                                                     |
|                | -   Based on the project velocity, prioritize on    |
|                |     the most important user stories to implement    |
|                |     between iterations.                             |
+================+=====================================================+
| **Processes**  | -   During release planning, organize the           |
|                |     individual user stories into a set of stories   |
|                |     that will be implemented together in the first  |
|                |     and consequent releases.                        |
|                |                                                     |
|                | -   Repeat the process between releases, adjust the |
|                |     plan and feature priority to new user stories   |
|                |     collected from feedback.                        |
+----------------+-----------------------------------------------------+

**Example:** Create a release plan to build the skill dashboard by
creating a set of user stories from users who will be using the
dashboard and prioritizing the features to be implemented that week.

**4. Perform Iterative Development**

+----------------+-----------------------------------------------------+
| **Activity**   | -   Prepare an iteration plan that compiles user    |
|                |     stories to be implemented from the release      |
|                |     plan, bug fixing from failed tests and          |
|                |     unfinished tasks from the previous iteration    |
|                |     cycle.                                          |
|                |                                                     |
|                | -   Communicate with stakeholders on progress as    |
|                |     the features are being implemented and collect  |
|                |     new user stories                                |
|                |                                                     |
|                | -   Deploy new features and bug fixes to the latest |
|                |     version release at the end of the iteration.    |
+================+=====================================================+
| **Processes**  | -   User stories are converted from customer simple |
|                |     language to developer technical language to     |
|                |     turn them into development tasks.               |
|                |                                                     |
|                | -   Choose which tasks that can be done each day.   |
|                |     Smaller tasks can be grouped together and       |
|                |     completed on the same day.                      |
|                |                                                     |
|                | -   Perform consistent unit tests and refactoring   |
|                |     to ensure project remains maintainable to       |
|                |     accept new implementation from user stories.    |
|                |                                                     |
|                | -   Stand-up meetings are replaced with             |
|                |     self-revaluation of tasks to suit solo          |
|                |     development workflow.                           |
|                |                                                     |
|                | -   At the end of the iteration, deploy new         |
|                |     features and bug fixes to the latest version    |
|                |     after passing 100% of the unit tests and        |
|                |     acceptance tests.                               |
+----------------+-----------------------------------------------------+

**Example:** Perform refactoring on the current system to properly
integrate the newly developed skill dashboard, continuously perform unit
tests to ensure the system passes existing and new test cases.

**5. Run Acceptance Tests**

+----------------+-----------------------------------------------------+
| **Activity**   | -   Develop acceptance tests from user stories,     |
|                |     which are black box tests aiming to test the    |
|                |     correctness of the feature at outputting the    |
|                |     result expected by the stakeholder.             |
|                |                                                     |
|                | -   Set user stories as completed once the          |
|                |     implemented feature passes the acceptance       |
|                |     tests.                                          |
+================+=====================================================+
| **Processes**  | -   Demonstrate new features to stakeholders and    |
|                |     compare them to the user story they have        |
|                |     written to gauge their acceptance.              |
+----------------+-----------------------------------------------------+

**Example:** When the skill dashboard has been implemented, show the
feature to stakeholders to run the acceptance test.

**6. Make Small Frequent Releases**

+----------------+-----------------------------------------------------+
| **Activity**   | -   Produce fully functioning software in the       |
|                |     iteration that can be released frequently, even |
|                |     if it is small, since priority of user stories  |
|                |     ensure most work is being done to serve         |
|                |     stakeholder needs.                              |
|                |                                                     |
|                | -   Collect valuable feedback between deployments   |
|                |     to ensure main issues are identified early and  |
|                |     more time can be allocated to fix them.         |
+================+=====================================================+
| **Processes**  | -   Push new feature implementation to the remote   |
|                |     codebase on GitHub to run deployment task       |
|                |     automatically on Vercel. Once the build process |
|                |     is complete, the latest version will be live on |
|                |     the website to be accessed by users             |
|                |     immediately.                                    |
+----------------+-----------------------------------------------------+

**Example:** The skill dashboard implementation will be pushed to the
main branch once it is completed to be deployed on Vercel for it to
appear on the website.

## 3.2 Data Gathering Design

### 3.2.1 Data Collection Method

To prove the discoveries from literature and better understand
stakeholder needs that will be addressed by the proposed BECP system, an
online survey has been conducted as the primary data collection method.
surveys provide a fast and cost-effective method of gathering feedback
and opinions of the target users of the system. Questions are structured
in the form of single-choice, multiple-choice, Likert scales and
open-ended questions to produce standardized results that can be
visualized using various charts for easy analysis. For this project, the
survey aims to learn more about students' barriers to ECA participation
and their perceived value of ECA participation, to find out whether the
current landscape of ECA participation aligns with existing literature.
Furthermore, the survey will also ask for students' opinions on
blockchain adoption and the proposed BECP platform, identifying
stakeholder acceptance and possible concerns that may come from the
system that needs to be meticulously addressed prior to implementation.

### 3.2.2 Comparison

  -----------------------------------------------------------------------
  Method                  Advantages              Disadvantages
  ----------------------- ----------------------- -----------------------
  Survey/Questionnaire    Collect large amounts   Limited contact with
                          of data on sentiments,  audience and possible
                          opinions and feedback   outliers and
                          from many people in a   low-quality responses,
                          short amount of time.   relies on careful
                                                  structuring of
                                                  questions to gain
                                                  useful data for
                                                  analysis.

  Interviews              Richer data and         Requires plenty of time
                          insights for            and resources to
                          understanding complex   conduct, also relies on
                          topics from experts.    good networking to find
                                                  potential candidates.
  -----------------------------------------------------------------------

After careful consideration of the data collection methods, given the
time constraints and limited resources at the author's disposal, surveys
proved to be the most viable option for this project, striking a
compromise between surface-level yet useful qualitative data while
minimizing time taken to obtain them. Nonetheless, to make the most of
the data collection, careful planning of the survey questions and
structure is required to ensure high quality data for analysis, which
will be described in detail now.

### 3.2.3 Survey Structure

  ------------------------------------------------------------------------
  Section                   Number of   Purpose
                            Questions   
  ------------------------- ----------- ----------------------------------
  Demographic Information   8           To identify the demographic
                                        profile of the participants of the
                                        survey, mainly by their age,
                                        gender, course of study, frequency
                                        of ECA participation and
                                        familiarity with blockchain
                                        technology.

  Extracurricular           12          To understand the possible
  Participation and Skill               barriers that prevent the
  Recognition                           participant from joining ECAs,
                                        their perceived outcomes from ECA
                                        and how well they recognize their
                                        skills.

  Opinions on Skill         10          To assess the participants
  Credentials, Blockchain               preferences for skill credentials
  Adoption and Feature                  to showcase their EC skills, how
  Priorities                            comfortable they are with adopting
                                        blockchain technology and what
                                        features they would like to see in
                                        the BECP system.
  ------------------------------------------------------------------------

Structuring a clear distinction between survey sections gives
respondents a clear expectation of what is being requested and gives a
graceful transition between familiar topics from the respondent's
personal experience with ECAs to more nuanced discussions about the
proposed BECP system aiming to help respondents with measuring skill
development when joining ECAs, ensuring respondents remain engaged with
answering the questions and allow them to prepare the right mindset
between each section.

### 3.2.4 Question Bank

  -----------------------------------------------------------------------
  Question                            Objective
  ----------------------------------- -----------------------------------
  Demographic Information             

  1\. What is your name? (Optional)   To identify the participant in case
                                      there is a need to contact them,
                                      but this will not be included in
                                      the respondence demographic
                                      profile.

  2\. What is your gender?            To understand if the perception of
                                      ECAs may differ between different
                                      genders.

  3\. What is your age group?         To analyze how different age groups
                                      may approach ECA participation,
                                      whether they continue to engage in
                                      ECAs as part of their life-long
                                      learning.

  4\. What is current occupation      To identify if respondents who have
  status?                             gone through employment have a
                                      different view on ECA
                                      participation, even if the main
                                      target of the survey is towards
                                      university students.

  5\. What university/college did you To understand how students from
  go to?                              different universities in Malaysia
                                      view ECAs to provide a richer
                                      nationwide perspective.

  6\. What is your current program    To learn if certain programs of
  and year of study?                  study may lack extracurricular
                                      opportunities by correlating with
                                      frequency of ECA participation.

  7\. In the last 12 months, how many To know how active university
  extracurricular activities have you students are at participating in
  joined?                             ECAs, despite possible barriers and
                                      commitments to their main study.

  8\. How familiar are you with       To understand the level of exposure
  blockchain technology?              students may have in blockchain
                                      technology, which may influence how
                                      the BECP is designed.

  Extracurricular Participation and   
  Skill Recognition                   

  9.1. I struggle to join activities  To prove whether the barriers to
  due to scheduling conflicts.        participation in ECAs correlate
  (Likert Scale 1-5)                  with existing literature and
                                      identify the most prevalent
                                      barriers that can be solved by the
                                      BECP system.

  9.2 Financial costs prevent me from 
  joining activities. (Likert Scale   
  1-5)                                

  9.3 I feel a low sense of belonging 
  in student communities. (Likert     
  Scale 1-5)                          

  9.4 Accessibility or support        
  facilities limit my participation.  
  (Likert Scale 1-5)                  

  9.5 I find it difficult to find     
  information about extracurricular   
  opportunities. (Likert Scale 1-5)   

  10.1 Extracurriculars helped me     To gauge whether university
  develop my teamwork, leadership and students feel that they are
  communication skills. (Likert Scale improving their core and technical
  1-5)                                skills by joining ECAs and whether
                                      it improves their outlook on
                                      employability.

  10.2 Extracurriculars helped me     
  develop technical skills relevant   
  to my career choice. (Likert Scale  
  1-5)                                

  10.3 Extracurriculars improved my   
  confidence in job applications.     
  (Likert Scale 1-5)                  

  10.4 Extracurriculars contributed   
  to my personal growth and           
  self-confidence. (Likert Scale 1-5) 

  11\. I have a clear way to showcase To measure students' confidence in
  extracurricular skills to           their existing skills.
  employers. (Likert Scale 1-5)       

  12\. What evidence do you currently To find out the current methods of
  provide to prove extracurricular    how students showcase their skills
  skills?                             and identify potential gaps and
                                      weaknesses.

  13\. What challenges do you face    To probe for concrete issues and
  when trying to showcase your        troubles students may face when
  extracurricular skills?             trying to prove their competencies.

  Opinions on skill credentials,      
  blockchain adoption and feature     
  priorities                          

  14.1. I would use certificates with To measure how the proposed main
  a verifiable link/QR code on my     features of the BECP system
  resume. (Likert Scale 1-5)          resonates with students to
                                      determine which features should be
                                      prioritized for development.

  14.2. It's important I control who  
  can view my credentials. (Likert    
  Scale 1-5)                          

  14.3. A skill dashboard showing my  
  current skills would motivate me to 
  join targeted activities. (Likert   
  Scale 1-5)                          

  14.4. I would like to access my     
  credentials and dashboard via a     
  mobile app. (Likert Scale 1-5)      

  15\. I trust blockchain-based       To find out whether students are
  certificates more than paper-based  comfortable in using blockchain
  ones. (Likert Scale 1-5)            technology for storing their
                                      certificates over traditional
                                      methods.

  16\. What would make you trust a    To understand what students are
  blockchain-based extracurricular    looking for if they are to trust
  certificate?                        digital forms of EC certificates.

  17\. What concerns do you have      To probe potential issues students
  about using blockchain for          may face that prevent them from
  certifications?                     using blockchain-based
                                      certificates.

  18\. Please rank the features you   To develop a priority list of the
  would most likely want to see in a  novel features to be implemented in
  blockchain-based skill credentials  the BECP system based on how useful
  platform                            it is to the students.

  19\. Are there any features you     To further ask students on feature
  most want in the skill credentials  ideas that they would like to have
  platform, if not included in the    but may not be included in the
  previous question?                  initial proposed BECP system.

  20\. Are there any features you     To identify which features that
  would avoid or distrust?            students may dislike to prevent
                                      them from being implemented in the
                                      BECP system.

  21\. Additional feedback, ideas or  To give participants opportunity to
  opinions                            provide any additional feedback on
                                      the survey, proposed system, or the
                                      research.
  -----------------------------------------------------------------------

## 

## 3.3 Data Analysis

The online survey has been conducted using Microsoft Forms, and a total
of 30 responses have been collected. An analysis of data collected from
the survey will be performed by visualizing the data into appropriate
graphs to gather insight into the demographic profile of the
respondents, their opinions on extracurricular activities, and potential
concerns and feedback that they have provided for the development of the
proposed BECP system. These insights will help garner a better
understanding of the extracurricular landscape among university students
and help improve any shortcomings in the initial development plan for
the BECP system.

### 3.3.1 Demographic Information

The demographics profile analysis will be conducted to understand the
relevant background information and characteristics of the volunteering
respondents in this survey. Based on the initial survey structure, the
survey has collected information on the respondents' gender, age group,
university, course and year of study, their frequency of ECA
participation and their familiarity with blockchain technology. Overall,
these characteristics may help shed some light into how ECA
participation may vary between students from their course of study and
universities across Malaysia, ultimately painting a more collective
nationwide view of ECA engagement to compare with conclusion from
literature. The familiarity with blockchain technology can help gauge
students' probability of accepting new technologies in their learning
and personal development, and how the BECP system may be designed to
better suit their level of understanding.

**Question 1: What is your name? (Optional)**

This question is included only to obtain a name that will be used to
address the respondent in the event where they need to be contacted in
the future. This information is not relevant to the study, and no
further analysis will be conducted on this question to maintain privacy
of respondents.

**Question 2: What is your gender?**

![](media/image16.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216732051 .anchor}Figure 12: Doughnut chart presenting the
gender composition among 30 survey respondents

Figure 11 shows the gender distribution among 30 total survey
respondents. 77% (23 respondents) of respondents are male, making it the
larger group of respondents followed by female with 23% (7 respondents).
There was an option for the respondents who would choose not to disclose
their gender, but no respondent has chosen it. The larger distribution
of male respondents may skew certain aspects of ECA participation or
blockchain familiarity, which may be taken into consideration further in
the analysis.

**Question 3: What is your age group?**

![](media/image17.png){width="6.009722222222222in"
height="4.009511154855643in"}

[]{#_Ref216732036 .anchor}Figure 13: Vertical bar chart presenting the
composition of age group among survey respondents

Figure 12 shows the age group distribution of 30 total respondents. 27
respondents are in the age group of 18 to 24 years old, making up the
largest group of respondents. 2 respondents are aged between 25 to 34
years old, and 1 respondent is 17 years old and below. This age
distribution shows that respondents are within the typical age of degree
university students, with some variation to include those who are
slightly older or are currently doing a diploma, which may give more
insight on ECA participation across various age groups.

**\
**

**Question 4: Which university/college did you go to?**

![](media/image18.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216732088 .anchor}Figure 14: Horizontal bar chart presenting the
composition of universities enrolled among survey respondents

As shown in Figure 13, the survey has collected responses from students
across several universities in Malaysia. Students in Asia Pacific
University (APU) make up the largest group at 25 respondents, and every
other university, which are Universiti Utara Malaysia, Universiti Sains
Islam Malaysia, Universiti Tenaga Nasional (UNITEN), International
Islamic University Malaysia and Forward College, are represented by one
respondent. Due to this distribution, the analysis will heavily skew
towards the landscape of ECA participation among APU students. Although
a single respondent may not reflect the larger ECA participation in
their respective universities, a fresh perspective is always valuable to
be included in the analysis, giving a glimpse of the ECA participation
across several universities in Malaysia.

**\
**

**Question 5: What is your current occupation status?**

![](media/image19.png){width="6.010416666666667in"
height="4.010416666666667in"}

[]{#_Ref216732121 .anchor}Figure 15: Pie chart showing the composition
of occupation among survey respondents

Figure 14 shows the distribution of occupation status among the 30
respondents. Indeed, 100% of respondents are students and are not
engaged in working on jobs at the time of this study. The purpose of
this question is to hopefully find a possible barrier to ECA
participation among students with additional commitments. Since all
respondents are students, the analysis will be geared towards
identifying requirements solely for university students. In the future,
perhaps the question can be worded better, such as explicitly mentioning
the specific commitments on top of studying to have a richer
distribution of students.

**\
**

**Question 6: What is your current program and year of study?**

![](media/image20.png){width="5.3in" height="3.5361909448818896in"}

[]{#_Ref216732232 .anchor}Figure 16: Doughnut chart showing the current
year of study distribution of survey respondents

![](media/image21.png){width="5.3in" height="3.558807961504812in"}

[]{#_Ref216732246 .anchor}Figure 17: Horizontal stacked bar chart
showing the current program of study of survey respondents, separated by
year of study

For this question, 2 figures have been generated, with Figure 15 showing
the distribution of year of study among the 30 respondents, and Figure
16 showing the current program of study among the 30 respondents,
separated by year of study. The survey managed to collect responses from
students across a wide variety of programs across industries. 17
respondents are studying BSc in Software Engineering, making up the
majority of respondents. Computer science students make up the second
largest group at 6 respondents, followed by Information Technology
(FinTech) with 2 respondents, and the rest of the programs, which are
Diploma in Accounting, BSc in Science Economics, Computer Science
(Systems and Networking), Accounting (Hons) and BA in Business
Management, are represented by 1 respondent. Having a large distribution
of study programs can help highlight opportunities in ECA participation
across industries and identify potential areas with shortages in ECA
demand. Moreover, it may also help determine the broader reach of
blockchain knowledge across seemingly uncharted territory.

**\
**

**Question 7: In the last 12 months, how many extracurricular activities
have you joined?**

![A graph of different colored bars AI-generated content may be
incorrect.](media/image22.png){width="5.4in" height="2.7in"}

[]{#_Ref216732266 .anchor}Figure 18: Vertical stacked bar chart showing
the frequency of ECA participation distribution of survey respondents,
separated by university

![](media/image23.png){width="5.4in" height="2.7030643044619422in"}

[]{#_Ref216732278 .anchor}Figure 19: Vertical stacked bar chart showing
the frequency of ECA participation distribution of survey respondents,
separated by program of study

![](media/image24.png){width="5.4in" height="3.6027220034995624in"}

[]{#_Ref216732367 .anchor}Figure 20: Vertical stacked bar chart showing
the frequency of ECA participation distribution of survey respondents,
separated by year of study

There are 3 figures created for analyzing the responses for this
question, Figure 17 shows the frequency of ECA participation in the last
12 months among 30 total respondents separated by university, Figure 18
shows the same frequency separated by program of study and Figure 19
shows the frequency separated by year of study. This is to discover
insights into the likelihood of ECA participation across different
universities for the broader nationwide ECA landscape, ECA demands
across study programs and circumstances of students throughout their
year of study, as students tend to get busier in their final year.

In Figure 17, most respondents have participated in 1 or 2 ECAs with 16
total respondents, with APU students making up the larger chunk at 14
respondents and 1 respondent from Universiti Sains Islam Malaysia and
Forward College each. The distribution tapers into a slope as the
participation frequency increases, with 6 respondents participating in 3
-- 4 ECAs, and 2 respondents with 5 -- 6 and even 7 or more activities.
4 respondents have not participated in any ECAs in the last 12 months,
which is on the lesser side but is aimed at being reduced to zero by the
proposed BECP system. In terms of nationwide ECA engagement by comparing
APU students and students from other universities, other university
students tend to have a relatively active amount of participation at 3
-- 4 ECAs. This may indicate that students in Malaysia are actively
engaged with ECAs, which is a positive outlook while still having plenty
of room to improve with the help of the BECP system. With a larger
sample size, it is predicted that the average ECA participation may form
a similar distribution to APU students.

In Figure 18, the analysis presents the distribution of ECA
participation across various programs of study. This distribution can
highlight how certain study programs can influence students' decisions
whether ECA participation is needed or not to hone their skills. From
the analysis, IT-related programs such as software engineering and
computer science tend to have a more active ECA landscape as reflected
by the higher ECA participation frequency, as the IT industry is
saturated with on-demand technical skills on the latest tools and
technologies, skills that may only be acquired outside of the standard
curriculum. Meanwhile, business-related programs such as accounting or
business management appear to have a less active ECA engagement. This
may be an opportunity to explore the skills that are most needed among
business students and how more ECA engagement can be increased to fill
these areas of shortage.

The analysis takes on a different perspective in terms of year of study
in Figure 19. The chart aims to identify a pattern of ECA participation
in terms of year of study to prove a possible barrier to participation
relating to scheduling and commitments. In this analysis, the majority
of Year 3 students at 15 respondents could only participate in 1 or 2
ECAs, implying a reflection to their heavier commitment to complete
their final year project. Year 2 students have a higher ECA engagement
with 4 out of 5 Year 2 students participating in a higher number of ECAs
than the average Year 3 student, implying that they have more time to
spare to engage in ECAs. The situation is not the same for Year 1
though, as they have a lower ECA engagement, with 2 respondents having
participated in less than 2 ECAs in the last 12 months. This is likely
due to them getting used to university life and possibility a connection
with the barrier relating to sense of belonging.

**Question 8: How familiar are you with blockchain technology and its
potential uses?**

![](media/image25.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216783140 .anchor}Figure 21: Horizontal bar chart showing the
distribution of familiarity with blockchain technology among survey
respondents

In this part of the demographic profile analysis, Figure 20 aims to
identify the general familiarity with blockchain technology among
respondents and the results are insightful. 10 respondents are
moderately familiar with blockchain technology, making the mean value
among respondents, followed by not familiar whatsoever with 9
respondents, slightly familiar with 8 respondents and 3 respondents are
very familiar with blockchain technology. In this chart, most
respondents belong in the lower half of familiarity with blockchain,
which shows that knowledge and exposure to blockchain is still
relatively new among university students. This may influence the overall
acceptance in using blockchain technology in their education. Moreover,
the design of the proposed BECP system should carefully consider people
who have no knowledge of blockchain technology to not overwhelm them
with technical jargon in the user experience.

### 3.3.2 Extracurricular Participation and Skill Recognition

The data analysis will continue for the next section of the survey to
further explore insights into the barriers to participation among
university students and how students perceive the value of ECAs to their
personal development and employability. The questions in this section
are mostly composed of Likert scale questions that gauge respondents'
agreement to a particular statement, making it a useful tool for
analyzing sentiments and feelings in certain scenarios. Performing this
analysis will reinforce or possibly refute existing literature regarding
claims on barriers to participation and perceived value of ECAs,
highlighting the main barriers to participation which must be overcome
by the proposed BECP system.

**\
Question 9.1 -- 9.5: Barriers that prevent you from participating in
extracurricular activities.**

![](media/image26.png){width="6.5in" height="3.254861111111111in"}

[]{#_Ref216789502 .anchor}Figure 22: Horizontal stacked bar chart
showing the Likert scale of statements relating to barriers to
participating in ECAs

The analysis for the barriers to participating in ECAs is presented by
Figure 21, each barrier is represented by a statement to which
respondents choose whether they agree with the statement or not on the
Likert scale. Based on the results, respondents are inclined to agree
that scheduling conflicts and lack of information about ECA
opportunities are the main barriers to participating in ECAs. Some
respondents show some strong disagreements on financial costs and
accessibility hurdles in ECAs as barriers, which implies that current
ECAs are relatively cost-effective with student's personal income and
accessibility may not be relevant to the overall respondent demographic.
Respondents are relatively neutral with their sense of belonging when
participating in ECAs, as students may either be strategic in their ECA
participation to join the ones they could fit in easily, or are rather
doubtful in participating due to anxiety of experiencing new things or
meeting new people. In response to this analysis, the proposed BECP
system must align user experience with students' strategies and
expectations to ensure ECA participation can align with their schedule
and put more effort to expose students with more information on ECA
opportunities.

**Question 10.1 -- 10.4: Perceived outcomes of extracurricular activity
participation**

![](media/image27.png){width="6.5in" height="3.254861111111111in"}

[]{#_Ref216791237 .anchor}Figure 23: Horizontal stacked bar chart
showing the Likert scale of statements relating to perceived outcomes of
ECA participation

Figure 22 presents the sentiment of 30 respondents on statements that
regarding the outcomes of ECA participation in their personal
development and employability prospects. Undoubtedly, most respondents
collectively agree that participating in ECAs have contributed to their
personal growth and self-confidence, building necessary core teamwork,
leadership and communication skills, and specific technical skills that
are relevant to their career of choice. While the sentiment remains
largely in agreement, some respondents are less confident in ECAs
contribution when applying for jobs. These sentiments highlight
students' clear understanding of the importance and value of ECAs for
which the proposed BECP system will capitalize on and presents an
opportunity for the system to make ECA participation shine brighter as
essential proof of competencies when applying for jobs.

**Question 11: How well skills are recognized**

![](media/image28.png){width="6.5in" height="3.254861111111111in"}

[]{#_Ref216792156 .anchor}Figure 24: Horizontal stacked bar chart
showing the Likert scale of how well skills are recognized

Following the analysis on perceived value of ECAs, Figure 23 shows the
level of agreement among the 30 respondents at how well they can
showcase the outcomes of their ECA participation. When being presented
whether they have a clear way to showcase extracurricular skills to
employers, respondents are slightly inclined to agree, but many
respondents remain neutral with the statement. For most students, they
indeed present their ECA participation in their application but remain
largely unclear whether they help with their qualifications. This
analysis aligns with the opportunity of better representing the outcomes
of ECA participation in resumes that the proposed BECP system aims to
primarily address.

**\
**

**Question 12: What evidence do you currently provide to prove
extracurricular skills?**

![](media/image29.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216793042 .anchor}Figure 25: Horizontal bar chart presenting the
methods of showcasing extracurricular skills in percentage of survey
respondents

Figure 24 dives deeper into understanding the methods used by the 30
total respondents to showcase their extracurricular skills. Most
respondents at 76.7% (23 respondents) showcase their extracurricular
skills by showing their certificates from participating in the event.
Half of the respondents have created project samples to present their
technical skills. 40% of respondents (12 respondents) have prepared
portfolios to better present their ECA participation and their outcomes
in their own words. 23.3% of respondents (7 respondents) have made use
of references from influential people to vouch for their extracurricular
outcomes. Since most students are already familiar with certificates as
a means of showcasing their ECA participation, the blockchain-based
certificates that will be developed in the proposed BECP system will
feel more of an extension to their existing flow. The proposed system
will help students represent the skills they have developed from ECA
participation with better verifiability, so students no longer need to
spend time convincing employers and focus on developing themselves
further.

**Question 13: What challenges do you face when trying to showcase your
extracurricular skills?**

![](media/image30.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216794332 .anchor}Figure 26: Horizontal bar chart presenting the
challenges when showcasing extracurricular skills faced by percentages
of survey respondents

Further on showcasing extracurricular skills, the survey now directly
addresses any challenges the respondents encounter when showcasing
extracurricular skills, as shown in Figure 25. Most respondents at 60%
(18 respondents) agree that the lack of formal recognition of ECAs
reduces their helpfulness in verifying their competencies. 46.7% of
respondents (14 respondents) expressed trouble in explaining their
skills to convince employers what they can do. 20% of respondents (6
respondents) face challenges showcasing their skills due to the employer
not understanding its outcomes for the company. These challenges present
the need to unify the recognition of ECA participation and verification
across students, universities and employers. The proposed BECP system
should help students better showcase their skills based on the
blockchain-based certificates they have collected to address the
challenge of explaining skills. Moreover, the outcomes should be
explained to employers in terms of benefits to the company, ensuring
employers understand the importance of certain skills and find the right
candidates for the job.

### 3.3.3 Opinions on skill credentials, blockchain adoption and feature priorities

The last section of the analysis now shifts attention to the
respondents' feedback and sentiment on the development of the proposed
BECP system itself. At the start of the section, respondents were given
a brief overview of what the BECP system aims to achieve and how it uses
blockchain technology to help students measure their skill development
in a more verifiable manner. Respondents were then asked for their
opinion on the features to be implemented on the system, their
willingness to adopt blockchain in their learning and possible concerns
that need to be considered by the system. This analysis will greatly
influence the course of development for the BECP system, identifying
which existing and potentially new features to prioritize and what
pitfalls that may need to be aware of to prevent resistance to adoption
among stakeholders.

**Question 14.1 -- 14.4: Your preferences on skill credentials**

![](media/image31.png){width="6.5in" height="2.6034722222222224in"}

[]{#_Ref216810120 .anchor}Figure 27: Horizontal stacked bar chart
showing the Likert scale of statements relating to preferences on skill
credentials

Figure 26 presents a set of Likert scale statements on preferences to
skill credentials in terms of usability features, privacy and
accessibility. According to the results, most respondents agree on
attaching a link or QR code in their resume to validate their
credentials on the blockchain directly from the resume. They also
collectively agree that skill credentials should only be visible to
parties that have been granted permission to view them, ensuring
students always maintain their privacy. Most respondents also respond
positively to the skill dashboard feature which shows the students'
current skills to motivate them to improve on the ones they are lacking,
except for a single outlier who mentioned explicitly that they had no
interest in ECA engagement. Accessibility of the system is also a must
have, as most respondents agree to have the system accessible from a
mobile application.

**Question 15: Readiness in adopting blockchain technology**

![](media/image32.png){width="6.495833333333334in"
height="3.252083333333333in"}

[]{#_Ref216810847 .anchor}Figure 28: Horizontal stacked bar chart
showing the Likert scale of the statement relating to readiness in
adopting blockchain technology

This next analysis in Figure 27 explicitly asks the respondents whether
they would agree on trusting blockchain-backed certificated more than
traditional paper-based certificates. Most respondents are inclined to
agree with the statement, showing students' willingness to adopt new
technologies that would benefit their personal skill development and
employability while maintaining privacy and data protection, despite
their familiarity with blockchain technology from the demographics
profile analysis.

**Question 16: What would make you trust a blockchain-based
extracurricular certificate?**

![](media/image33.png){width="6.009722222222222in"
height="4.009722222222222in"}

[]{#_Ref216811715 .anchor}Figure 29: Horizontal bar chart showing the
percentage of respondents selecting trust factors for a blockchain-based
certificate

The analysis in Figure 28 dives deeper into the factors that would make
the respondents more inclined to trust a blockchain-based certificate.
70% of respondents (21 respondents) have selected transparency of
information, as being able to see the source of the certificate can help
identify fraudulent certificates. Security features were selected by
56.7% of respondents (17 respondents). Blockchain immutability ensures
higher security of data, which respondents see as way to better trust
blockchain-based certificates. Lastly, 43.4% of respondents (13
respondents) have chosen reputation of the certificate issuer can
influence the trustworthiness of the certificate. By attaching
additional metadata on the event organizer, the validity of the
certificate can be traced back to the reputation of the issuer. This
analysis helps reinforce the previous analysis on blockchain adoption
and highlights the need for blockchain-based implementation instead of a
conventional software system.

**Question 17: Please rank the features you would most likely want to
see in a blockchain-based skill credentials platform**

![](media/image34.png){width="6.49375in" height="3.2534722222222223in"}

[]{#_Ref216813775 .anchor}Figure 30: Radial chart showing the ranking of
features for the BECP system

In Figure 29, a radial chart is created to visualize the priorities of
feature implementation based on the average rankings provided by
respondents. In descending order of priority, the main features to be
implemented are skill verification via links and QR codes, skill
dashboard overview, automatic resume generator from collected ECA
credentials, activity recommendations and a gamified skill development
experience. As it turns out, students prioritize function over form and
ranked the features that matter the most to their personal skill
development and verification, while fancy features such as gamification
should only be implemented when the core features have been developed.
This analysis helps align implementation with the actual needs of the
stakeholders to ensure the BECP system brings actual benefit to its
users.

**Question 18: Are there any features you most want in the skill
credentials platform, if not included in the previous question?**

  -----------------------------------------------------------------------
  Theme                            Actual response
  -------------------------------- --------------------------------------
  Access control / permissions for "Ability to grant or revoke access to
  certificate viewing              view my certificates to employers"

  Industry role matching / career  "Shows us what role in the industry
  recommendations                  would suit based on our certificate,
                                   skills, resume and achievements."

  Skill points-based system for    "Have a skill-point based system"
  gamification                     

  NFC-based certificate sharing    "NFC to share your profile / resume,
                                   so we can touch our phone physically
                                   to transfer the resume. Can refer to
                                   something like card3"

  Credential summary section /     "A section of the webpage that
  profile overview                 summarizes your skill credentials and
                                   achievements"

  Guidance on extracurriculars /   "Tips on how to navigate
  navigation tips                  extracurricular activities"

  Skill progress tracking &        "I would like a feature that allows me
  personalized insights            to track my skill-progress over time
                                   with personalized insights and
                                   suggestions. A simple dashboard that
                                   shows what skills I am improving, what
                                   skills I should focus on next, and
                                   recommended learning resources or
                                   micro-courses based on my career goals
                                   would be very helpful"
  -----------------------------------------------------------------------

The last few questions in the survey are open-ended questions to give
respondents the opportunity to share their feature ideas that were
otherwise not included in the initial planning of the proposed BECP
system. In this analysis, actual responses from respondents are compiled
and organized into main themes on feature suggestions, as described in
Table 6. Some requested features are already being planned for the BECP
system, such as access control for certificate viewing, industry role
matching/career recommendations and summary of skill credentials. For
the gamification feature, the respondent would like to see a
points-based system to measure their level of skill progression.
Respondents have also suggested new ways of sharing credential
information using Near Field Communication (NFC) that is common in most
smartphones, making the sharing process faster and more intuitive. For a
more user-friendly experience, the system may be equipped with guidance
and tutorials on navigating ECAs, so users know what to expect when
participating in them. Lastly, respondents have requested skill progress
tracking and personalized insights, which can be implemented using the
AI-based personalized training plan.

**Question 19: Are there any features you would avoid or distrust?**

  -----------------------------------------------------------------------
  Theme                                  Actual response
  -------------------------------------- --------------------------------
  Privacy / Personal Information         "I would avoid any feature that
                                         collects unnecessary personal
                                         information or shares my
                                         credentials without my clear
                                         permission. I would also
                                         distrust features that make the
                                         platform too complex to use,
                                         such as overly technical
                                         blockchain controls or anything
                                         that exposes my data publicly
                                         without strong privacy
                                         settings."

  Ads                                    "Ads"
  -----------------------------------------------------------------------

In this open-ended question, the survey asks for features that
respondents would dislike having in the BECP system. This is to identify
annoying features that respondents may experience with alternative skill
development platforms and do not wish to have to deal with in the BECP
system. There are two main themes collected from the analysis of
responses, which are sharing of personal information and advertisement.
It is crucial to ensure that personal information remains private in the
user's own local device and never stored on the blockchain where it will
be left transparent and immutable forever. When data is being handled by
the system, it should be clear what functions are available to the user
to manage them easily. One respondent made an explicit mention of
advertisements as a disliked feature in the system. The scope of this
project will only focus on implementing the prototype and will not
consider any monetization mechanisms for the time being.

### 3.3.4 Survey Summary

The data analysis of the survey results has proven to be productive and
insightful to the development of the proposed BECP system. The findings
garnered from this survey analysis can be summarized as follows:

**Barriers to participating in ECAs among university students:**

The results of this survey analysis align with existing literature.
University students struggle to participate in ECAs due to difficulty
scheduling their time alongside the standard curriculum, signaling the
need for proper integration of ECAs with university goals and objectives
for students. Moreover, some students do not realize that there are
plenty of opportunities for ECA participation but were not aware of them
due to lack of information. Given the limited sample size and unique
culture in Malaysia, financial and accessibility barriers are not so
commonplace as compared to literature. In short, to increase ECA
engagement among university students, the BECP system should integrate
with university systems and present opportunities for students to
participate in ECAs based on their current program and career goals.

**Struggles with showcasing skills developed from ECAs:**

The survey has highlighted shortcomings in traditional methods of
showcasing ECAs. Currently, ECA participation is simply described as a
line in students' resumes with no additional context to how it
contributes to their competencies to the employers. As such, if the
student does not go the extra mile to convey their skills through
project samples or personal portfolios, the perceived value of ECAs will
not translate well into beneficial outcomes to the student. The BECP
system aims to address this fundamental issue by automating the
verification process and instilling metadata in the credentials that
perfectly describe what the student has done during the ECA and the
skills they have developed, bringing more confidence to employers while
being backed with proof on the blockchain.

**University students have shown interest in a blockchain-based
certification system:**

The survey respondents comprised mostly of university students have
shown positive interest in adopting such a system as they understand the
value of ECAs for their employability in the future. Their eagerness is
shown in their engagement in providing ideas for features and concerns
that they have with the system, implying that they would like to use the
system if it were to be implemented. This highlights a real demand for
the implementation of the BECP system. In summary, the project will
continue to be developed with confidence that it will bring beneficial
outcomes and innovation to the education industry.

###  

# Chapter 4: Conclusion

This investigation report aims to conduct thorough research on the
implementation of a blockchain-based extracurricular credentials
platform (BECP) to help university students measure their skill
development as they participate in extracurricular activities (ECA) by
utilizing blockchain-based micro-credentials to prove students' core and
technical skills in a more verifiable and transparent manner to
employers with strong integration with existing university and
recruitment management systems.

The contents of the report include an extensive literature review on the
current landscape of ECAs in universities and how students perceive the
value of ECAs for their personal development and employability. The
literature review explores how blockchain is currently being implemented
in education systems around the world and the best way to approach the
process of verifying skills in a more quantifiable manner using
micro-credentials. Next, the report provides a detailed technical
analysis on the tools and frameworks that will be used to implement the
BECP system, considering the various components of the overall system
architecture to ensure the implementation is feasible with existing
technologies at the author's disposal. The technical analysis is paired
with the Extreme Programming (XP) development methodology that provides
a solid framework for developing the BECP system that heavily depends on
high code quality and critical execution across blockchain smart
contracts and front-facing interfaces. To assess the claims of existing
literature and user sentiment on the proposed BECP system, an online
survey has been conducted with a total of 30 responses collected,
containing useful insights into the ECA landscape among students in
various universities in Malaysia and additional feedback and suggestions
to further improve on the BECP system.

The report has identified a crucial need among university students to
better present the skills and competencies from participating in ECAs to
recruiters and employers once they graduate and begin applying for jobs.
Literature has shown a direct correlation between ECA participation and
improved outlook on employability through development of essential
employability skills and building students' professional identity.
Students also highly understand the important value of ECAs to their
personal development and building the right skills for their career of
choice, as supported by literature and survey analysis. However,
students expressed challenges in realizing the benefits of ECAs when it
comes to showcasing them to employers due to difficulty in explaining
skills and lack of formal recognition. The proposed BECP system aims to
tackle these challenges head-on by implementing a solution that
automates these processes and helps students present their
extracurricular skills better with comprehensive skill metadata in their
credentials and easy verifiability through links that lead to their
immutable proof on the blockchain.

The BECP system features a powerful combination of blockchain and AI
technologies to deliver a secure, transparent and personalized skill
development platform. From the findings in the technical analysis,
blockchain and AI go hand in hand as the immutable properties of
blockchain lead to a much higher data integrity previously unachievable
in comparison to conventional centralized databases, resulting in a more
robust training data for better AI performance and accuracy. The BECP
system makes use of AI technologies to automate various validation
processes for certificate issuance, infer the skills that can be gained
from ECA events through the event descriptions and help students develop
their own personal skill development plan, matching them with events
that best align with the skills necessary for their career goals.

The investigation report marks a significant first milestone in the long
and arduous final year project. Indeed, enough investigation and
research has been conducted for the successful implementation of the
proposed BECP system. The next steps in this journey will include a
thorough revision of the initial system architecture and requirements of
the proposed BECP system, carefully considering the feedback from the
survey analysis and newfound insights from this investigation report.
The development of the BECP will commence in accordance with the XP
methodology project flow until a satisfactory minimum viable product
(MVP) has been created.

# References

Ali, Q. I. (2024). Enhancing ABET Summative Direct Assessment with AI
and Blockchain: A Framework for Personalized Learning and Secure
Evaluation. *International Journal of Algorithms Design and Analysis
Review*, *2*(1), 28-41p.
<https://www.researchgate.net/publication/382861957_Enhancing_ABET_Summative_Direct_Assessment_with_AI_and_Blockchain_A_Framework_for_Personalized_Learning_and_Secure_Evaluation>

Disruptr MY. (2023, September 26). Unilah: The University Super App For
Students - Disruptr
MY. [*https://www.disruptr.com.my/unilah-the-university-super-app-for-students/*](https://www.disruptr.com.my/unilah-the-university-super-app-for-students/)

*Exploring student participation and engagement in university
extracurricular activities*. (2025, October 20). The Edge Malaysia.
<https://theedgemalaysia.com/node/772169>

Jackson, D., Lambert, C., Sibson, R., Bridgstock, R., & Tofa, M. (2024).
Student employability-building activities: participation and
contribution to graduate outcomes. *Higher Education Research &
Development*, *43*(6), 1308--1324.
<https://doi.org/10.1080/07294360.2024.2325154>

Kan, F. (2025, October 22). From IG Page to Gen Z-powered Startup.
*National University of Singapore Office of Alumni Relations.*
<https://alumni.nus.edu.sg/thealumnus/2025/10/22/from-ig-page-to-gen-z-powered-startup/>

McGreal, R. (2023). Blockchain and Micro-Credentials in
Education. *International Journal of E-Learning & Distance
Education*, *38*(1), n1. <https://eric.ed.gov/?id=EJ1409239>

Nguyen, T. T. ., Nguyen, L. T. H. ., Duong, T. T. ., Trinh, C. V. ., &
Bui, L. T. . (2025). Evaluating extracurricular educational activities:
Perspectives from management staff and students. *International Journal
of Innovative Research and Scientific Studies*, *8*(2), 3643--3651.
<https://doi.org/10.53894/ijirss.v8i2.6068>

Optimism Foundation. (n. d.). OP Stack -- Optimism.
<https://www.optimism.io/op-stack>

Pinata. (n. d.). Pinata \| Crypto's file storage.
<https://pinata.cloud/>

Rodriguez, J. M. P., Austria, G. S., & Millar, G. B. (2025). The Role of
AI, Blockchain, Cloud, and Data (ABCD) in Enhancing Learning Assessments
of College Students. *arXiv preprint arXiv:2503.05722*.
<https://arxiv.org/abs/2503.05722>

Rustemi, A., Dalipi, F., Atanasovski, V., & Risteski, A. (2023). A
Systematic Literature Review on Blockchain-Based Systems for Academic
Certificate Verification. *IEEE Access*, *11*, 64679--64696.
<https://doi.org/10.1109/access.2023.3289598>

Sharani, V., Agrawal, A., & Krithika, J. (2023). UNDERSTANDING THE
PROCESS OF SELECTION AND RECRUITMENT IN VARIOUS ORGANIZATIONS.
<https://www.researchgate.net/publication/377082585_UNDERSTANDING_THE_PROCESS_OF_SELECTION_AND_RECRUITMENT_IN_VARIOUS_ORGANIZATIONS>

Silaghi, D. L., & Popescu, D. E. (2025). A Systematic Review of
Blockchain-Based Initiatives in Comparison to Best Practices Used in
Higher Education Institutions. Computers, 14(4), 141.
<https://doi.org/10.3390/computers14040141>

Thompson, L. J., Clark, G., Walker, M., & Whyatt, J. D. (2013). 'It's
just like an extra string to your bow': Exploring higher education
students' perceptions and experiences of extracurricular activity and
employability. Active Learning in Higher Education, 14(2), 135--147.
<https://doi.org/10.1177/1469787413481129>

Vercel Inc. (n. d.). Vercel: Build and deploy the best web experiences
on the AI Cloud. <https://vercel.com/home>

Vercel Inc. (n. d.). Next.js by Vercel -- The React Framework
<https://nextjs.org/>

Wells, D. (2000). *Extreme programming rules*.
<http://www.extremeprogramming.org/rules.html>

Zed Industries. (n. d.). Zed -- Love your editor again.
<https://zed.dev/>

# Appendix A: PPF -Title Registration Proposal

![](media/image35.png){width="6.132075678040245in"
height="7.9416491688538935in"}

![](media/image36.png){width="6.13in" height="7.938959973753281in"}

![](media/image37.png){width="6.13in" height="7.938959973753281in"}

![](media/image38.png){width="6.13in" height="7.938959973753281in"}

![](media/image39.png){width="6.13in" height="7.938959973753281in"}\
![A close-up of a letter AI-generated content may be
incorrect.](media/image40.png){width="6.13in"
height="7.938959973753281in"}

![A close-up of a document AI-generated content may be
incorrect.](media/image41.png){width="6.13in"
height="7.938959973753281in"}

![](media/image42.png){width="6.13in" height="7.938959973753281in"}

![](media/image43.png){width="6.13in" height="7.938959973753281in"}

![](media/image44.png){width="6.13in" height="7.938959973753281in"}

![](media/image45.png){width="6.13in" height="7.938959973753281in"}

![](media/image46.png){width="6.13in" height="7.938959973753281in"}

![](media/image47.png){width="6.13in" height="7.938959973753281in"}

# Appendix B: Ethics Form (Fast-Track)

![](media/image48.png){width="5.617930883639545in"
height="7.943396762904637in"}

![](media/image49.png){width="5.62in" height="7.946321084864392in"}

![](media/image50.png){width="5.62in" height="7.946321084864392in"}

![](media/image51.png){width="5.62in" height="7.946321084864392in"}

# Appendix C: Meeting Log Sheets

![A close-up of a document AI-generated content may be
incorrect.](media/image52.png){width="6.150942694663167in"
height="7.966082677165354in"}

![](media/image53.png){width="6.159932195975503in"
height="7.971675415573054in"}![](media/image54.png){width="6.159932195975503in"
height="7.971675415573054in"}

# Appendix D: Gantt Chart

![](media/image55.png){width="5.513641732283465in"
height="7.792452974628172in"}

#  Appendix E: Respondence Demographic Profile

  ------------------------------------------------------------------------------------
  No.   Gender   Age     University      Program and    Number of ECAs Familiarity
                 Group                   Year of Study  participated   with Blockchain
  ----- -------- ------- --------------- -------------- -------------- ---------------
  1     Male     18-24   Asia Pacific    BSc in         1-2            Moderately
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  2     Male     18-24   Asia Pacific    BSc in         5-6            Very familiar
                         University      Software                      
                                         Engineering,                  
                                         Year 3                        

  3     Male     18-24   Asia Pacific    BSc in         1-2            Slightly
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  4     Male     18-24   International   BSc in         3-4            Not at all
                         Islamic         Computer                      familiar
                         University      Science, Year                 
                         Malaysia        2                             

  5     Male     18-24   UNITEN          BSc in         3-4            Not at all
                                         Computer                      familiar
                                         Science                       
                                         (Systems and                  
                                         Networking),                  
                                         Year 2                        

  6     Male     18-24   Asia Pacific    BSc in         5-6            Very familiar
                         University      Software                      
                                         Engineering,                  
                                         Year 3                        

  7     Male     18-24   Asia Pacific    BSc in         3-4            Moderately
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  8     Female   18-24   Asia Pacific    BSc in         7 or more      Not at all
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  9     Male     18-24   Asia Pacific    BSc in         1-2            Slightly
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  10    Male     18-24   Asia Pacific    BSc in         1-2            Not at all
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  11    Male     25-34   Universiti      BSc in         1-2            Moderately
                         Sains Islam     Accounting                    familiar
                         Malaysia        (Hons)                        

  12    Female   18-24   Asia Pacific    BSc in         7 or more      Moderately
                         University      Computer                      familiar
                                         Science                       

  13    Male     18-24   Asia Pacific    BSc in         1-2            Slightly
                         University      Computer                      familiar
                                         Science Year 3                

  14    Male     18-24   Asia Pacific    BSc in IT      1-2            Slightly
                         University      (FinTech),                    familiar
                                         Year 3                        

  15    Male     18-24   Asia Pacific    BSc in IT      1-2            Slightly
                         University      (FinTech),                    familiar
                                         Year 3                        

  16    Male     18-24   Asia Pacific    BSc in         1-2            Moderately
                         University      Computer                      familiar
                                         Science, Year                 
                                         3                             

  17    Male     18-24   Asia Pacific    BSc in         None           Moderately
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  18    Male     18-24   Asia Pacific    BSc in         1-2            Moderately
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  19    Male     18-24   Asia Pacific    BSc in         1-2            Slightly
                         University      Computer                      familiar
                                         Science                       
                                         (General)                     

  20    Female   18-24   Asia Pacific    BSc in         1-2            Moderately
                         University      Computer                      familiar
                                         Science, Year                 
                                         3                             

  21    Male     18-24   Universiti      BSc in Science 3-4            Moderately
                         Utara Malaysia  Economics,                    familiar
                                         Year 2                        

  22    Male     18-24   Asia Pacific    BSc in         1-2            Slightly
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  23    Male     18-24   Forward College BSc in         1-2            Not at all
                                         Software                      familiar
                                         Engineering                   
                                         Year 3                        

  24    Female   18-24   Asia Pacific    BSc in         None           Slightly
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  25    Female   17 and  Asia Pacific    Diploma in     None           Not at all
                 below   University      Accounting,                   familiar
                                         Year 1                        

  26    Male     18-24   Asia Pacific    BSc in         1-2            Not at all
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  27    Female   18-24   Asia Pacific    BSc in         1-2            Not at all
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  28    Male     18-24   Asia Pacific    BSc in         3-4            Very familiar
                         University      Software                      
                                         Engineering,                  
                                         Year 3                        

  29    Male     25-34   Asia Pacific    BSc in         3-4            Moderately
                         University      Software                      familiar
                                         Engineering,                  
                                         Year 3                        

  30    Female   18-24   Asia Pacific    BA in Business None           Not at all
                         University      Management,                   familiar
                                         Year 2                        
  ------------------------------------------------------------------------------------
