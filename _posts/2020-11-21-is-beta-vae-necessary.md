---
layout: post
title: "Is beta-VAE necessary?"
comments: true
---
Given the data \\(x\\) and a latent variable \\(z\\), the objective function of a variational auto-encoder (VAE) is to maximize the evidence lower-bound (ELBO) w.r.t. the parameter of the variational distribution \\(q\\). This is equivalent to minimize the variational-free energy (the negative ELBO), which can be written as:
\\[
    \min_{\lambda} \underbrace{\mathbb{E}_{q(z | x, \lambda)} \left[ - \ln p(x | z) \right]}\_{\text{reconstruction}} + \textcolor{red}{\beta}\mathrm{KL} \left[ q(z | x, \lambda) || p(x) \right], \tag{vfe}
\\]
where: \\(\mathrm{KL}[. || .]\\) is the Kullback-Leibler (KL) divergence, and \\(\textcolor{red}{\beta} = 1\\). This loss is also known as the one used in [\\(\beta\\)-VAE](beta vae paper).

Conventionally, one models the reconstruction loss as mean squared error (MSE) or binary cross-entropy loss, then perform gradient descent to minimize the VFE or the objective function. However, simply doing this results in a poor reconstructed images. This leads to a trick that setting \\(\beta \ll 1\\) to obtain sharper reconstructed images. Although this trick is justified by the [\\(\beta\\)-VAE paper](beta vae paper), I think that it is not the right way to do since \\(\beta\\) in that paper is actually the Lagrange multiplier, not a hyper-parameter, and therefore, obtained through the optimization. Of course, setting \\(\beta \ll 1\\) is still mathematically correct since the resultant bound is further lowered (or in other words, looser).

However, it does bother me since the derivation for the ELBO or VFE does not contain anything about \\(\beta\\), so why do we need to weight the KL divergence term? Can we do better without adding \\(\beta\\) into the loss? The answer lies at the normalizing constant of the log-likelihood \\(\ln p(x \vert z)\\), which makes us go back to the linear regression. In the following, I explain the modeling for \\(p(x \vert z)\\) to relate the the VAE loss in (vfe).

<hr>

To be consistent with the notations used, \\(x\\) is the target variable, while \\(z\\) is the input.

## Linear regression with Gaussian noise model
Under this model, the target variable \\(x\\) is given by a deterministic function \\(\hat{x}(\mathbf(z))\\) with additive Gaussian noise, so that:
\\[
    x = \hat{x}(z) + \epsilon,
\\]
where \\(\epsilon\\) is a zero mean Gaussian random variable with precision \\(\Lambda\\). Hence, we can write:
\\[
    p(x \vert z, \Lambda) = \mathcal{N}(x \vert \hat{x}(z), \Lambda^{-1}) = \prod_{n=1}^{N} \mathcal{N}(x_{n} \vert \hat{x}(z_{n}), \Lambda^{-1}).
\\]

The log-likelihood of interest can, therefore, be written as:
\\[
    \ln p(x \vert z, \Lambda) = \frac{N}{2} \ln \Lambda - \frac{N}{2} \ln(2\pi) - \frac{\Lambda}{2} \sum_{n=1}^{N} \underbrace{\left[ x_{n} - \hat{x}(z_{n}) \right]^{2}}\_{\text{MSE}}. \tag{ll-g}
\\]

## Linear regression with continuous Bernoulli noise model
This can also be known as regression in \\([0, 1]\\). Note that the distribution here is the [<em>continuous</em> Bernoulli](continuous bernoulli paper) since we are predicting a continuous value, not \\(\\{0, 1\\}\\) as in classification (corresponding to Bernoulli distribution).

The likelihood of interest, in this case, is modeled as a continuous Bernoulli distribution:
\\[
    p(x \vert z) = \prod_{n=1}^{N} \underbrace{C\left( \hat{x}(z_{n}) \right)}\_{\text{normalizing const.}} \underbrace{\left[ \hat{x}(z_{n}) \right]^{x} \left[ 1 - \hat{x}(z_{n}) \right]^{1 - x}}\_{\text{pdf of Bernoulli distribution}}.
\\]
Note that the continuous Bernoulli distribution has a normalizing constant.

Hence, it is straight-forward to obtain the log-likelihood of interest:
\\[
    \ln p(x \vert z) = \sum_{n=1}^{N} \ln C\left( \hat{x}(z_{n}) \right) + \underbrace{x \ln \hat{x}(z_{n}) + (1 - x) \ln \left[ 1 - \hat{x}(z_{n}) \right]}\_{\text{binary cross-entropy}}. \tag{ll-cb}
\\]

<hr>

When calculating the reconstruction loss for a VAE, we do not include the normalizing constant term(s) and some scaling factors as shown in Eqs. (ll-g) and (ll-cb). Hence, a correct solution would be implemented with the additional terms and factors as presented in the two linear regression models above.

## References
1. Higgins, I., Matthey, L., Pal, A., Burgess, C., Glorot, X., Botvinick, M., Mohamed, S. and Lerchner, A., 2016. beta-vae: Learning basic visual concepts with a constrained variational framework. In International Conference on Learning Representation.
2. Loaiza-Ganem, G. and Cunningham, J.P., 2019. The continuous Bernoulli: fixing a pervasive error in variational autoencoders. In Advances in Neural Information Processing Systems (pp. 13287-13297).

[beta vae paper]: https://openreview.net/forum?id=Sy2fzU9gl
[continuous bernoulli paper]: https://papers.nips.cc/paper/2019/hash/f82798ec8909d23e55679ee26bb26437-Abstract.html