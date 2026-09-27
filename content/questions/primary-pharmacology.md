@@ pp-csht-001
subject: pharmacology
codes: 1_GA_G3_37
note: pk-csht-tci
refs: csht1992
stem: A patient is having total intravenous anaesthesia for a 7-hour operation. The team wants the opioid's offset at the end to be as rapid as after a 1-hour case.

Which property of remifentanil best explains why it meets this aim?
A: High lipid solubility
B: Low pKa
C: Metabolism by non-specific plasma and tissue esterases
D: Small volume of distribution
E: High potency
answer: C
explain: Rapid, high-capacity clearance by non-specific esterases keeps remifentanil's context-sensitive half-time at a few minutes **whatever the infusion's duration**.

- **A** High lipid solubility tends to *increase* peripheral accumulation (as with fentanyl), lengthening offset after long infusions.
- **B** A pKa close to physiological pH increases the un-ionised fraction and speeds *onset*, not offset.
- **D** A small volume of distribution helps, but on its own does not make offset independent of duration.
- **E** Potency determines dose, not how quickly the effect wears off.

@@ pp-csht-002
subject: pharmacology
codes: 1_GA_G3_37
note: pk-csht-tci
refs: csht1992
stem: Context-sensitive half-time is defined for a drug given by infusion.

Which of the following is the best definition?
A: The time for the effect-site concentration to fall by 50% after a bolus dose
B: The time for the plasma concentration to fall by 50% after stopping an infusion that has maintained a steady plasma concentration, as a function of infusion duration
C: The terminal elimination half-life adjusted for the patient's body weight
D: The time taken for a patient to wake after an infusion is stopped
E: The time for the plasma concentration to reach 50% of steady state after starting an infusion
answer: B
explain: CSHT is a **plasma** measure after an infusion that **maintained a constant plasma concentration**, and the "context" is the infusion's duration.

- **A** refers to the effect site and to a bolus, not an infusion.
- **C** The terminal half-life is a different parameter and does not describe offset after infusions of different lengths.
- **D** Waking depends on the decrement needed and on other drugs; CSHT does not directly predict it.
- **E** describes the approach to steady state after starting an infusion.

@@ pp-tci-003
subject: pharmacology
codes: 1_GA_G3_38
note: pk-csht-tci
refs: tiva2018
stem: A 78-year-old woman is anaesthetised with propofol by target-controlled infusion using effect-site targeting. At the same effect-site target, induction is slower than in a younger patient and she becomes hypotensive.

Which input to the Schnider model is most likely to explain why the pump gives her a smaller initial bolus than it would a younger patient of the same size?
A: Age
B: Body mass index
C: Gender
D: Height
E: Lean body mass
answer: A
explain: The Schnider model includes **age**, and age strongly influences its calculated bolus and rates in older patients, so older patients receive less drug for the same effect-site target. Older patients are also more sensitive pharmacodynamically, so lower targets are usually chosen.

- **B** BMI is not a direct input to Schnider.
- **C**, **D** and **E** Gender, height and lean body mass are used to calculate clearance-related parameters, but for two patients of the same size the difference in the initial bolus here is due to age.

@@ pp-pk-001
subject: pharmacology
codes: 1_GA_G3_36
note: pk-basics
stem: A drug has a volume of distribution of 70 L and a clearance of 7 L/h.

What is its elimination half-life?
A: 0.1 h
B: 4.9 h
C: 6.9 h
D: 10 h
E: 14.4 h
answer: C
explain: **t~½~ = 0.693 × Vd / CL** = 0.693 × 70 / 7 = **6.9 h**.

- **D** (10 h) is the **time constant** (Vd/CL); t~½~ = 0.693 × τ.
- **E** confuses the relationship (τ = 1.44 × t~½~).

@@ pp-pk-002
subject: pharmacology
codes: 1_GA_G3_1
note: pk-basics
stem: A drug is eliminated by first-order kinetics.

What percentage of the initial plasma concentration remains after three time constants?
A: 5%
B: 12.5%
C: 25%
D: 37%
E: 50%
answer: A
explain: After one time constant 37% remains (e^−1^); after three, e^−3^ ≈ **5%**.

- **B** (12.5%) is what remains after three **half-lives**.

@@ pp-pk-003
subject: pharmacology
codes: 1_GA_G3_32
note: pk-basics
stem: A patient in cardiogenic shock with a low cardiac output is given a lidocaine infusion for ventricular arrhythmias.

Why is the plasma concentration likely to be higher than expected?
A: Increased protein binding in shock
B: Increased volume of distribution
C: Lidocaine is a high-extraction drug, so reduced hepatic blood flow reduces its clearance
D: Lidocaine is renally excreted unchanged
E: Shock induces cytochrome P450 enzymes
answer: C
explain: Lidocaine has a **high hepatic extraction ratio**, so its clearance depends on **hepatic blood flow**. Low cardiac output reduces hepatic flow and clearance; the central volume of distribution is also reduced, so concentrations rise.

- **A** would lower the free concentration.
- **B** would lower concentrations.
- **D** Lidocaine is metabolised in the liver.
- **E** is incorrect.

@@ pp-abs-001
subject: pharmacology
codes: 1_GA_G3_30
note: pk-absorption
stem: After an oral dose of 100 mg of a drug, the area under the plasma concentration–time curve is 40 mg·h/L. After an intravenous dose of 50 mg, the AUC is 50 mg·h/L.

