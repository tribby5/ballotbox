# Ballot Box — Product Design Specification

## Overview

**Ballot Box** is a web-based voting application with a mobile-friendly design.

Users can:
1. Create new votes
2. Share a link for others to participate
3. View voting results

There is **no authentication system** in the initial version. Votes can optionally be protected with a password/code for management and results access.

### Key Differentiator

Ballot Box emphasizes both **functionality and education**:
- Users can choose from multiple voting methods (with a focus on ranked-choice systems)
- A dedicated education page explains each method, including how it works and its tradeoffs

> Note: Preventing double voting or verifying voter identity is **out of scope for now**.

---

## Core Screens

### 1. Home Screen

Users can:
- Create a new vote
- Enter a vote ID to:
  - Manage an existing vote
  - Participate in a vote
- Navigate to the **Voting Methods Education** page

---

### 2. Vote Management Page

#### Before Finalization

A setup form where users define the vote:

- **Title** (required)
- **Options**:
  - Free-text list (2–30 items required)
- **Voting Method**:
  - Default: Ranked Pairs
  - Includes an info icon linking to the education page
- **Password (optional)**:
  - Used to manage/edit the vote and control results access

After setup:
- User finalizes the vote
- A shareable link is generated and easily copyable

---

#### After Creation (Before Any Responses)

- User can return and edit the vote
- Page becomes password-protected (if configured)
- Vote remains editable until the first response is submitted

---

#### After First Response

- Vote is no longer editable
- User can:
  - View the vote
  - Access a results link (live updates)
  - Copy and share the results link

**Results access behavior:**
- If no password: voters receive results link after submitting
- If password-protected: only the creator has access

---

### 3. Voter Page

Displays:
- Vote title
- List of options

#### Voting Modes

1. **Drag-and-Drop (Default)**
   - Users reorder options by preference
   - Includes visual drag handles

2. **Numeric Input**
   - Static list
   - Users assign rankings via input fields
   - Requires validation (e.g., no duplicates, valid ranges)

#### Submission

- User submits their vote
- Post-submit behavior:
  - If results are public: user receives results link
  - If protected: user sees a message indicating the creator controls access

---

### 4. Results Page

Displays:
- Vote title
- **Winner (prominently displayed)**

Additional details (collapsible):
- Full ranking
- Vote breakdown
- Explanation of how the winner was calculated (varies by method)

Optional:
- Simple charts/diagrams for visualization

---

### 5. Voting Methods Education Page

A content-heavy page explaining voting systems.

#### Content Structure

- Introduction to ranked-choice voting
- Individual sections for each method:
  - Explanation
  - Step-by-step calculation
  - Pros and cons
  - Visual diagrams
  - Links to external resources

#### Comparison Section

Summarizes methods using key criteria:
- Universality
- Monotonicity
- Condorcet Criterion
- Independence of Irrelevant Alternatives

#### Supported Voting Methods

- Single Vote Plurality
- Instant Runoff Voting (IRV)
- Borda Count
- Instant Runoff Borda Count
- Least Worst Defeat
- Ranked Pairs

---

## Design & Style Guidelines

### Visual Style

- Clean, minimalist UI
- Soft shadows and subtle elevation
- Calm, trustworthy aesthetic
- Blend of institutional clarity and human warmth

### Typography

- **Headings/Titles**: Humanist serif font
- **Body Text**: Inter (sans-serif)
- “Ballot Box” logo in serif font (top-left)

### Layout & Components

- 8px spacing system
- Rounded corners (8–12px)
- Card-based layout for grouping content
- Clear, prominent call-to-action buttons
- Simple, intuitive navigation

### Icons

- Minimal and consistent icon set
- Use sparingly for clarity (e.g., info tooltips)

---

## Color System

- Muted overall palette
- Primary accent: muted dark green
- Subtle secondary colors
- Light mode: #4CB179 for buttons, links, and the Ballot Box title; #CBE7D8 as a subtle secondary accent
- Dark mode: #5DBA87 for buttons, links, and the Ballot Box title; #005231 as a secondary accent


### Modes

- **Light Mode**:
  - White and light gray base
- **Dark Mode**:
  - Near-black background
  - Carefully adjusted contrast for readability

---

## Notes / Future Considerations

- Voter authentication and fraud prevention
- Double-voting safeguards
- Real-time updates
- Advanced result visualizations