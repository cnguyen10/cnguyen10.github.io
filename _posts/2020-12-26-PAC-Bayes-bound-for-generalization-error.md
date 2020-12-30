---
layout: post
title: "PAC-Bayes bound for generalization error"
comments: true
---
Properly approaximately correct (PAC) learning has been a fundamental course for most of graduate programs in machine learning. Its motivation is to upper-bound the *true risk* (or generalisation error) by the *empirical risk* with certain confidence level. In other words, it is often written in the following form:

<p align="center">
    Pr(true risk &le; empirical risk + regularization) &ge; 1 - &delta;,
</p>

where Pr(A) is the probability of event A, and &delta; &isin; (0, 1]. Note that the <em>regularization</em> is often a function of <em>sample size</em> and &delta;, and its limit when the <em>sample sizes</em> approaches infinity is 0.

PAC-Bayes upper generalization bound is a kind of PAC learning. It was firstly proposed in 1999 <a href="#mcallester1999">(McAllester 1999)</a>, and has attracted much of research interest. There has been many subsequent improvements made to tighten further this classic PAC-Bayes bound or to extend it to more general loss functions. However, the classic PAC-Bayes theorem is still the backbone. In this post, I will show how to prove this interesting theorem.

## Auxillary lemmas
To prove the classic PAC-Bayes theorem, we need two auxilliary lemmas shown below.

### Change of measure inequality for Kullback-Leibler divergence
<div class="lemma" id="change-of-measure">
    [<a href="#banerjee2006">(Banerjee 2006, Lemma 1)</a>] For any measurable function \(\phi(h)\) on a set of predictor under consideration \(\mathcal{H}\), and any distributions \(P\) and \(Q\) on \(\mathcal{H}\), the following inequality holds:
    \[
        \mathbb{E}_{Q} [\phi(h)] \le \mathrm{KL} [Q \Vert P] + \ln \mathbb{E}_{P} [\exp(\phi(h))].
    \]
    Further,
    \[
        \sup_{\phi} \mathbb{E}_{Q} [\phi(h)] - \ln \mathbb{E}_{P} [\exp(\phi(h))] = \mathrm{KL} [Q \Vert P].
    \]
</div>