What is the oral bioavailability?
A: 20%
B: 40%
C: 50%
D: 80%
E: 100%
answer: B
explain: **F = (AUC~oral~ / dose~oral~) / (AUC~IV~ / dose~IV~)** = (40/100) / (50/50) = 0.4 = **40%**.

- **D** forgets to correct for the different doses.

@@ pp-abs-002
subject: pharmacology
codes: 1_GA_G3_28
note: pk-absorption
stem: A patient with a 25 µg/h transdermal fentanyl patch develops a fever of 39.5°C and is placed under a forced-air warming blanket.

What is the main risk?
A: Decreased fentanyl absorption and withdrawal
B: Increased fentanyl absorption and respiratory depression
C: No change, because patch delivery is rate-controlled by the membrane
D: Patch adhesive failure
E: Serotonin syndrome
answer: B
explain: Heat increases skin blood flow and drug diffusion from the patch and skin depot, **increasing absorption**, which can cause opioid toxicity. Avoid heat sources over patches.

- **C** The rate-controlling membrane does not prevent heat-related increases in absorption.

@@ pp-met-001
subject: pharmacology
codes: 1_GA_G3_33
note: pk-metabolism
stem: A patient taking clarithromycin receives a standard dose of midazolam for sedation and remains deeply sedated for many hours.

What is the most likely mechanism?
A: Clarithromycin displaces midazolam from albumin
B: Clarithromycin induces CYP3A4
C: Clarithromycin inhibits CYP3A4
D: Clarithromycin inhibits glucuronidation
E: Clarithromycin reduces renal excretion of midazolam
answer: C
explain: Macrolides (clarithromycin, erythromycin) **inhibit CYP3A4**, the main enzyme hydroxylating midazolam, prolonging its effect. Alfentanil and fentanyl are affected similarly.

@@ pp-met-002
subject: pharmacology
codes: 1_GA_G3_39, 1_GA_A_8
note: pk-metabolism
stem: A healthy 25-year-old remains apnoeic 90 minutes after 100 mg of suxamethonium. Her dibucaine number is later measured as 22.

What is the most likely genotype?
A: Heterozygous atypical
B: Homozygous atypical
C: Homozygous normal with acquired deficiency
D: Homozygous silent
E: Homozygous fluoride-resistant
answer: B
explain: A **dibucaine number of about 20** indicates homozygosity for the **atypical (dibucaine-resistant)** gene: the enzyme is poorly inhibited by dibucaine and hydrolyses suxamethonium very slowly. Normal ≈ 80; heterozygotes ≈ 40–60.

- **D** Silent-gene homozygotes have almost no enzyme activity; dibucaine number cannot be meaningfully measured.

@@ pp-pd-001
subject: pharmacology
codes: 1_GA_G3_11, 1_GA_G3_12
note: pd-receptors
stem: In the presence of a fixed concentration of drug X, the log dose–response curve for an agonist shifts to the right in parallel, with no change in the maximum response.

Drug X is best described as:
A: A competitive reversible antagonist
B: A full agonist at the same receptor
C: An inverse agonist
D: An irreversible antagonist
E: A partial agonist with high efficacy
answer: A
explain: A **competitive reversible antagonist** can be overcome by more agonist, producing a **parallel rightward shift** with the same maximum.

- **D** An irreversible (or non-competitive) antagonist reduces the **maximum** response.

@@ pp-pd-002
subject: pharmacology
codes: 1_GA_G3_24
note: pd-receptors
stem: Repeated 6 mg boluses of ephedrine produce progressively smaller rises in blood pressure over 20 minutes.

What is the main mechanism?
A: Down-regulation of adrenoceptors
B: Induction of monoamine oxidase
C: Increased hepatic metabolism
D: Depletion of noradrenaline stores in sympathetic nerve terminals
E: Receptor antibody formation
answer: D
explain: Ephedrine acts partly **indirectly**, releasing noradrenaline from nerve terminals. Repeated doses deplete these stores faster than they are replenished, causing **tachyphylaxis** within minutes.

- **A** Receptor down-regulation takes hours to days.

@@ pp-chem-001
subject: pharmacology
codes: 1_GA_G3_8
note: drug-chemistry
stem: A local anaesthetic has a pKa of 8.4. What proportion is un-ionised at a tissue pH of 7.4?
A: About 1%
B: About 9%
C: About 50%
D: About 91%
E: About 99%
answer: B
explain: For a base, log([ionised]/[un-ionised]) = pKa − pH = 1, so the ratio is 10:1. Un-ionised fraction = 1/11 ≈ **9%**.

@@ pp-chem-002
subject: pharmacology
codes: 1_GA_G3_7
note: drug-chemistry
stem: Which property of glycopyrronium explains why it causes less confusion than atropine in elderly patients?
A: It has a shorter half-life
B: It is a quaternary ammonium compound that does not cross the blood–brain barrier
C: It is highly protein-bound
D: It is metabolised by plasma esterases
E: It is selective for M~2~ receptors
answer: B
explain: Glycopyrronium carries a **permanent positive charge** (quaternary amine) and does not cross the blood–brain barrier. Atropine and hyoscine are tertiary amines that enter the CNS.

@@ pp-chem-003
subject: pharmacology
codes: 1_GA_G3_10
note: drug-chemistry
stem: Levobupivacaine is the S(−)-enantiomer of bupivacaine.

