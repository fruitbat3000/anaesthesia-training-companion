@@ ps-001
subject: statistics
codes: 1_RD_E_4
note: stats-data-descriptive
stem: The ASA physical status grade of patients in a study is an example of which type of data?
A: Continuous ratio data
B: Discrete numerical data
C: Interval data
D: Nominal categorical data
E: Ordinal categorical data
answer: E
explain: ASA grades are **ordered categories** with unequal, undefined intervals: **ordinal** data, summarised by median and interquartile range and analysed with non-parametric tests.

@@ ps-002
subject: statistics
codes: 1_RD_E_6
note: stats-data-descriptive
stem: The length of hospital stay after surgery in a cohort has a long tail to the right.

Which statement is most likely to be true?
A: Mean = median = mode
B: Mean is greater than the median
C: Median is greater than the mean
D: The data should be summarised with mean and standard deviation
E: The standard error of the mean equals the standard deviation
answer: B
explain: In a **positively (right) skewed** distribution, a few very long stays pull the **mean above the median**. The median and interquartile range are more appropriate summaries.

@@ ps-003
subject: statistics
codes: 1_RD_E_6, 1_RD_E_7
note: stats-data-descriptive
stem: In a sample of 100 patients, systolic blood pressure has a mean of 130 mmHg and a standard deviation of 20 mmHg.

What is the approximate 95% confidence interval for the population mean?
A: 90 to 170 mmHg
B: 110 to 150 mmHg
C: 126 to 134 mmHg
D: 128 to 132 mmHg
E: 129.6 to 130.4 mmHg
answer: C
explain: SEM = SD / √n = 20 / 10 = 2. The 95% CI ≈ mean ± 1.96 × SEM ≈ 130 ± 3.9 = **about 126 to 134 mmHg**.

- **A** is roughly the range covering 95% of **individual** values (mean ± 2 SD).

@@ ps-004
subject: statistics
codes: 1_RD_E_8, 1_RD_E_10
note: stats-hypothesis-tests
stem: A trial concludes that a new antiemetic is no better than placebo, but it only recruited 40 patients. In fact, the drug is effective.

What error has occurred?
A: Bias
B: Confounding
C: Publication bias
D: Type I error
E: Type II error
answer: E
explain: Failing to detect a real effect (a **false negative**) is a **type II error** (β), typically from an underpowered study.

@@ ps-005
subject: statistics
codes: 1_RD_E_9
note: stats-hypothesis-tests
stem: Pain scores (0–10 numerical rating scale) are compared between two independent groups of patients receiving different analgesic regimens.

Which test is most appropriate?
A: Chi-squared test
B: Mann–Whitney U test
C: Paired t-test
D: Pearson correlation
E: Wilcoxon signed-rank test
answer: B
explain: Pain scores are **ordinal** and the groups are **independent**, so a **non-parametric test for two independent groups** — Mann–Whitney U — is appropriate. Wilcoxon signed-rank is for paired data.

@@ ps-006
subject: statistics
codes: 1_RD_E_9
note: stats-hypothesis-tests
stem: A new screening test for difficult intubation is positive in 40 of 50 patients who proved difficult, and in 90 of 950 patients who were easy.

What is its sensitivity?
A: 9%
B: 31%
C: 80%
D: 91%
E: 98%
answer: C
explain: Sensitivity = true positives / all with the condition = 40/50 = **80%**. Specificity = 860/950 ≈ 91%. PPV = 40/130 ≈ 31% — low because the condition is uncommon.

@@ ps-007
subject: statistics
codes: 1_RD_E_2, 1_RD_E_3
note: stats-hypothesis-tests
stem: In a trial, postoperative pneumonia occurs in 10% of the control group and 6% of the treatment group.

What is the number needed to treat to prevent one pneumonia?
A: 4
B: 6
C: 10
D: 25
E: 40
answer: D
explain: Absolute risk reduction = 10% − 6% = 4% = 0.04. **NNT = 1/0.04 = 25.** (The relative risk reduction is 40%.)

@@ ps-008
subject: statistics
codes: 1_RD_E_1, 1_SQI_C_1
note: stats-study-design
stem: A department measures the proportion of patients who are normothermic on arrival in recovery each week, tries a series of small changes, and plots the results over time on a run chart.

What is this activity best described as?
A: Audit
B: Case–control study
C: Quality improvement using PDSA cycles
D: Randomised controlled trial
E: Service evaluation of a new drug
answer: C
explain: Iterative **small tests of change** measured frequently over time (run charts) using **data for improvement** is **quality improvement** (Model for Improvement, PDSA). An audit compares practice against a standard and re-audits.
