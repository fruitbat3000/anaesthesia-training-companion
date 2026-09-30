---
title: Pharmacokinetic principles — Vd, clearance, half-life and compartments
subject: pharmacology
codes: 1_GA_G3_1, 1_GA_G3_2, 1_GA_G3_3, 1_GA_G3_27, 1_GA_G3_31, 1_GA_G3_32, 1_GA_G3_35, 1_GA_G3_36
refs: csht1992
related: pk-csht-tci, pk-absorption, pk-metabolism
summary: Volume of distribution, clearance, elimination half-life and time constants, exponential processes and the one-, two- and three-compartment models.
order: 1
---
## Core definitions

- **Volume of distribution (Vd)** = amount of drug in the body / plasma concentration. An apparent volume: lipophilic, tissue-bound drugs have huge Vd (fentanyl about 4 L/kg); ionised drugs, and drugs bound more to plasma proteins than to tissues, have a small Vd (neuromuscular blockers about 0.2 L/kg; warfarin about 0.1 L/kg). High plasma protein binding alone does not guarantee a small Vd: propofol is about 98% bound yet has a very large Vd because tissue binding is greater still.
- **Bioavailability (F):** the fraction of a dose reaching the systemic circulation unchanged (IV = 1), reduced by incomplete absorption and first-pass metabolism in gut wall and liver.
- **Loading dose** = target concentration × Vd.
- **Clearance (CL)**: volume of plasma cleared of drug per unit time. **Rate of elimination = CL × concentration.** Clearances add: CL~total~ = CL~hepatic~ + CL~renal~ + others.
- **Maintenance rate** = target concentration × CL.
- **Elimination rate constant k = CL / Vd.**
- **Half-life t~½~ = 0.693 × Vd / CL** (0.693 = ln 2). It therefore **rises if Vd rises or clearance falls**.
- **Time constant τ = Vd / CL = 1/k = 1.44 × t~½~**: the time it would take to eliminate all the drug if the initial rate continued.

## Exponential processes

- In **first-order** kinetics a constant **fraction** is eliminated per unit time: C = C~0~ e^−kt^.
- After one time constant, concentration falls to **37%** (a fall of 63%); after 3τ to 5%, after 5τ to under 1%.
- After one half-life 50% remains; after **4–5 half-lives** about 94–97% is gone. Steady state during a constant infusion is reached after about 4–5 half-lives (without a loading dose).
- **Wash-in** (e.g. of oxygen during pre-oxygenation, or volatile in a circle) follows the reverse (exponential approach to a plateau): 63% at 1τ, 95% at 3τ. For a breathing system or the FRC, **τ = volume / flow**.
- Plotting **ln(concentration)** against time turns an exponential decline into a straight line with slope −k.
- **AUC** (area under the concentration–time curve) = dose × bioavailability / CL. Used to calculate bioavailability and clearance.

## Hepatic clearance

- **CL~H~ = Q~H~ × E** (hepatic blood flow × extraction ratio).
- **High extraction drugs** (E > 0.7: propofol, lidocaine, morphine, fentanyl): clearance is **flow-limited** — reduced by low cardiac output and hepatic blood flow, little affected by enzyme induction or protein binding.
- **Low extraction drugs** (E < 0.3: warfarin, phenytoin, diazepam): clearance is **capacity-limited** — sensitive to enzyme induction and inhibition and to free fraction.

## Compartment models

- **One-compartment:** instantaneous distribution; single exponential decline.
- **Two-compartment:** a rapid **distribution (α) phase** followed by a slower **elimination (β) phase**. After an IV bolus of propofol or thiopental, **redistribution** from the brain to muscle and then fat ends the clinical effect, not elimination.
- **Three-compartment:** central (V1), fast peripheral (V2, muscle) and slow peripheral (V3, fat). The basis of TCI (see context-sensitive half-time).
- **Physiological (and non-compartmental) models** use real organ volumes and flows, or statistical moments (mean residence time).

> [!exam] In the exam
> - **AKT:** calculations of Vd, loading dose, half-life and time constants; percentage remaining after n half-lives; high versus low extraction drugs.
> - **CASE:** explaining why a patient in low-output cardiac failure needs less lidocaine or propofol by infusion.