What is the main clinical advantage of using a single enantiomer here?
A: Faster onset of block
B: Greater motor block
C: Longer duration of action
D: Lower risk of cardiotoxicity
E: No need for adrenaline
answer: D
explain: The **R-enantiomer** of bupivacaine binds cardiac sodium channels more avidly, so the S-enantiomer (levobupivacaine) is **less cardiotoxic** for similar block characteristics.

@@ pp-inh-001
subject: pharmacology
codes: 1_GA_G3_44, 1_GA_G3_42
note: inhalational-uptake
stem: Which factor will slow the rise in alveolar concentration of sevoflurane towards the inspired concentration during inhalational induction?
A: Decreased cardiac output
B: High fresh gas flow
C: High inspired concentration
D: Increased alveolar ventilation
E: Increased cardiac output
answer: E
explain: A **high cardiac output** removes more agent from the alveoli into blood, so F~A~/F~I~ rises more slowly and induction is slower.

- **A** Low cardiac output speeds the rise (and may lead to overdose in shocked patients).
- **B**, **C** and **D** all speed the rise.

@@ pp-inh-002
subject: pharmacology
codes: 1_GA_G3_42
note: inhalational-uptake
stem: Which of the following decreases MAC?
A: Chronic alcohol use
B: Hyperthermia to 39°C
C: Hypernatraemia
D: Infancy (aged 3 months)
E: Pregnancy
answer: E
explain: **Pregnancy reduces MAC** (by up to about 30–40%), probably through progesterone and endorphins.

- **A**, **B**, **C** and **D** all **increase** MAC.

@@ pp-inh-003
subject: pharmacology
codes: 1_GA_G3_42, 1_GA_F2_16
note: inhalational-agents
stem: Why does desflurane require a heated, pressurised vaporiser?
A: It is chemically unstable at room temperature
B: It is highly soluble in blood
C: Its boiling point is close to room temperature and its saturated vapour pressure is very high
D: Its MAC is very low
E: It reacts with the metal of conventional vaporisers
answer: C
explain: Desflurane boils at about **23°C** and has an SVP of about 89 kPa at 20°C, so its output from a variable-bypass vaporiser would be uncontrollable and highly temperature-dependent. The Tec 6-type vaporiser heats it to 39°C (about 2 atmospheres) and injects vapour into the fresh gas.

@@ pp-inh-004
subject: pharmacology
codes: 1_GA_G3_42
note: inhalational-agents
stem: A patient had vitreoretinal surgery with an intraocular injection of perfluoropropane (C~3~F~8~) gas two weeks ago and now needs an emergency appendicectomy.

Which anaesthetic drug should be avoided?
A: Desflurane
B: Nitrous oxide
C: Propofol
D: Rocuronium
E: Sevoflurane
answer: B
explain: **Nitrous oxide** is much more soluble than the gas in the bubble and diffuses into it faster than the gas can leave, rapidly **expanding** it and raising intraocular pressure (risking central retinal artery occlusion and blindness). Avoid N~2~O until the bubble has fully resorbed (weeks for C~3~F~8~).

@@ pp-mech-001
subject: pharmacology
codes: 1_GA_G3_43
note: anaesthesia-mechanisms
stem: Which receptor is the principal target of ketamine?
A: GABA~A~ receptor
B: Glycine receptor
C: μ-opioid receptor
D: NMDA receptor
E: Two-pore domain potassium channel
answer: D
explain: Ketamine is a non-competitive **NMDA receptor antagonist** (channel blocker). N~2~O and xenon also act here. Propofol, etomidate and thiopental act mainly at GABA~A~ receptors.

@@ pp-iv-001
subject: pharmacology
codes: 1_GA_G3_44
note: iv-induction-agents
stem: A patient with septic shock needs a rapid sequence induction. The team chooses etomidate for cardiovascular stability.

What is the main concern specific to etomidate in this patient?
A: Bronchospasm from histamine release
B: Emergence hallucinations
C: Inhibition of adrenal steroid synthesis
D: Porphyria precipitation
E: Severe pain on injection
answer: C
explain: Even a single dose of etomidate inhibits **11β-hydroxylase**, suppressing cortisol synthesis for many hours. This may matter in sepsis, where adrenal function is important.

- **B** is a feature of ketamine.
- **D** is associated with barbiturates.

@@ pp-iv-002
subject: pharmacology
codes: 1_GA_G3_44
note: iv-induction-agents
stem: What is the main mechanism by which consciousness returns a few minutes after a single induction dose of propofol?
A: Elimination by the kidneys
B: Hepatic metabolism
C: Metabolism in the lungs
D: Redistribution from the brain to muscle and other tissues
E: Tolerance at the GABA~A~ receptor
answer: D
explain: After a single bolus, the brain concentration falls because drug **redistributes** from the vessel-rich group (brain) to muscle and then fat. Metabolism (which for propofol is rapid and partly extrahepatic) determines recovery after infusions.

@@ pp-bdz-001
subject: pharmacology
codes: 1_GA_G3_45
note: benzodiazepines-sedation
stem: How do benzodiazepines enhance GABA~A~ receptor function?
A: By blocking chloride channels
B: By directly opening the chloride channel without GABA
C: By increasing the duration of chloride channel opening
D: By increasing the frequency of chloride channel opening in the presence of GABA
E: By inhibiting GABA reuptake
answer: D
explain: Benzodiazepines are positive allosteric modulators that increase the **frequency** of channel opening in response to GABA. Barbiturates increase the **duration** of opening and at high concentrations can open the channel directly.

