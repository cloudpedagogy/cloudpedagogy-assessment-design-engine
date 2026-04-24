# PROJECT_SPEC: cloudpedagogy-assessment-design-engine

## 1. Repo Name
`cloudpedagogy-assessment-design-engine`

## 2. One-Sentence Purpose
A local-first tool for designing structured, AI-aware assessment systems aligned to learning outcomes.

## 3. Problem the App Solves
Designing assessments in an AI-enabled environment requires explicit consideration of learning outcome alignment, authenticity, and clear AI usage boundaries. Traditionally, these elements are often disconnected or poorly documented. This tool provides a structured framework to ensure assessments are valid, defensible, and transparently governed from the design phase.

## 4. Primary User / Audience
Educators, Module Leaders, Programme Directors, and Quality Assurance teams within educational institutions.

## 5. Core Role in the CloudPedagogy Ecosystem
The Assessment Design Engine sits in **Phase 4 (Assessment & Integrity Layer)** of the CloudPedagogy ecosystem. It translates high-level curriculum designs into specific assessment tasks, ensuring that the integrity and authenticity of student work are considered early in the process.

## 6. Main Entities / Data Structures
- **LearningOutcome**: Represents an intended learning outcome (id, code, description).
- **Assessment**: Represents a specific assessment task (title, type, weighting, linked outcomes, AI usage mode, authenticity notes).
- **AssessmentPlanMeta**: Contains context for the plan (programme name, module name, level).
- **Rationale**: Captures high-level design decisions and governance considerations (design rationale, authenticity, risks, AI involvement, assumptions).
- **AppState**: The root object containing all metadata, outcomes, assessments, and rationale.

## 7. Main User Workflows
1. **Context Initialization**: Users define the module and programme context.
2. **Outcome Definition**: Users input the learning outcomes that the assessment strategy must cover.
3. **Assessment Task Design**: Users build assessment tasks, assign weightings, and map them to specific outcomes.
4. **Governance Alignment**: Users define AI allowability and document authenticity measures for each task.
5. **Strategic Rationale**: Users document the overall strategy and integrity risks.
6. **Data Portability**: Users export the final design as JSON or generate a human-readable PDF summary.

## 8. Current Features
- **Learning Outcome Mapping**: Direct linkage between tasks and outcomes.
- **Dynamic Weighting Calculation**: Real-time tracking of assessment totals (aiming for 100%).
- **AI-Aware Policy Definition**: Standardized modes for AI allowability (Allowed, Conditional, Not Allowed).
- **Authenticity Documentation**: Specific fields for capturing how tasks are made "AI-resistant" or authentic.
- **Local-First Architecture**: Data is stored in `localStorage` for privacy and offline use.
- **JSON Import/Export**: Enables portability across the CloudPedagogy ecosystem.
- **Print-Optimized Summary**: Generates a professional summary for documentation.

## 9. Stubbed / Partial / Incomplete Features
- Not explicitly defined in current repo contents.

## 10. Import / Export and Storage Model
- **Storage**: Browser `localStorage` (key: `cloudpedagogy_assessment_engine`).
- **Import/Export**: JSON-based import and export functionality for portability and backups.

## 11. Relationship to Other CloudPedagogy Apps
- **Upstream**: Consumes curriculum structures from the **Mapping Engine**.
- **Downstream**: Feeds structured assessment and integrity data into the **AI Integrity Design Tool** and the **Evidence & QA Pack Generator**.

## 12. Potential Overlap or Duplication Risks
- Some overlap with the **Mapping Engine** regarding learning outcome definitions (though this tool focuses on mapping them to *assessments* rather than broader curriculum units).
- Some overlap with the **AI Integrity Design Tool** regarding risk assessment (this tool focuses on the *design* of the task, while the Integrity tool focuses on the *threat model*).

## 13. Distinctive Value of This App
Its distinctive value lies in the **explicit mapping of learning outcomes to AI usage modes**. By forcing designers to consider AI allowability at the task level during the design phase, it ensures that integrity is "baked in" rather than added as an afterthought.

## 14. Recommended Future Enhancements
- Integration with institutional API for learning outcome retrieval.
- Automated suggestions for assessment types based on learning outcome verbs (e.g., "Critically analyze" -> "Essay" or "Case Study").
- Visual heatmaps showing learning outcome coverage across a whole programme.
- Templates for AI usage guidelines based on different disciplinary standards.

## 15. Anything Unclear or Inferred from Repo Contents
- The "Upstream/Downstream" connections are inferred from the ecosystem description in `README.md`.
- The specific mapping to "Phase 4" is explicitly stated in the `README.md`.
- Data structure names are taken directly from `src/types.ts`.
