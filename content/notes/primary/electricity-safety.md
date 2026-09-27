---
title: Electricity and electrical safety
subject: physics
codes: 1_GA_F1_9, 1_GA_F1_10, 1_GA_F1_11, 1_GA_F2_19, 1_GA_F3_6
refs: openanesthesia
related: diathermy-lasers-fires, defibrillation-pacing
summary: Basic electrical principles (Ohm's law, capacitance, inductance), how electric shock and microshock occur, equipment classes and symbols, and interference.
order: 10
---
## Principles

- **Ohm's law: V = I × R.** Power = V × I = I^2^R. Impedance is the total opposition to alternating current (resistance plus reactance).
- **Capacitor:** two conducting plates separated by an insulator; stores charge (Q = CV; energy = ½CV^2^). **Impedance falls as frequency rises**: capacitors pass high-frequency AC and block DC. Used in defibrillators and filters.
- **Inductor:** a coil; **impedance rises with frequency** (opposes changing current). Used in defibrillators to shape and prolong the discharge, and in filters.
- UK mains: **230 V AC at 50 Hz**.

## Electric shock

- Current flows if a person completes a circuit (e.g. between a live conductor and **earth**).
- Effects depend on **current** (not voltage alone), path, duration and frequency. **50 Hz is especially dangerous** for inducing VF.

| Current through the body (mains, hand to hand) | Effect |
|---|---|
| 1 mA | Tingling (threshold of perception) |
| 5–15 mA | Pain; cannot let go (tetany) |
| 50 mA | Respiratory muscle spasm, pain, possible fainting |
| **100 mA** | **Ventricular fibrillation** |
| > 5 A | Sustained contraction, burns |

- **Microshock:** if current is applied **directly to the heart** (via a pacing wire, CVC guidewire or fluid-filled catheter), as little as **~100–150 µA** may cause VF. Hence strict leakage current limits for cardiac equipment.
- **Burns** result from current density (heat = I^2^Rt), e.g. at a diathermy plate or where skin touches earthed metal.

## Protection and equipment classes

| Class | Protection |
|---|---|
| **I** | Accessible metal parts **earthed**; fuse blows if a live wire touches the casing |
| **II** | **Double insulated**; no earth wire |
| **III** | Powered by **safety extra-low voltage** (≤ 24 V AC / 50 V DC) |

| Type (applied parts) | Maximum patient leakage current (normal) | Use |
|---|---|---|
| **B** | ≤ 100 µA | Not for direct cardiac connection |
| **BF** | ≤ 100 µA, **floating** (isolated) applied part | Most monitoring (ECG, NIBP) |
| **CF** | **≤ 10 µA**, floating | **Direct cardiac connection** (e.g. invasive pressure, cardiac output) |

(Symbols: B is a figure; BF a figure in a square; CF a heart in a square. Defibrillation-proof versions show paddles around the symbol.)

Further safety: **isolating transformers** (the patient circuit is not referenced to earth), **equipotential earthing** in theatres, **residual current circuit breakers** (detect imbalance between live and neutral and cut the supply within milliseconds), antistatic flooring, regular maintenance and testing.

## Interference

- Sources: mains (50 Hz), diathermy (high frequency), other equipment, movement.
- Reduction: **differential amplifiers** with high **common mode rejection ratio**, filters (notch filters at 50 Hz), screened (shielded) cables, good electrode contact, keeping leads short and together.

> [!exam] In the exam
> - **AKT:** equipment classes and types with leakage limits; microshock thresholds; capacitor and inductor behaviour with frequency.
> - **CASE:** a patient with a temporary pacing wire in situ: what electrical precautions do you take?
