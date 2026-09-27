---
title: Statistics — hypothesis testing, errors, power and choosing a test
subject: statistics
codes: 1_RD_E_7, 1_RD_E_8, 1_RD_E_9, 1_RD_E_10, 1_RD_E_2
refs: openanesthesia
related: stats-data-descriptive, stats-study-design
summary: The null hypothesis and p values, type I and II errors, power and sample size, parametric and non-parametric tests, correlation and regression, and diagnostic test statistics.
order: 2
---
## Hypothesis testing

- **Null hypothesis (H~0~):** no difference or no association. The **p value** is the probability of obtaining the observed result (or one more extreme) **if the null hypothesis were true**. It is **not** the probability that the null hypothesis is true.
- Conventionally p < 0.05 is "statistically significant" (α = 0.05). Statistical significance is not the same as **clinical importance**.
- **Multiple comparisons** inflate the chance of a false positive (e.g. 20 tests at α = 0.05 → about 64% chance of at least one false positive): correct with methods such as Bonferroni (α / number of tests).

## Errors and power

| | H~0~ true | H~0~ false |
|---|---|---|
| **Reject H~0~** | **Type I error (α)**: false positive | Correct (power) |
| **Accept H~0~** | Correct | **Type II error (β)**: false negative |

- **Power = 1 − β**: the probability of detecting a true effect of a given size; usually set at **80–90%**.
- **Sample size** depends on α, power, the **minimum clinically important difference** (smaller → more patients) and the **variability** of the outcome (larger SD → more patients). Underpowered studies risk type II errors.

## Choosing a test

| Data | Two independent groups | Paired / repeated | More than two groups |
|---|---|---|---|
| Continuous, normally distributed (parametric) | **Unpaired Student's t-test** | **Paired t-test** | **ANOVA** |
| Ordinal or non-normal (non-parametric) | **Mann–Whitney U** | **Wilcoxon signed-rank** | **Kruskal–Wallis** (independent), Friedman (repeated) |
| Categorical (proportions) | **Chi-squared (χ^2^)**, or **Fisher's exact** when expected counts are small (< 5) | **McNemar's** | χ^2^ |

- **Correlation** (Pearson r for normally distributed data; Spearman ρ for ranks) measures the strength of a linear association (−1 to +1); it does not imply causation. **Regression** predicts one variable from another (linear, logistic for binary outcomes, Cox for time-to-event).
- **Bland–Altman plots** compare two methods of measurement (agreement, bias and limits of agreement); correlation is inappropriate for this.
- **Survival analysis:** Kaplan–Meier curves, log-rank test, hazard ratios.

## Diagnostic tests

| | Disease present | Disease absent |
|---|---|---|
| Test positive | True positive (a) | False positive (b) |
| Test negative | False negative (c) | True negative (d) |

- **Sensitivity = a/(a + c)** (proportion of diseased correctly identified; SnNout: a highly **s**ensitive test, when **n**egative, rules **out**). **Specificity = d/(b + d)** (SpPin).
- **Positive predictive value = a/(a + b)**; **negative predictive value = d/(c + d)**. Predictive values **depend on prevalence**; sensitivity and specificity do not.
- **ROC curve:** sensitivity against (1 − specificity) across cut-off values; area under the curve summarises discrimination (0.5 = chance, 1 = perfect).

## Measures of effect

- **Absolute risk reduction (ARR)** = control event rate − experimental event rate. **Number needed to treat (NNT) = 1/ARR.**
- **Relative risk (RR)** = risk in the treated / risk in controls; **relative risk reduction** = 1 − RR. **Odds ratio** approximates RR when events are rare.

> [!exam] In the exam
> - **AKT:** definitions of p, α, β and power; choose the right test for a scenario; calculate sensitivity, specificity, PPV and NNT from a 2 × 2 table.
> - **CASE:** critically appraising a trial abstract presented by a colleague.
