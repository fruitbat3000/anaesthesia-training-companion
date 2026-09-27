---
title: Principles of measurement — accuracy, damping and resonance
subject: measurement
codes: 1_GA_F3_1, 1_GA_F3_21, 1_GA_F3_22, 1_GA_F2_23
refs: openanesthesia
related: pressure-measurement
summary: Accuracy, precision, linearity, drift, hysteresis, signal-to-noise ratio, calibration, and the dynamic response of measuring systems including damping and resonance.
order: 1
---
## Static characteristics

- **Accuracy:** closeness to the true value. **Precision:** reproducibility (clustering of repeated measurements). A device can be precise but inaccurate (a consistent bias).
- **Linearity:** output is proportional to input across the range.
- **Drift:** change in output over time with a constant input: **zero drift** (offset shifts) or **gain drift** (slope changes). Two-point calibration corrects both.
- **Hysteresis:** the reading depends on whether the input is rising or falling.
- **Sensitivity** and **resolution:** smallest detectable change.
- **Signal-to-noise ratio:** improved by filtering, averaging and good technique.
- **Calibration:** comparing against known standards (one-point: zero; two-point: zero and a known value).

## Dynamic response

- **Response time**, **time constant** (time to reach 63% of a step change) and **frequency response**: a system must respond accurately to all frequency components of the signal. An arterial pressure waveform can be reconstructed from its fundamental frequency (heart rate) and harmonics up to about the **8th–10th**: at 120/min (2 Hz) that means accurate response up to **~20 Hz**.
- **Resonance (natural frequency):** every system oscillates most readily at its natural frequency. If it is close to the frequencies in the signal, the output is **amplified** (overshoot). For catheter–transducer systems, natural frequency is **increased** by a **short, wide, stiff** catheter, a stiff diaphragm and a low-density fluid, and **decreased** by long, narrow, compliant tubing and air bubbles.
- **Damping:** anything that dissipates energy and reduces oscillation (friction, air bubbles, clots, kinks, narrow tubing).
  - **Damping coefficient (ζ)**: **critically damped ζ = 1** (fastest response without overshoot, but too slow for waveforms); **optimal damping ζ ≈ 0.64** (fast response with minimal overshoot, ~7%; best frequency response).
  - **Underdamped** (ζ < 0.64): overshoot → **overestimated systolic, underestimated diastolic**, "ringing" waveform. **Overdamped:** flattened trace → **underestimated systolic, overestimated diastolic**. The **mean pressure is relatively unaffected**.
- **Square-wave (fast flush) test:** a brief flush produces a square wave followed by oscillations: counting and measuring these estimates the natural frequency and damping. One or two oscillations before settling indicates acceptable damping.

> [!exam] In the exam
> - **AKT:** definitions (drift, hysteresis, precision); natural frequency and damping; effects on systolic and diastolic readings.
> - **CASE:** interpreting a "ringing" arterial trace and a flattened one, and fixing each.