@@ pp-bdz-002
subject: pharmacology
codes: 1_PS_F_1, 1_PS_D_1
note: benzodiazepines-sedation
stem: During endoscopy under sedation, a patient responds purposefully only to repeated painful stimulation and needs a jaw thrust to maintain the airway.

What level of sedation has been reached?
A: Minimal sedation
B: Moderate (conscious) sedation
C: Deep sedation
D: General anaesthesia
E: Dissociative sedation
answer: C
explain: A purposeful response only to repeated or painful stimulation, with possible need for airway support, is **deep sedation**. Moderate sedation requires a purposeful response to voice or light touch with no airway intervention.

@@ pp-op-001
subject: pharmacology
codes: 1_GA_G3_50
note: opioids
stem: Why does alfentanil have a faster onset than fentanyl despite being less lipid-soluble?
A: It has a higher pKa
B: It has a larger volume of distribution
C: It is metabolised to an active compound
D: Most of the drug is un-ionised at physiological pH because of its low pKa
E: It is more potent
answer: D
explain: Alfentanil's **pKa is about 6.5**, so about **90% is un-ionised** at pH 7.4 and diffuses rapidly across the blood–brain barrier. Fentanyl (pKa ~8.4) is less than 10% un-ionised. Alfentanil's small Vd also means a high concentration gradient.

@@ pp-op-002
subject: pharmacology
codes: 1_GA_G3_50, 1_GA_G3_39
note: opioids
stem: A child is given codeine after tonsillectomy and becomes profoundly drowsy with a respiratory rate of 6.

Which genetic variation is most likely responsible?
A: CYP2D6 poor metaboliser
B: CYP2D6 ultra-rapid metaboliser
C: CYP3A4 deficiency
D: Plasma cholinesterase deficiency
E: Slow acetylator status
answer: B
explain: Codeine is a pro-drug converted to **morphine** by **CYP2D6**. **Ultra-rapid metabolisers** produce high morphine levels, causing respiratory depression; deaths in children after tonsillectomy led to codeine being contraindicated for analgesia in this setting in under-18s.

- **A** Poor metabolisers get little analgesia, not toxicity.

@@ pp-op-003
subject: pharmacology
codes: 1_GA_G3_50
note: opioids
stem: A patient given morphine in recovery is reversed with naloxone 200 µg IV and wakes. Forty-five minutes later on the ward he is found unresponsive with a respiratory rate of 5.

What is the most likely explanation?
A: Anaphylaxis to naloxone
B: Naloxone has a shorter duration of action than morphine
C: Naloxone is a partial agonist
D: Naloxone was given into a subcutaneous tissue
E: Opioid withdrawal
answer: B
explain: Naloxone's effect lasts about **30–60 minutes**, shorter than morphine's, so **re-narcotisation** occurs. Patients need observation, and repeated doses or an infusion may be needed.

@@ pp-nsaid-001
subject: pharmacology
codes: 1_GA_G3_48
note: paracetamol-nsaids
stem: What is the mechanism of liver injury in paracetamol overdose?
A: Direct inhibition of hepatic COX-2
B: Excess glucuronidation producing a toxic conjugate
C: Immune-mediated hepatitis
D: Saturation of conjugation pathways, with the metabolite NAPQI exceeding glutathione capacity
E: Uncoupling of oxidative phosphorylation by salicylate
answer: D
explain: In overdose, glucuronidation and sulphation saturate, more paracetamol is oxidised (CYP2E1) to **NAPQI**, and glutathione is depleted, so NAPQI binds hepatocyte proteins and causes necrosis. **Acetylcysteine** replenishes glutathione.

@@ pp-nsaid-002
subject: pharmacology
codes: 1_GA_G3_49
note: paracetamol-nsaids
stem: A 70-year-old taking ramipril and furosemide develops acute kidney injury after two days of regular ibuprofen following a hip replacement.

Which mechanism best explains the renal effect of the NSAID?
A: Direct tubular toxicity
B: Glomerulonephritis
C: Increased renin secretion
D: Inhibition of prostaglandin-mediated afferent arteriolar vasodilatation
E: Obstruction of the renal tubules by crystals
answer: D
explain: When renal perfusion is threatened, **prostaglandins dilate the afferent arteriole** to preserve GFR. NSAIDs remove this; ACE inhibitors remove angiotensin II efferent constriction and diuretics reduce volume (the "triple whammy").

@@ pp-la-001
subject: pharmacology
codes: 1_GA_G3_46
note: local-anaesthetics
stem: Which property of a local anaesthetic most strongly determines its duration of action?
A: Degree of ionisation at physiological pH
B: Ester or amide linkage
C: Lipid solubility
D: Molecular weight
E: Protein binding
answer: E
explain: **Protein binding** (to sodium channel proteins as well as plasma proteins) correlates best with **duration**: bupivacaine (~95%) lasts longer than lidocaine (~65%).

- **A** (pKa) determines speed of onset.
- **C** determines potency.

