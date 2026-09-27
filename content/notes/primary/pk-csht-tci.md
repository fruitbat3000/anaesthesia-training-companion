---
title: Context-sensitive half-time and TCI
subject: pharmacology
codes: 1_GA_G3_35, 1_GA_G3_36, 1_GA_G3_37, 1_GA_G3_38, 1_GA_S_1
refs: csht1992, tiva2018
related: pk-basics, iv-induction-agents, opioids
summary: Why offset after an infusion depends on how long it has run, why remifentanil is different, and how target-controlled infusion pumps use models.
order: 30
---
## Key facts

- **Context-sensitive half-time (CSHT):** the time for the **plasma** concentration to fall by **50%** after stopping an infusion that has maintained a **steady plasma concentration**, where the "context" is the **duration of the infusion**.
- It is **not** the elimination half-life. After a short infusion, the fall in plasma concentration is driven mainly by **redistribution** to peripheral compartments. After a long infusion, those compartments are full and drug returns from them to plasma, so the fall slows.
- CSHT depends on the **ratio of elimination to redistribution**, not on either alone.
- **Remifentanil**: CSHT is about **3–4 minutes and almost independent of infusion duration**, because non-specific plasma and tissue esterases give it a very high clearance relative to its small volume of distribution.
- **Fentanyl**: CSHT rises steeply with duration (large, lipid-soluble peripheral stores). **Alfentanil** plateaus at a moderate value. **Propofol** rises only modestly over several hours because of its high clearance.
- CSHT does not predict waking directly: the decrement needed for recovery may be more or less than 50% (the **decrement time** is the general concept, e.g. 80% decrement time).

## Compartment models and TCI

- Three-compartment model: central volume V1 (plasma and highly perfused tissue), a fast peripheral compartment V2 (muscle) and a slow peripheral compartment V3 (fat), linked by rate constants k12, k21, k13, k31, with elimination k10 from V1.
- A **target-controlled infusion (TCI)** pump uses a population PK model to calculate the bolus and the decreasing infusion rates needed to reach and hold a chosen **plasma (Cp)** or **effect-site (Ce)** target. Effect-site targeting adds an equilibration constant, **ke0**.
- Propofol models: **Marsh** (weight only; plasma targeting) and **Schnider** (age, weight, height and lean body mass; usually effect-site targeting). **Eleveld** is a newer general-purpose model covering a wide range of ages and weights. Remifentanil: **Minto**.
- Predicted concentrations are population estimates. Real concentrations vary considerably between patients, so titrate to clinical effect and depth-of-anaesthesia monitoring where appropriate.

## Clinical relevance

- Choose drugs whose offset suits the case: remifentanil for long cases needing rapid, predictable emergence; avoid long fentanyl infusions if early extubation matters.
- Plan **transition analgesia** before stopping remifentanil, because its analgesic effect ends within minutes.
- TIVA safety: a dedicated cannula that is visible throughout, anti-reflux valves, correct model and patient data, and syringe labelling. Disconnection or extravasation risks awareness, as NAP5 highlighted.

> [!exam] In the exam
> - **AKT:** CSHT definitions; comparing offset of propofol, fentanyl, alfentanil and remifentanil; model inputs; why Ce and Cp differ.
> - **CASE:** "Your supervisor asks why you chose remifentanil TIVA for a 6-hour operation. Explain, and tell them what you will do about analgesia at the end." Expect to sketch CSHT curves.
