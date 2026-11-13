---
contentId: "nids-deep-learning-reproduction"
slug: "nids-deep-learning-reproduction"
locale: "en"
title: "Reproducing a Deep Learning Intrusion Detection Study and Analyzing Training Instability"
summary: "A reproduction of an IEEE Access 2024 NSL-KDD intrusion detection study, retraining all 12 models. DNN, CNN and RNN reproduce; LSTM and GRU fall about 3 points short. Five diagnostic experiments trace the gap to unstable training of the recurrent models."
date: "2026-11-13"
draft: false
visibility: "public"
tags: ["NSL-KDD", "Deep learning", "LSTM", "GRU", "Reproducibility"]
status: "unpublished"
category: "Cybersecurity"
authors: ["Wayne Chang"]
links: [{"label": "Full report (PDF, Chinese)", "url": "/documents/nids-deep-learning-reproduction.pdf"}, {"label": "Original paper (IEEE Access, 2024)", "url": "https://doi.org/10.1109/ACCESS.2024.3389096"}]
cover: "/media/og/en-research-nids-deep-learning-reproduction.jpg"
coverAlt: "Title card for “Reproducing a Deep Learning Intrusion Detection Study and Analyzing Training Instability”"
---

## Research question

Elsayed et al. (IEEE Access, 2024) compared six models (DNN, RNN, CNN, LSTM, GRU and a hybrid CNN-LSTM) on the NSL-KDD dataset. They reported accuracies from 97.96% to 99.54% and, on margins of a few tenths of a percentage point, named GRU the best binary classifier.

This study re-implements all 12 models (6 architectures × binary and five-class classification) using the paper's published preprocessing and its best KerasTuner hyperparameters, to check whether the results and the model ranking reproduce. For models that do not, diagnostic experiments look for the cause.

## Method

![Reproduction pipeline: NSL-KDD data, standardization, one-hot encoding, random split, six models, evaluation](/media/research/nids-pipeline.webp)

*Reproduction pipeline, from preprocessing and splitting KDDTrain+ to training and evaluating the six models.*

- **Data**: KDDTrain+, 125,973 records. The 38 numeric features are standardized and the 3 categorical features one-hot encoded, giving 122 dimensions.
- **Split**: seed 42, 80% training and 20% test (25,195 records); 20% of the training data is held out for validation.
- **Training**: Adam (learning rate 10⁻³), 100 epochs, batch size 5000, evaluated with the weights from the last epoch.
- **Differences from the paper**: the paper used TensorFlow/Keras 2.14 on a Colab TPU; this study used Keras 3 with PyTorch 2.6 on an RTX 4050 (6 GB). The recurrent models did not fit in GPU memory, so they process 1000 records at a time and accumulate gradients over 5 steps, equivalent to batch 5000.
- The paper's code is published as images, so a few details (pooling sizes, the activation of dense layers) are inferred.

## Results

Binary classification accuracy (%):

| Model | This study | Paper | Difference |
| --- | --- | --- | --- |
| DNN | 99.43 | 99.39 | +0.04 |
| RNN | 99.47 | 99.09 | +0.37 |
| CNN | 99.40 | 99.38 | +0.02 |
| LSTM | 96.41 | 99.41 | −3.00 |
| GRU | 96.06 | 99.54 | −3.48 |
| CNN-LSTM | 99.16 | 98.94 | +0.21 |

![Bar charts comparing four binary-classification metrics; blue is this study, orange is the paper](/media/research/nids-binary-comparison.webp)

*Binary-classification accuracy, precision, recall and F1. Blue is this study, orange is the paper.*

- DNN, CNN and RNN reproduce in both tasks, within ±0.4 percentage points.
- Binary LSTM and GRU are about 3 points lower; the five-class CNN-LSTM reaches only 93.42% (paper: 97.96%).
- The claim that GRU is the best binary model does not reproduce: RNN is best here (99.47%) and GRU is the worst.
- In five-class classification, DNN, RNN and CNN land between 99.41% and 99.43%, only 0.02 points apart, which a single run cannot separate.