@@ pp-la-002
subject: pharmacology
codes: 1_GA_G3_46, 1_RA_K_1
note: local-anaesthetics
stem: A 50 kg woman is to have an ankle block with plain levobupivacaine 0.5%. Using a maximum dose of 2 mg/kg, what is the largest volume that may be given?
A: 10 mL
B: 15 mL
C: 20 mL
D: 25 mL
E: 30 mL
answer: C
explain: 0.5% = 5 mg/mL. Maximum dose = 2 × 50 = 100 mg → 100 / 5 = **20 mL**. (Remember to include any other local anaesthetic given, and that maximum doses are only a guide.)

@@ pp-sux-001
subject: pharmacology
codes: 1_GA_G3_51
note: nmb-suxamethonium
stem: After a prolonged infusion of suxamethonium, the train-of-four shows fade and a post-tetanic count response is seen.

What does this indicate?
A: Anticholinesterase overdose
B: Malignant hyperthermia
C: Phase I block
D: Phase II block
E: Residual non-depolarising block from a previous drug
answer: D
explain: **Phase II block** develops with large or repeated doses and shows the features of a non-depolarising block: **fade** on TOF and tetanus, and **post-tetanic facilitation**. Phase I (depolarising) block shows no fade.

@@ pp-sux-002
subject: pharmacology
codes: 1_GA_G3_51, 1_GA_A_8
note: nmb-suxamethonium
stem: In which patient is suxamethonium most likely to cause life-threatening hyperkalaemia?
A: A patient 2 hours after a 30% burn
B: A patient 3 weeks after a spinal cord injury with paraplegia
C: A patient with chronic kidney disease and a potassium of 5.0 mmol/L
D: A patient with myasthenia gravis
E: A pregnant woman at term
answer: B
explain: **Denervation** (spinal cord injury, stroke) causes proliferation of **extrajunctional receptors** from about 48–72 hours; suxamethonium then causes massive K^+^ efflux, with risk that persists for months.

- **A** Risk starts about 24–48 h after a burn, not at 2 hours.
- **C** A normal-high K^+^ in stable renal failure rises by only about 0.5 mmol/L.
- **D** Myasthenics are resistant to suxamethonium.
- **E** Pregnancy slightly reduces cholinesterase but does not cause hyperkalaemia.

@@ pp-ndp-001
subject: pharmacology
codes: 1_GA_G3_52
note: nmb-nondepolarising
stem: Which non-depolarising neuromuscular blocker is most suitable for a patient with both renal and hepatic failure?
A: Cisatracurium
B: Mivacurium
C: Pancuronium
D: Rocuronium
E: Vecuronium
answer: A
explain: **Cisatracurium** is eliminated mainly by **Hofmann degradation** (organ-independent), so its duration is predictable in renal and hepatic failure and it releases little histamine.

- **B** Mivacurium depends on plasma cholinesterase, which is reduced in liver failure.
- **C**, **D** and **E** depend on hepatic and/or renal elimination.

@@ pp-ndp-002
subject: pharmacology
codes: 1_GA_G3_52
note: nmb-nondepolarising
stem: Rocuronium produces intubating conditions faster than vecuronium at equipotent doses.

Which principle best explains this?
A: Rocuronium is more lipid-soluble
B: Rocuronium is more potent, so fewer molecules are needed
C: Rocuronium is less potent, so more molecules are given and reach the junction faster
D: Rocuronium is not bound to plasma proteins
E: Rocuronium undergoes Hofmann degradation
answer: C
explain: The **Bowman principle**: onset is inversely related to potency. A less potent drug is given in a larger molar dose, creating a steeper concentration gradient to the neuromuscular junction.

@@ pp-rev-001
subject: pharmacology
codes: 1_GA_G3_53
note: nmb-reversal
stem: A patient given rocuronium 1.2 mg/kg for a rapid sequence induction cannot be intubated or oxygenated, and the team decides to reverse the block immediately.

Which statement is correct?
A: Neostigmine 5 mg will reverse the block within 2 minutes
B: Sugammadex at the high "immediate reversal" dose can reverse this block within minutes
C: Sugammadex is ineffective against high-dose rocuronium
D: Reversal of neuromuscular block guarantees a patent airway
E: Flumazenil should be given with sugammadex
answer: B
explain: **Sugammadex** encapsulates rocuronium and at the high immediate-reversal dose (per product information) restores neuromuscular function within a few minutes. However, reversal may not relieve an airway obstructed for other reasons, and **front-of-neck access must not be delayed**.

- **A** Neostigmine cannot reverse deep block (ceiling effect).

@@ pp-rev-002
subject: pharmacology
codes: 1_GA_F3_17, 1_GA_D_4
note: nmb-reversal
stem: What is the minimum train-of-four ratio at the adductor pollicis that is generally accepted as adequate recovery before tracheal extubation?
A: 0.4
B: 0.5
C: 0.7
D: 0.9
E: 1.2
answer: D
explain: A **TOF ratio ≥ 0.9** (measured quantitatively) is the accepted threshold: below it, pharyngeal function and airway protection may be impaired. Fade cannot reliably be detected by touch or sight once the ratio exceeds about 0.4.

@@ pp-ach-001
subject: pharmacology
codes: 1_GA_G3_57
note: anticholinergics-cholinergics
stem: A 12-year-old becomes agitated, flushed, hot and confused in recovery after receiving hyoscine hydrobromide. The pupils are dilated and the skin is dry.

