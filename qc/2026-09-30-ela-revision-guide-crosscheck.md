# Cross-check: Primary science notes against the e-LA Revision Guides

_30 September 2026 · draft notes, not a clinical review_

## What was done

The 65 Primary notes that map to topics in the e-LA Revision Guides (Physiology, Pharmacology and Physics; SOURCES S34) were compared with the matching guide sections. A local model (qwen3.8, run on Mark's Mac) listed possible contradictions and up to three missing examinable points per note. Claude then checked every flag against the guide text and standard teaching before changing anything. The guides' text was not copied; additions are in our own words.

This is a first accuracy pass. It does not replace clinical review, and every note keeps its **Draft** status.

## Result

| | Flags | Acted on | Rejected |
|---|---|---|---|
| Contradictions | 52 | about 20 (fixed, or given a range or nuance) | about 30 |
| Missing points | about 180 | about 45 short additions | the rest (low yield, or already covered elsewhere) |

## Errors or imprecision fixed

- Lymph flow: about 8 L/day enters the lymphatics, but roughly half is reabsorbed in nodes (about 4 L/day returns to the circulation).
- Valsalva phase I: raised intrathoracic pressure is transmitted to the aorta (the note said blood was "squeezed out of" it).
- Peripheral chemoreceptors: H⁺ stimulates the carotid bodies; the aortic bodies respond little to pH.
- Lower oesophageal sphincter: propofol has little effect (it was listed as reducing tone).
- Stress response: minimally invasive surgery mainly reduces the inflammatory and acute-phase response, not the cortisol and catecholamine surge.
- Volume of distribution: high plasma protein binding alone does not mean a small Vd (propofol).
- NK₁ antagonists act at the nucleus tractus solitarius and CTZ (not "the vomiting centre").
- Infrared thermometry: emitted power rises with T⁴ (Stefan–Boltzmann), not in simple proportion.
- Midazolam "tautomerism" is strictly a pH-dependent ring opening; wording clarified.
- Ranges widened where sources genuinely differ: renal autoregulation (80–180 mmHg), glomerular capillary pressure (45–60 mmHg), proximal bicarbonate reabsorption (80–90%), maximal medullary osmolality (1200–1400 mOsm/kg), pregnancy SVR fall (20–30%), laser FiO₂ (0.25–0.3), heat loss by evaporation (15–20%), cardiac sympathetic outflow (T1–T4, sometimes T5), CYP2D6 ultra-rapid metabolisers (up to 30% in parts of East Africa).

## Main additions

Receptor families (cell physiology); West zones and the bronchial circulation; heart sounds and the effect of heart rate on diastole; coronary territories on the ECG; the Anrep effect and ventriculo-arterial coupling; AV nodal delay and the fibrous skeleton; the double Bohr effect and HbF P50; central chemoreceptors and respiratory versus metabolic acidosis; oxygen in chronic hypercapnia; absorption atelectasis; anterior and posterior hypothalamus, countercurrent heat exchange; cyanide and cytochrome oxidase; glycogen and gluconeogenesis; osmoreceptors, ADH and thirst; the isohydric principle and renal acid handling; renal prostaglandins and NSAIDs; SNARE proteins and botulinum toxin; KATP channels in coronary flow; four functions of FRC; the effect of shunt on PaCO₂; 2,3-DPG and the maternal oxygen curve; the Bourdon gauge; cylinder filling ratio and Entonox separation; bioavailability; geometric isomers (mivacurium); TCI as an open-loop system; heliox and gas density at depth.

## Flags rejected, with reasons

**The note is right and the guide is wrong or oversimplified**
- Cardiac resting potential: set by K⁺ efflux through I_K1; the Na⁺/K⁺-ATPase maintains the gradients.
- Hypoxic pulmonary vasoconstriction: inhibition of oxygen-sensitive K⁺ channels is the accepted mechanism.
- Band 3: passive anion exchange, not active transport.
- Sickle cell disease: HbS lowers oxygen affinity (right shift); the guide states a left shift.
- Surfactant increases lung compliance (the guide says it reduces it).
- Laplace for a single alveolar surface is P = 2T/r (4T/r applies to a bubble with two surfaces).
- Angiotensin II's efferent constriction supports GFR when perfusion falls.
- TFPI inhibits the tissue factor–VIIa complex and Xa, not thrombin.
- Platelets: UK shelf life is 7 days with bacterial screening.
- TACO is currently the leading cause of serious transfusion morbidity and death in UK SHOT reports.
- Pregnancy reduces fibrinolysis.
- Heated humidifiers can fully saturate gas at 37 °C.
- Thiopental precipitates with acidic drugs generally, including rocuronium; midazolam and propofol are synergistic.

**Normal variation between textbooks (left as written)**
Plasma osmolality range, interstitial volume, adrenal adrenaline share, myocardial oxygen extraction, the altitude at half atmospheric pressure, ACh molecules per vesicle, intracranial volume proportions, Entonox pseudo-critical temperature, pulse oximeter infrared wavelength, remifentanil context-sensitive half-time.

## Files

The local model's raw output and the extracted guide text are kept outside the repository (`docs/qc/`, not in git), because they contain passages of the guides.
