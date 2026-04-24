# Assessment Design Engine — User Instructions

---

### 1. Purpose
The Assessment Design Engine is a local-first, privacy-preserving tool designed to help educators and programme designers create structured, coherent, and AI-aware assessment systems that are directly aligned with intended learning outcomes.

---

### 2. What This Tool Does
This tool provides a structured environment for defining assessment tasks, mapping them to learning outcomes, and explicitly documenting AI usage policies. It automates the calculation of assessment weightings and generates a unified summary that can be exported or printed for quality assurance and governance purposes.

---

### 3. Role in the Ecosystem
- **Phase:** Phase 4 — Assessment & Integrity Layer
- **Role:** Supports the design of structured assessment systems aligned to learning outcomes, with explicit consideration of AI use and authenticity.
- **Reference:** [./PROJECT_SPEC.md](./PROJECT_SPEC.md)

---

### 4. When to Use This Tool
- When designing a new module or programme and needing to ensure learning outcomes are adequately assessed.
- When reviewing existing assessments to align them with institutional AI policies.
- When documenting the authenticity and integrity rationale for an assessment strategy.
- When preparing documentation for curriculum review or quality assurance committees.

---

### 5. Inputs
- **Programme & Module Meta:** Programme name, module name, and level (e.g., Undergraduate, Postgraduate).
- **Learning Outcomes:** A list of specific outcomes (optionally with codes) that the module aims to achieve.
- **Assessment Tasks:** Title, type, weighting, description, and link to learning outcomes.
- **Governance Details:** AI usage modes (Allowed, Conditional, Not Allowed), authenticity notes, and integrity risks.

---

### 6. How to Use (Step-by-Step)
1. **Define Context:** Enter the Programme Name, Module Name, and Level in the "Assessment Plan Context" panel.
2. **Add Learning Outcomes:** List all intended learning outcomes in the "Learning Outcomes" panel. These will be used for mapping later.
3. **Design Assessments:** 
   - Click "Add Assessment" to create a new task.
   - Specify the title, type, and weighting.
   - Select the relevant learning outcomes from the checklist.
   - Define the AI Usage Mode and provide specific guidelines.
   - Add notes on how the task ensures authenticity.
4. **Provide Rationale:** In the "Rationale & Governance" panel, document the overall design strategy, authenticity considerations, and any identified risks or assumptions.
5. **Review Summary:** Scroll down to the "Assessment Summary Output" to see the unified plan.
6. **Export/Print:** Use the "Export JSON" button for portability or the "Print / Save to PDF" button for a human-readable report.

---

### 7. Key Outputs
- **Structured Assessment Plan:** A unified view of all tasks, weightings, and mappings.
- **LO Mapping Matrix:** A clear visualization of which learning outcomes are covered by which assessments.
- **Governance Summary:** Explicit AI usage policies and authenticity notes for each task.
- **Portable Data:** A JSON file containing the entire state of the design for later editing or integration.

---

### 8. How It Connects to Other Tools
- **Upstream:** Receives curriculum structures from the Mapping Engine and programme design context from the Governance Dashboard.
- **Downstream:** Provides structured assessment data for the AI Integrity Design Tool and the Evidence & QA Pack Generator.

---

### 9. Limitations
- **No Teaching Delivery:** This is a design tool, not a Virtual Learning Environment (VLE) or LMS.
- **No Grading:** It does not manage student submissions or grading workflows.
- **No Policy Enforcement:** It helps document policies but does not enforce them in actual student work.

---

### 10. Tips
- **Weighting Check:** Keep an eye on the "Total Weighting" indicator; it will turn green when the sum of all assessments reaches exactly 100%.
- **Local Persistence:** Your work is saved automatically to your browser's local storage. You can safely close the tab and return later.
- **Demo Data:** Use the "Load Demo Data" button in the header to see an example of a completed assessment plan.