What is the specific treatment if symptoms are severe?
A: Atropine
B: Dantrolene
C: Glycopyrronium
D: Neostigmine
E: Physostigmine
answer: E
explain: This is the **central anticholinergic syndrome**. **Physostigmine** is a tertiary anticholinesterase that crosses the blood–brain barrier. Neostigmine is quaternary and does not.

@@ pp-sym-001
subject: pharmacology
codes: 1_GA_G3_59
note: sympathomimetics
stem: A patient on long-term β-blockers with severe heart failure has a low cardiac output state after surgery.

Which inotrope works independently of β-adrenoceptors?
A: Adrenaline
B: Dobutamine
C: Dopamine
D: Isoprenaline
E: Milrinone
answer: E
explain: **Milrinone** inhibits **phosphodiesterase III**, raising cAMP without needing β-receptor stimulation. It is an **inodilator** (inotropy with vasodilation), useful when β-receptors are blocked or downregulated.

@@ pp-sym-002
subject: pharmacology
codes: 1_GA_G3_56
note: sympathomimetics
stem: A patient taking phenelzine develops hypotension under anaesthesia.

Which vasopressor is most likely to cause a hypertensive crisis?
A: Adrenaline in small doses
B: Ephedrine
C: Noradrenaline in small doses
D: Phenylephrine in small doses
E: Vasopressin
answer: B
explain: MAOIs increase noradrenaline stores in nerve terminals. **Indirectly acting** sympathomimetics such as **ephedrine** release these stores, causing an exaggerated, dangerous hypertensive response. Direct-acting agents in reduced, titrated doses are preferred.

@@ pp-htn-001
subject: pharmacology
codes: 1_GA_G3_62
note: antihypertensives
stem: A patient receives a sodium nitroprusside infusion at high doses for 24 hours and develops a metabolic acidosis with a rising lactate and a high mixed venous oxygen saturation.

What is the most likely cause, and its specific treatment?
A: Cyanide toxicity; hydroxocobalamin or sodium thiosulfate
B: Methaemoglobinaemia; methylene blue
C: Propofol infusion syndrome; stop propofol
D: Rebound hypertension; labetalol
E: Thiocyanate toxicity; haemodialysis alone
answer: A
explain: Nitroprusside releases **cyanide**, which blocks cytochrome oxidase: cells cannot use oxygen, so lactate rises and mixed venous saturation is high. Treat with **hydroxocobalamin** (forms cyanocobalamin) and/or **sodium thiosulfate**; stop the infusion.

@@ pp-arr-001
subject: pharmacology
codes: 1_GA_G3_61
note: antiarrhythmics
stem: A patient with a regular narrow-complex tachycardia at 180/min is given adenosine 6 mg IV without effect.

Which interaction would most increase the effect and duration of adenosine?
A: Aminophylline
B: Caffeine
C: Dipyridamole
D: Theophylline
E: Verapamil
answer: C
explain: **Dipyridamole blocks adenosine reuptake**, greatly potentiating it: use a much smaller dose. Methylxanthines (aminophylline, theophylline, caffeine) **antagonise** adenosine receptors.

@@ pp-arr-002
subject: pharmacology
codes: 1_GA_G3_61
note: antiarrhythmics
stem: Which electrolyte abnormality most increases the risk of digoxin toxicity?
A: Hyperkalaemia
B: Hypermagnesaemia
C: Hypernatraemia
D: Hypocalcaemia
E: Hypokalaemia
answer: E
explain: Digoxin competes with K^+^ for the Na^+^/K^+^-ATPase. **Hypokalaemia** increases digoxin binding and toxicity (so do hypomagnesaemia and hypercalcaemia).

@@ pp-card-001
subject: pharmacology
codes: 1_GA_G3_60
note: cardiac-drugs
stem: Which antianginal drug slows the heart rate by blocking the funny current (I~f~) in the sinoatrial node, without negative inotropic effect?
A: Diltiazem
B: Ivabradine
C: Nicorandil
D: Ranolazine
E: Verapamil
answer: B
explain: **Ivabradine** blocks HCN channels carrying I~f~, slowing phase 4 depolarisation in sinus rhythm. It does not reduce contractility.

@@ pp-card-002
subject: pharmacology
codes: 1_GA_G3_60, 1_POM_C_3
note: cardiac-drugs
stem: A patient taking dapagliflozin for heart failure has emergency surgery and afterwards is breathless and vomiting. Glucose is 9 mmol/L, pH 7.18, bicarbonate 10 mmol/L and blood ketones 5.2 mmol/L.

What is the most likely diagnosis?
A: Euglycaemic diabetic ketoacidosis
B: Hyperosmolar hyperglycaemic state
C: Lactic acidosis from metformin
D: Renal tubular acidosis
E: Starvation ketosis without acidosis
answer: A
explain: **SGLT2 inhibitors** can cause **euglycaemic DKA**, especially with fasting, surgery and acute illness: ketoacidosis with near-normal glucose. Treat as DKA (fluids, insulin with glucose, potassium) and stop the drug.

@@ pp-ac-001
subject: pharmacology
codes: 1_GA_G3_63
note: anticoagulants
stem: A patient on dabigatran needs emergency laparotomy for a perforation and is bleeding.

What is the specific reversal agent?
A: Andexanet alfa
B: Idarucizumab
C: Protamine
D: Tranexamic acid
E: Vitamin K
answer: B
explain: **Idarucizumab** is a monoclonal antibody fragment that binds dabigatran (a direct thrombin inhibitor).