## Why LSTM and GRU fall short

The training curves of LSTM and GRU show training and validation accuracy almost on top of each other, so the problem is underfitting, not overfitting. The curves also "collapse" partway through, with accuracy dropping sharply as the loss spikes. For binary LSTM, binary GRU and five-class CNN-LSTM I tested five hypotheses, recording both the last-epoch weights and the best-validation-epoch weights in each run:

| Hypothesis | Experiment | Result |
| --- | --- | --- |
| Random seed | Seed 42 changed to 1 | Binary LSTM 96.41% → 97.81%, binary GRU 96.06% → 98.02%, five-class CNN-LSTM 93.42% → 97.96% |
| Exploding gradients | Gradient clipping, clipnorm = 1 | All collapses disappear; binary GRU 98.78%, binary LSTM 97.96% |
| Learning rate too high | Learning rate 3×10⁻⁴ | Worse (binary LSTM 93.24%); not converged within 100 epochs |
| Gradient accumulation | LSTM trained directly with batch 5000 | 97.72%, on par with other runs that did not collapse; not the cause |
| Framework | LSTM trained with TensorFlow 2.14 | 98.21%, on par with PyTorch runs that did not collapse; not the cause |

![Validation accuracy curves for the three settings under each diagnostic experiment](/media/research/nids-ablation-curves.webp)

*Validation accuracy in the diagnostic experiments. The dashed grey line is the main run; with gradient clipping (green) the collapses disappear, while a lower learning rate (orange) converges much more slowly.*

The main cause is that the recurrent models intermittently hit exploding gradients at a learning rate of 10⁻³, and 100 epochs are not enough to fully recover from a collapse. When a collapse happens depends on the random seed. Changing only the seed moves results by 1.4 to 4.5 points, more than the under-one-point gaps between models in the paper, so without repeated runs the paper's ranking is not reliable.

Even with gradient clipping, binary LSTM and GRU remain 0.8 to 1.5 points below the paper. That may come from a luckier seed or from a selection effect when KerasTuner picks the best of many trials; the paper reports neither seeds nor the number of runs, so this cannot be confirmed.

## Discussion

**Model complexity.** The simplest model, a DNN with 5,025 parameters trained in 36 seconds, reaches 99.43%. RNN scores highest (99.47%) but takes 4,388 seconds to train, 122 times as long as the DNN. GRU has 31 times the DNN's parameters and performs worst.

**Tabular features as a sequence.** Each NSL-KDD record summarizes one independent connection; its 122 features sit in a fixed column order with no temporal relation. Feeding them to a recurrent network as a sequence of length 122 teaches it the column layout, not traffic behavior over time. To use temporal information, sequences should be built from consecutive connections of the same host or time window.

**Evaluation.** Both the paper and this study use a random split inside KDDTrain+. The official KDDTest+ contains 17 attack types absent from the training data and better reflects detection of new attacks, so 99%+ accuracy should be read as recognition of known attack types.

![Bar chart of class counts in KDDTrain+, log scale](/media/research/nids-class-distribution.webp)

*Class counts in KDDTrain+ (log scale). U2R has only 52 records, 0.04% of the data.*

**Class imbalance.** Normal and DoS make up almost 90% of the data. The test set contains only 11 U2R records, so misclassifying all of them lowers overall accuracy by just 0.04 points. Even the best model, CNN, reaches an F1 of only 0.375 on U2R. If the goal is to catch rare but harmful attacks, per-class recall or macro-F1 is the better measure.

## Limitations and next steps

- The main experiments ran once per setting, and the diagnostic experiments added one more seed, so there are no confidence intervals.
- Hyperparameters were not re-searched, and some architectural details are inferred.
- Next steps: repeat with several seeds and report mean and standard deviation, evaluate on the official KDDTest+, add SMOTE or class weights for U2R and R2L, and re-test recurrent models on data with real temporal structure.

The full report (7 pages, in Chinese) adds per-class five-class results, confusion matrices, model architectures and references, and can be downloaded below.
