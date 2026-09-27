---
title: Pulse oximetry
subject: measurement
codes: 1_GA_F3_9, 1_GA_F2_21
refs: monitoring2021
related: resp-o2-transport, blood-rbc-hb
summary: The Beer–Lambert law, the two wavelengths and the isobestic point, how the pulsatile signal is isolated, calibration, and the many sources of error.
order: 3
---
## Principle

- **Beer–Lambert law:** absorbance depends on the concentration of the absorbing substance (**Beer**) and the path length (**Lambert**).
- Two LEDs emit **red (660 nm)** and **infrared (940 nm)** light, rapidly alternating (with a period with both off to correct for ambient light); a photodetector on the other side measures transmitted light.
- **Deoxyhaemoglobin absorbs more red light**; **oxyhaemoglobin absorbs more infrared**. The **isobestic points** (where both absorb equally, e.g. **~805 nm** and ~590 nm) are used in some devices as references.
- Only the **pulsatile (AC) component** is due to arterial blood; the constant (DC) component represents tissue, venous and capillary blood. The ratio **R = (AC~660~/DC~660~) / (AC~940~/DC~940~)** is converted to SpO~2~ using a **calibration curve derived from healthy volunteers** (who can only be desaturated safely to about 70–80%; below this readings are extrapolated and less accurate). R = 1 corresponds to about 85%; R ≈ 0.4 to 100%.
- Accuracy is about ±2% in the range 70–100%.

## Sources of error

| Error | Effect |
|---|---|
| **Carboxyhaemoglobin** | Reads as oxyhaemoglobin → **falsely high** SpO~2~ |
| **Methaemoglobin** | Absorbs both wavelengths equally → SpO~2~ tends towards **~85%** |
| **Methylene blue, indocyanine green** | Falsely **low** readings (transient) |
| Low perfusion, vasoconstriction, cold, hypotension | Poor or absent signal |
| Motion, shivering | Artefact (reduced by signal processing) |
| Venous pulsation (tricuspid regurgitation, tight probe) | Falsely low |
| Ambient light, nail varnish (especially blue, black, green) | Error |
| **Skin pigmentation** | **Overestimation** in people with darker skin, increasing the risk of undetected hypoxaemia — be cautious and check arterial gases when in doubt |
| Delay | Response lags behind arterial changes (finger probes more than ear or forehead probes) |

SpO~2~ is not a measure of ventilation (a patient on high FiO~2~ may have normal SpO~2~ despite severe hypercapnia) or of oxygen content (anaemia).

> [!exam] In the exam
> - **AKT:** wavelengths; Beer–Lambert; why methaemoglobin gives 85%; calibration; sources of error.
> - **CASE:** SpO~2~ reads 100% in a patient rescued from a house fire: why you do not trust it and what you do.