- **A** reverses factor Xa inhibitors (apixaban, rivaroxaban).
- **C** reverses heparin.
- **E** reverses warfarin (slowly).

@@ pp-ac-002
subject: pharmacology
codes: 1_GA_G3_63, 1_POM_L_3
note: anticoagulants
stem: A patient receives prophylactic-dose enoxaparin at 18:00. Assuming normal renal function, when is the earliest time that a spinal anaesthetic would usually be considered appropriate according to UK guidance?
A: 20:00 the same day
B: 00:00
C: 06:00 the next morning
D: 18:00 the next day
E: 48 hours later
answer: C
explain: UK guidance recommends waiting about **12 hours after a prophylactic dose** of LMWH (24 hours after a treatment dose) before neuraxial block. Always check the current guideline and consider renal function.

@@ pp-proc-001
subject: pharmacology
codes: 1_GA_G3_64
note: procoagulants-blood-products
stem: What is the mechanism of action of tranexamic acid?
A: Activation of factor VII
B: Binding to lysine sites on plasminogen, preventing its binding to fibrin
C: Direct inhibition of thrombin
D: Release of von Willebrand factor from endothelium
E: Replacement of fibrinogen
answer: B
explain: Tranexamic acid is a **lysine analogue** that blocks the lysine-binding sites on plasminogen, preventing fibrin binding and **fibrinolysis**. In trauma it should be given within 3 hours of injury.

@@ pp-fl-001
subject: pharmacology
codes: 1_GA_G3_66
note: iv-fluids
stem: A patient receives 6 L of 0.9% sodium chloride during resuscitation.

Which acid–base disturbance is most likely?
A: Hyperchloraemic metabolic acidosis with a normal anion gap
B: Lactic acidosis with a raised anion gap
C: Metabolic alkalosis
D: Respiratory acidosis
E: No acid–base change
answer: A
explain: 0.9% saline contains 154 mmol/L of chloride (much more than plasma). Large volumes cause a **hyperchloraemic, normal anion gap metabolic acidosis** (in Stewart terms, the strong ion difference falls).

@@ pp-ae-001
subject: pharmacology
codes: 1_GA_G3_72
note: antiemetics
stem: A 22-year-old woman develops torticollis and oculogyric crisis after an antiemetic given in recovery.

Which drug is most likely responsible?
A: Cyclizine
B: Dexamethasone
C: Metoclopramide
D: Ondansetron
E: Aprepitant
answer: C
explain: **D~2~ antagonists** such as metoclopramide (and droperidol, haloperidol) can cause acute **dystonic reactions**, especially in young women. Treat with an anticholinergic such as procyclidine.

@@ pp-ae-002
subject: pharmacology
codes: 1_GA_D_3
note: antiemetics
stem: A patient given ondansetron and dexamethasone at induction has severe nausea in recovery 30 minutes after the end of surgery.

What is the most appropriate rescue antiemetic?
A: A second dose of dexamethasone
B: A second dose of ondansetron
C: A drug from a different class, such as cyclizine
D: No further antiemetic until 6 hours have passed
E: Propofol infusion at anaesthetic doses
answer: C
explain: The consensus guidelines recommend rescue with an antiemetic from a **different class** from those already given; repeating the same drug within about 6 hours adds little.

@@ pp-gi-001
subject: pharmacology
codes: 1_GA_G3_71, 1_GA_A_12
note: gi-drugs
stem: Why is sodium citrate preferred to magnesium trisilicate before general anaesthesia for emergency caesarean section?
A: It also increases gastric emptying
B: It is non-particulate, so causes less lung damage if aspirated
C: It lasts for 6 hours
D: It reduces gastric acid secretion
E: It tightens the lower oesophageal sphincter
answer: B
explain: **Particulate antacids** cause severe pneumonitis if aspirated. **Sodium citrate** is a clear, non-particulate antacid that neutralises acid already present; its effect is short (about 20–30 minutes).

@@ pp-resp-001
subject: pharmacology
codes: 1_GA_G3_68
note: respiratory-drugs
stem: A patient on regular theophylline is started on ciprofloxacin and develops nausea, tachycardia and a seizure.

What is the mechanism?
A: Additive seizure threshold lowering only
B: Ciprofloxacin induces CYP1A2
C: Ciprofloxacin inhibits CYP1A2, increasing theophylline levels
D: Displacement of theophylline from albumin
E: Reduced renal excretion of theophylline
answer: C
explain: Theophylline is metabolised by **CYP1A2**; ciprofloxacin (and erythromycin) **inhibit** it, raising levels into the toxic range (narrow therapeutic index). Smoking induces CYP1A2 and lowers levels.

@@ pp-diur-001
subject: pharmacology
codes: 1_GA_G3_73
note: diuretics
stem: Which diuretic is most likely to cause hypercalcaemia?
A: Acetazolamide
B: Bendroflumethiazide
C: Furosemide
D: Mannitol
E: Spironolactone
answer: B
explain: **Thiazides** increase distal calcium reabsorption and can cause **hypercalcaemia** (and are used to reduce calcium stone formation). **Loop diuretics** increase calcium excretion and can treat hypercalcaemia.

@@ pp-cns-001
subject: pharmacology
codes: 1_GA_G3_75, 1_GA_G3_21
note: cns-drugs
stem: A patient taking sertraline receives tramadol after surgery and develops agitation, tremor, hyperreflexia, inducible clonus and a temperature of 38.6°C.

