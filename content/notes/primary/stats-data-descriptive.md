---
title: Statistics — types of data, distributions and descriptive statistics
subject: statistics
codes: 1_RD_E_4, 1_RD_E_5, 1_RD_E_6, 1_RD_E_7
refs: openanesthesia
related: stats-hypothesis-tests, stats-study-design
summary: Categorical and numerical data, the normal distribution and its properties, measures of central tendency and spread, standard error and confidence intervals.
order: 1
---
## Types of data

| Type | Subtype | Examples | Summary |
|---|---|---|---|
| **Categorical (qualitative)** | **Nominal** (no order) | Blood group, sex, type of surgery | Counts, proportions, mode |
| | **Ordinal** (ordered, unequal intervals) | ASA grade, pain score, Mallampati | Median, IQR |
| **Numerical (quantitative)** | **Discrete** (counts) | Number of attempts | |
| | **Continuous** — interval (arbitrary zero, e.g. °C) or ratio (true zero, e.g. weight, Kelvin) | Blood pressure, weight | Mean and SD if normally distributed |

## The normal distribution

- Symmetrical and bell-shaped; **mean = median = mode**; defined by its mean and standard deviation.
- **68%** of values lie within ±1 SD, **95%** within **±1.96 SD**, 99.7% within ±3 SD.
- **Skewed distributions:** positive (right) skew has a long tail to the right and **mean > median > mode** (e.g. length of stay); negative skew the reverse. Use the **median and interquartile range**, or transform the data (e.g. logarithms).
- Other distributions: binomial (two outcomes), Poisson (counts of rare events), t distribution (small samples), χ^2^.

## Descriptive statistics

- **Central tendency:** mean (affected by outliers), median (middle value), mode (most frequent).
- **Spread:** range, **interquartile range** (25th–75th centiles), **variance** (mean squared deviation), **standard deviation** (√variance; describes the spread of the data).
- **Standard error of the mean (SEM) = SD / √n**: describes the precision of the sample mean as an estimate of the population mean. It falls as sample size rises.

## Probability and confidence intervals

- Probability ranges from 0 to 1. For independent events, P(A and B) = P(A) × P(B); for mutually exclusive events, P(A or B) = P(A) + P(B).
- **95% confidence interval** for a mean ≈ **mean ± 1.96 × SEM**: if the study were repeated many times, 95% of such intervals would contain the true population value. A confidence interval shows both the size of an effect and its precision; if the 95% CI for a difference excludes zero (or for a ratio excludes 1), the result is significant at p < 0.05.

> [!exam] In the exam
> - **AKT:** classify data types; properties of the normal distribution; SD versus SEM; interpreting confidence intervals.
> - **CASE:** explaining to a patient what "a 1 in 100 risk" means, or interpreting the results table of a trial.