<div class="proof">
    <p>
        For any measurable function \(\phi(h)\), the following holds:
        \[
            \begin{aligned}
                \mathbb{E}_{Q} [\phi(h)] & = \mathbb{E}_{Q} \left[ \ln \left( \exp(\phi(h)) \frac{Q(h)}{P(h)} \frac{P(h)}{Q(h)} \right) \right] \\
                & = \mathrm{KL} [Q \Vert P] + \mathbb{E}_{Q} \left[ \ln \left( \exp(\phi(h)) \frac{P(h)}{Q(h)} \right) \right] \\
                & \le \mathrm{KL} [Q \Vert P] + \ln \mathbb{E}_{Q} \left[ \exp(\phi(h)) \frac{P(h)}{Q(h)} \right] \\
                & \qquad \text{(Jensen's inequality)}\\
                & = \mathrm{KL} [Q \Vert P] + \ln \mathbb{E}_{P} \left[ \exp(\phi(h)) \right].
            \end{aligned}
        \]
    </p>
    <p>
        For the second part of the lemma, we need to examine the equality condition of the Jensen's inequality. Since \(\ln(x)\) is a strictly concave function for \(x > 0\), it follows that the equality holds when:
        \[
            \begin{aligned}
                \exp \left( \phi(h) \right) & \frac{P(h)}{Q(h)} = 1 \\
                \iff \phi(h) & = \ln \left[ \frac{Q(h)}{P(h)} \right].
            \end{aligned}
        \]
        With this choice of \(\phi(h)\), we can verify that the equality does hold.
    </p>
    <p>
        This completes the proof.
    </p>
</div>

### Concentration inequality
<div class="lemma" id="concentration-inequality">
    [<a href="#ss_bd2014">(Shalev-Shwartz and Ben-David 2014, Exercise 31.1)</a>] Let \(X\) be a non-negative random variable that satisfies: \(\mathrm{Pr} (X \ge \epsilon) \le e^{-2m \epsilon^{2}}\). Prove that
    \[
        \mathbb{E} \left[ e^{2(m - 1) X^{2}} \right] \le m.
    \]
</div>

<div class="proof">
    <p>
        Since the assumption is expressed in term of probability, while the conclusion is written in form of an expectation, what we need to do first is to try to present the expectation in term of probability.
    </p>
    <p>
        For simplicity, let \(Y = e^{2(m - 1) X^{2}}\). Since \(X \in [0, +\infty)\), then \(Y \in [1, +\infty)\). According to the layer cake representation:
        \[
            Y = \int_{0}^{Y} \, \mathrm{d}t = \int_{1}^{+\infty} \mathbf{1}(Y \ge t) \, \mathrm{d}t,
        \]
        where \(\mathbf{1}(A)\) is the indication function of event \(A\).
    </p>
    <p>
        One important property of the indication function is that:
        \[
            \mathbb{E} \left[ \mathbf{1}(Y \ge t) \right] = \mathrm{Pr}(Y \ge t).
        \]
        This allows to express the expectation of interest as:
        \[
        \begin{aligned}
            \mathbb{E}[Y] & = \mathbb{E} \left[ \int_{1}^{+\infty} \mathbf{1}(Y \ge t) \, \mathrm{d}t \right] \\
            & = \int_{1}^{+\infty} \mathbb{E} [\mathbf{1}(Y \ge t)] \, \mathrm{d}t \quad \text{(Fubini's theorem)} \\
            & = \int_{1}^{+\infty} \mathrm{Pr}(Y \ge t) \, \mathrm{d}t.
        \end{aligned}
        \]
        Or:
        \[
            \mathbb{E} \left[ e^{2(m - 1) X^{2}} \right] = \int_{1}^{+\infty} \mathrm{Pr}( e^{2(m - 1) X^{2}} \ge x) \, \mathrm{d}x.
        \]
    </p>
    <p>
        We then make a change of variable from \(x\) to \(\epsilon\) to utilize the given inequality in the assumption. Let's define:
        \[
            x = e^{2(m - 1) \epsilon^{2}}.
        \]
        Since \(\epsilon\) is assumed to be non-negative, we can express it as:
        \[
            \epsilon = \sqrt{\frac{\ln x}{2(m - 1)}},
        \]
        and:
        \[
            \mathrm{d}x = 4(m - 1) \epsilon \, e^{2(m - 1) \epsilon^{2}} \, \mathrm{d} \epsilon.
        \]
    </p>
    <p>
        The expectation of interest can, therefore, be written as:
        \[
            \begin{aligned}
                \mathbb{E} \left[ e^{2(m - 1) X^{2}} \right] & = \int_{0}^{+\infty} \mathrm{Pr} \left( e^{2(m - 1) X^{2}} \ge e^{2(m - 1) \epsilon^{2}} \right) 4(m - 1) \epsilon \, e^{2(m - 1) \epsilon^{2}} \, \mathrm{d} \epsilon \\
                & = \int_{0}^{+\infty} \mathrm{Pr} \underbrace{\left( X \ge \epsilon \right)}_{\le e^{-2m\epsilon^{2}}} 4(m - 1) \epsilon \, e^{2(m - 1) \epsilon^{2}} \, \mathrm{d} \epsilon \\
                & \le e^{-2m\epsilon^{2}} 4(m - 1) \epsilon \, e^{2(m - 1) \epsilon^{2}} \, \mathrm{d} \epsilon = m.
            \end{aligned}
        \]
    </p>
</div>

### PAC-Bayes bound
<div class="theorem">
    Let \(D\) be an arbitrary distribution over an example domain \(Z\). Let \(\mathcal{H}\) be a hypothesis class, \(\ell: \mathcal{H} \times Z \to [0, 1]\) be a loss function, \(\pi\) be a prior distribution over \(\mathcal{H}\), and \(\delta \in (0, 1]\). If \(S = \{z_j\}_{j=1}^{m}\) is an i.i.d. training set sampled according to \(D\), then for any “posterior” \(Q\) over \(\mathcal{H}\), the following holds:
    \[
        \mathrm{Pr} \left( \mathbb{E}_{z_{j} \sim D} \mathbb{E}_{h \sim Q} \left[ \ell(h, z_{j}) \right] \le \mathbb{E}_{z_{j} \sim S} \mathbb{E}_{h \sim Q} \left[ \ell(h, z_{j}) \right] + \sqrt{\frac{\mathrm{KL} [Q \Vert \pi] + \frac{\ln m}{\delta}}{2(m - 1)}} \right) \ge 1 - \delta.
    \]
</div>

<div class="proof">
    <p>
        We define some notations to ease the proving:
        <ul>
            <li>\(L = \mathbb{E}_{z_{j} \sim D} \left[ \ell(h, z_{j}) \right]\)</li>
            <li>\(\hat{L} = \mathbb{E}_{z_{j} \sim S} \left[ \ell(h, z_{j}) \right] = \frac{1}{m} \sum_{j=1}^{m} \ell(h, z_{j})\)</li>
            <li>\(\Delta L = L - \hat{L}\)</li>
        </ul>
    </p>
    <p>
        Applying Lemma 1 with \(P(h) = \pi (h)\) and \(\phi(h) = 2(m - 1) (\Delta L)^{2}\) gives:
        \[
            2(m - 1) \mathbb{E}_{Q} \left[ (\Delta L)^{2} \right] - \mathrm{KL} [Q \Vert \pi] \le \textcolor{purple}{\ln \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right]}. \tag{1}
        \]
    </p>
    <p>
        We upper-bound the last term in the RHS (highlighted in <span style="color: purple;">purple</span> color) by Lemma 2. To do that, we consider the empirical loss on each observable data point \(l(h, z_{j})\) as a random variable in \([0, 1]\) with true and empirical means \(L\) and \(\hat{L}\), respectively. Following the Hoeffding's inequality gives:
        \[
            \begin{aligned}
                \mathrm{Pr} \left( \Delta L \ge \epsilon \right) & = \mathrm{Pr} \left( L - \hat{L} \ge \epsilon \right)\\
                & \le \mathrm{Pr} \left( | L - \hat{L} | \ge \epsilon \right)\\
                & \le \exp(-2m \epsilon^{2}), \quad \epsilon \ge 0.
            \end{aligned}
        \]
        According to Lemma 2, this implies:
        \[
            \mathbb{E}_{S} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right] \le m.
        \]
        Taking the expectation w.r.t. \(h \sim \pi(h)\) on both sides and applying Fubini's theorem (to interchange the 2 expectations) gives:
        \[
            \begin{aligned}
                & \mathbb{E}_{S} \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right] \le \mathbb{E}_{\pi} \left[ m \right] = m\\
                & \implies \ln \mathbb{E}_{S} \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right] \le \ln m\\
                & \implies \mathbb{E}_{S} \textcolor{purple}{\ln \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right]} \le \ln m.
            \end{aligned}
        \]
        Note that the last implication is due to Jensen's inequality.
    </p>
    <p>
        We then apply Markov's inequality for the term highlighted in <span style="color: purple;">purple</span>:
        \[
            \begin{aligned}
                \mathrm{Pr} \left( \textcolor{purple}{\ln \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right]} \ge \varepsilon \right) & \le \frac{\mathbb{E}_{S} \textcolor{purple}{\ln \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right]}}{\varepsilon} \\
                & \le \frac{\ln m}{\varepsilon}.
            \end{aligned}
        \]
    </p>
    <p>
        This implies:
        \[
            \mathrm{Pr} \left( \textcolor{purple}{\ln \mathbb{E}_{\pi} \left[\exp \left( 2(m - 1) (\Delta L)^{2} \right) \right]} \le \varepsilon \right) \ge 1 - \frac{\ln m}{\varepsilon}. \tag{2}
        \]
    </p>
    <p>
        Combining the results in (1) and (2) gives:
        \[
            \mathrm{Pr} \left( 2(m - 1) \mathbb{E}_{Q} \left[ (\Delta L)^{2} \right] - \mathrm{KL} [Q \Vert \pi] \le \varepsilon \right) \ge 1 - \frac{\ln m}{\varepsilon}.
        \]
    </p>
    <p>
        This is equivalent to:
        \[
            \mathrm{Pr} \left( \mathbb{E}_{Q} \left[ (\Delta L)^{2} \right] \le \frac{\mathrm{KL} [Q \Vert \pi] + \varepsilon}{2(m - 1)} \right) \ge 1 - \frac{\ln m}{\varepsilon}. \tag{3}
        \]
    </p>
    <p>
        Note that squared function is a strictly concave function, resulting in:
        \[
            \mathbb{E}_{Q} \left[ (\Delta L)^{2} \right] \ge \left( \mathbb{E}_{Q} \left[ \Delta L \right] \right)^{2}.
        \]
    </p>
    <p>
        Hence, (3) can be written as:
        \[
            \mathrm{Pr} \left( \mathbb{E}_{Q} \left[ \Delta L \right] \le \sqrt{\frac{\mathrm{KL} [Q \Vert \pi] + \varepsilon}{2(m - 1)}} \right) \ge 1 - \frac{\ln m}{\varepsilon}.
        \]
    </p>
    <p>
        Seting \(\delta = \frac{\ln m}{\varepsilon}\), and expanding \(\Delta L\) according to its definition complete the proof.
    </p>
</div>

## References
1. <a name="mcallester1999" style="text-decoration: none;">McAllester, D.A., 1999, July. PAC-Bayesian model averaging. In *Proceedings of the 12th annual conference on Computational learning theory* (pp. 164-170).</a>
2. <a name="banerjee2006" style="text-decoration: none;">Banerjee, A., 2006, June. On bayesian bounds. In *Proceedings of the 23rd international conference on Machine learning* (pp. 81-88).</a>
3. <a name="ss_bd2014" style="text-decoration: none;">Shalev-Shwartz, S. and Ben-David, S., 2014. *Understanding machine learning: From theory to algorithms*. Cambridge university press.</a>