What is the most likely diagnosis?
A: Anticholinergic syndrome
B: Malignant hyperthermia
C: Neuroleptic malignant syndrome
D: Opioid withdrawal
E: Serotonin syndrome
answer: E
explain: **Serotonin syndrome** (SSRI plus tramadol's serotonin reuptake inhibition): neuromuscular hyperactivity (**clonus, hyperreflexia**), autonomic instability and altered mental state, developing within hours.

- **C** NMS develops over days, with **rigidity** (lead-pipe) and bradyreflexia, after dopamine antagonists.
- **B** MH occurs with triggers during anaesthesia.

@@ pp-cns-002
subject: pharmacology
codes: 1_GA_G3_74
note: cns-drugs
stem: A patient with Parkinson's disease is nauseated after surgery.

Which antiemetic is most appropriate?
A: Droperidol
B: Haloperidol
C: Metoclopramide
D: Ondansetron
E: Prochlorperazine
answer: D
explain: Central **dopamine antagonists** worsen Parkinsonism and should be avoided. **Ondansetron** (5-HT~3~ antagonist) or domperidone (peripheral D~2~ antagonist) are appropriate.

@@ pp-dm-001
subject: pharmacology
codes: 1_GA_G3_76
note: diabetes-drugs
stem: A patient with type 1 diabetes is nil by mouth for a morning operation. Her usual regimen is glargine at night and aspart with meals.

What is the most appropriate plan for her glargine the night before surgery?
A: Omit it completely
B: Give about 80% of the usual dose
C: Double the dose
D: Give it only if the morning glucose is high
E: Replace it with oral gliclazide
answer: B
explain: **Basal insulin must never be stopped** in type 1 diabetes (ketoacidosis). Guidance is to continue the long-acting insulin, usually at about **80%** of the dose, while mealtime insulin is omitted when not eating.

@@ pp-ster-001
subject: pharmacology
codes: 1_GA_G3_77
note: steroids-thyroid-drugs
stem: Which corticosteroid has the greatest glucocorticoid potency with negligible mineralocorticoid activity?
A: Dexamethasone
B: Fludrocortisone
C: Hydrocortisone
D: Methylprednisolone
E: Prednisolone
answer: A
explain: **Dexamethasone** is about 25–30 times as potent a glucocorticoid as hydrocortisone, with virtually no mineralocorticoid effect. Fludrocortisone is mainly mineralocorticoid.

@@ pp-abx-001
subject: pharmacology
codes: 1_GA_G3_81
note: antimicrobials
stem: Which antibiotic is most likely to prolong the action of rocuronium?
A: Amoxicillin
B: Cefuroxime
C: Gentamicin
D: Metronidazole
E: Vancomycin
answer: C
explain: **Aminoglycosides** reduce prejunctional ACh release (Ca^2+^ antagonism) and have postjunctional effects, **potentiating non-depolarising block**. Clindamycin and polymyxins also do this.

@@ pp-abx-002
subject: pharmacology
codes: 1_POM_J_6
note: antimicrobials
stem: When should intravenous antibiotic prophylaxis ideally be given for a clean-contaminated operation?
A: At the end of surgery
B: Within 60 minutes before the skin incision
C: The evening before surgery
D: Only if the operation lasts over 4 hours
E: Three hours before incision
answer: B
explain: Give prophylaxis **within 60 minutes before incision** so that tissue concentrations are adequate when contamination occurs; re-dose for long procedures or major blood loss.

@@ pp-mh-001
subject: pharmacology
codes: 1_GA_E_25
note: mh-dantrolene
stem: Which is the earliest and most specific sign of malignant hyperthermia during a volatile anaesthetic with controlled ventilation?
A: Hyperkalaemia
B: Myoglobinuria
C: Temperature above 40°C
D: Unexplained rise in end-tidal CO~2~ despite increased minute ventilation
E: Ventricular arrhythmias
answer: D
explain: Hypermetabolism produces large amounts of CO~2~ early, so an **unexplained rising ETCO~2~** (with tachycardia) is typically the first sign. Hyperthermia is often a **late** sign.

@@ pp-mh-002
subject: pharmacology
codes: 1_GA_E_25
note: mh-dantrolene
stem: What is the mechanism of action of dantrolene?
A: Block of acetylcholine release at the neuromuscular junction
B: Block of L-type calcium channels in cardiac muscle
C: Inhibition of calcium release from the sarcoplasmic reticulum via the ryanodine receptor
D: Inhibition of prostaglandin synthesis in the hypothalamus
E: Uncoupling of oxidative phosphorylation
answer: C
explain: Dantrolene binds the **ryanodine receptor (RyR1)** and reduces **Ca^2+^ release from the sarcoplasmic reticulum** in skeletal muscle. It does not act at the neuromuscular junction.

@@ pp-int-001
subject: pharmacology
codes: 1_GA_G3_25
note: drug-interactions
stem: On an isobologram of doses of propofol and midazolam producing loss of consciousness, the line of combined doses bows towards the origin.

What does this indicate?
A: Additive interaction
B: Antagonism
C: No interaction
D: Pharmaceutical incompatibility
E: Synergy
answer: E
explain: If lower doses than expected from simple addition produce the same effect, the isobole bows **towards the origin**: **synergy**. A straight line is additive; bowing away is antagonism.
