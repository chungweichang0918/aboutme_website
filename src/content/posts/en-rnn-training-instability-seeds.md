---
contentId: "rnn-training-instability-seeds"
slug: "rnn-training-instability-seeds"
locale: "en"
title: "Reproducing a paper: one random seed was worth 4.5 points"
summary: "While reproducing an NSL-KDD intrusion detection paper, LSTM and GRU stayed 3 points below the published numbers. Five diagnostic experiments showed the problem was not the code but how stably the recurrent networks trained."
date: "2026-11-13"
draft: false
visibility: "public"
tags: ["Deep learning", "Reproducibility", "Gradient clipping"]
category: "Applied AI"
links: [{"label": "Related research", "url": "https://cwchang.me/en/research/nids-deep-learning-reproduction/"}, {"label": "Full report (PDF, Chinese)", "url": "/documents/nids-deep-learning-reproduction.pdf"}]
cover: "/media/og/en-blog-rnn-training-instability-seeds.jpg"
coverAlt: "Title card for “Reproducing a paper: one random seed was worth 4.5 points”"
---

## The gap

I reproduced an IEEE Access intrusion detection paper, retraining 12 models with the same data, preprocessing and hyperparameters. DNN, CNN and RNN matched the paper to within 0.4 percentage points. Binary LSTM and GRU, however, reached only 96.41% and 96.06%, more than 3 points below the paper. The paper called GRU the best model; in my results it was the worst.

## Read the training curves before changing code

When numbers disagree, the first instinct is to suspect a bug. The training curves pointed elsewhere:

- Training and validation accuracy almost overlapped, so this was underfitting, not overfitting.
- The curves collapsed partway through. Around epoch 48, GRU dropped from 97.6% as its loss spiked, then slowly climbed back without recovering by epoch 100.

That kind of collapse is a classic sign of exploding gradients in recurrent networks. Rather than tweak by feel, I wrote down the possible causes as hypotheses and changed one variable at a time.

## Five hypotheses, one change each

Every run recorded both the last-epoch weights and the best-validation-epoch weights, to tell unstable training apart from a model that simply cannot do better.

1. **Random seed**: changing only the seed from 42 to 1 took binary GRU from 96.06% to 98.02%, and five-class CNN-LSTM from 93.42% to 97.96%, exactly the paper's number.
2. **Exploding gradients**: with gradient clipping (clipnorm = 1) every collapse disappeared, and GRU reached 98.78%, the best result of all the experiments.
3. **Learning rate**: lowering it to 3×10⁻⁴ made things worse. With batch 5000 and 100 epochs, only about 1,600 weight updates happen in total, and a smaller learning rate just slows convergence.
4. **Gradient accumulation**: my GPU could not fit batch 5000, so I accumulated 5 steps of 1000. Training LSTM directly with batch 5000 gave 97.72%, on par with the other runs that did not collapse, so it was not the cause.
5. **Framework**: the paper used TensorFlow; I used the PyTorch backend. Training LSTM with TensorFlow 2.14 gave 98.21%, again on par with runs that did not collapse, so it was not the cause either.

![Validation accuracy curves for the three settings under each diagnostic experiment](/media/research/nids-ablation-curves.webp)

*The dashed grey line is the main run. With gradient clipping (green) the collapses disappear; a lower learning rate (orange) converges more slowly.*

## What I learned

**Rankings from a single run are not reliable.** The same model moved by 1.4 to 4.5 points with a different seed, more than the under-one-point gaps between the paper's six models. Comparing models needs several seeds, reported as mean and standard deviation.

**Gradient clipping is close to mandatory for recurrent networks.** It does not make the model stronger, but it stops the result from depending on which epoch a collapse happens to land in.

**Keep two sets of weights.** Looking only at the last epoch mistakes instability for lack of capacity; looking only at the best epoch can overstate the model. Comparing both shows where the problem is.

**Question the problem setup first.** NSL-KDD features have no temporal order, so feeding them to an LSTM as a sequence is debatable to begin with. The simplest DNN, with 5,025 parameters and 36 seconds of training, reached 99.43%.

The full experimental design, result tables and discussion are on the research page, where the report PDF can also be downloaded.
