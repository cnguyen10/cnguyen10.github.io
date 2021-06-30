---
layout: post
title: "Meta-learning: a cross-validation perspective"
comments: true
---
The purpose of this post is to present the mathematical formulation of meta-learning through the lense of cross-validation (also known as hyper-parameter optimization). In this perspective, meta-learning can be considered as a bi-level optimization that finds the local-optimal meta-parameter (or hyper-parameter) shared across all tasks. Such understanding also explains the intuition of several existing meta-learning algorithms and allows to differentiate meta-learning from other transfer learning techniques.

Before formulating the objective for meta-learning, it is essential to introduce some terminologies and re-formulate cross-validation in sample-based learning.

<section>
    <h2 class="number-heading">Task and task environment</h2>
    <div class="definition">
        A task or a task instance \(\mathcal{T}_{i}\) consists of an associated dataset \(\mathcal{D}_{i} = \{\mathbf{x}_{ij}, \mathbf{y}_{ij}\}_{j=1}^{m}\), where \(\mathbf{x}_{ij} \in \mathbb{X} \subseteq \mathbb{R}^{\mathcal{X}}\) is the data instance and \(\mathbf{y}_{ij} \in \mathbb{Y} \subseteq \mathbb{R}^{\mathcal{Y}}\) is the corresponding label, and a loss function \(\ell\):
        \[
            \mathcal{T}_{i} = \{\mathcal{D}_{i}, \ell\}.
        \]
    </div>
    <div>
        To solve a task \(\mathcal{T}_{i}\), one needs to obtain an optimal task-specific model, denoted as \(\mathbf{w}^{*}_{i} \in \mathbb{W} \subseteq \mathbb{R}^{\mathcal{W}}\), that minimises a loss function \(\ell\) on the associated dataset of that task:
        \[
            \mathbf{w}^{*}_{i} = \arg\min_{\mathbf{w}_{i}} \mathbb{E}_{(\mathbf{x}_{ij}, \mathbf{y}_{ij}) \sim \mathcal{D}_{i}} \left[ \ell(\mathbf{x}_{ij}, \mathbf{y}_{ij}; \mathbf{w}_{i}) \right]. \tag{task-objective}
        \]
    </div>
    <div class="definition">
        A task environment or a task family, \(p(\mathcal{T})\), is a latent distribution that generates task instances.
    </div>
    <div>
        Some common task families are classification where each task instance is a classification problem (e.g. cat versus dog, or Image-Net classification), regression or face recognition.
    </div>
    <div>
        In task-based learning, the model of interest is assumed to have access to many related learning task instances that belong to a same task family, instead of facing a single learning task instance as in sample-based learning. The learning, therefore, occurs at a higher level and hence, requires additional techniques to infer such model. This results in different transfer learning approaches, such as multi-task learning, continual learning, domain adaptation and of course, meta-learning.
    </div>
</section>

<section>
    <h2 class="number-heading">Cross-validation in sample-based learning</h2>
    <div>
        In sample-based learning, cross-validation on task \(\mathcal{T}_{i}\) is used to *tune* some hyper-parameters, such as learning rate, mini-batch size or model initialization. To perform cross-validation, the associated dataset \(\mathcal{D}_{i}\) of task \(\mathcal{T}_{i}\) is split into 2 subsets:
        <ul>
            <li><em>Training</em> (or <em>support</em>) subset \(\mathcal{D}_{i}^{(t)} = \{\mathbf{x}_{ij}^{(t)}, \mathbf{y}_{ij}^{(t)}\}_{j=1}^{m_{i}^{(t)}}\),</li>
            <li><em>Validation</em> (or <em>query</em>) subset which is similarly defined.</li>
        </ul>
    </div>
    <div>
        Note that with this definition, \(m_{i}^{(t)} + m_{i}^{(v)} = m_{i}\).
    </div>
    <div>
        The cross-validation is then carried out by validating the hyper-parameter of interest, \(\theta\), on the validation subset, \(\mathcal{D}_{i}^{(v)}\), using the model trained on the training subset, \(\mathcal{D}_{i}^{(t)}\). In this point of view, the cross-validation can be formulated as a bi-level optimisation:
    </div>
    <div>
    \[
        \begin{aligned}
            & \theta^{*} = \arg\min_{\lambda} \mathbb{E}_{\mathbf{x}_{ij}^{(v)}, \mathbf{y}_{ij}^{(v)} \sim \mathcal{D}_{i}^{(v)}} \left[ \ell \left( \mathbf{x}_{ij}^{(v)}, \mathbf{y}_{ij}^{(v)}; \mathbf{w}_{i}^{*}(\theta) \right) \right]\\
            & \text{s.t.: } \mathbf{w}^{*}_{i}(\theta) = \arg\min_{\mathbf{w}_{i}} \mathbb{E}_{\mathbf{x}_{ij}^{(t)}, \mathbf{y}_{ij}^{(t)} \sim \mathcal{D}_{i}^{(t)}} \left[ \ell \left( \mathbf{x}_{ij}^{(t)}, \mathbf{y}_{ij}^{(t)}; \mathbf{w}_{i}(\theta) \right) \right].
        \end{aligned}
        \tag{cross-validation}
    \]
    </div>
</section>

<section>
    <h2 class="number-heading">Meta-learning extends cross-validation</h2>
    <div>
        Meta-learning extends the cross-validation in sample-based learning by considering the shared hyper-parameters as meta-parameters, denoted as \(\theta\), and infer \(\theta\) through several training task instances. Hence, meta-learning can also be formulated as a bi-level optimisation as:
        \[
            \begin{aligned}
                & \theta^{*} = \arg\min_{\theta} \htmlStyle{color: red;}{\mathbb{E}_{\mathcal{T}_{i} \sim p(\mathcal{T})}} \mathbb{E}_{\mathbf{x}_{ij}^{(v)}, \mathbf{y}_{ij}^{(v)} \sim \mathcal{D}_{i}^{(v)}} \left[ \ell \left( \mathbf{x}_{ij}^{(v)}, \mathbf{y}_{ij}^{(v)}; \mathbf{w}_{i}^{*}(\theta) \right) \right]\\
                & \text{s.t.: } \mathbf{w}^{*}_{i}(\theta) = \arg\min_{\mathbf{w}_{i}} \mathbb{E}_{\mathbf{x}_{ij}^{(t)}, \mathbf{y}_{ij}^{(t)} \sim \mathcal{D}_{i}^{(t)}} \left[ \ell \left( \mathbf{x}_{ij}^{(t)}, \mathbf{y}_{ij}^{(t)}; \mathbf{w}_{i}(\theta) \right) \right], \htmlStyle{color: red;}{\forall i \in \{1, \ldots, T\}}.
            \end{aligned}
            \tag{meta-learning}
        \]
    </div>
    <div>
        Note that for a training task \(\mathcal{T}_{i}, i \in \{1, \ldots, T\}\), both data subsets \(\mathcal{D}_{i}^{(t)}\) and \(\mathcal{D}_{i}^{(v)}\) have labels, while for the testing task \(\mathcal{T}_{T + 1}\), only \(\mathcal{D}_{T + 1}^{(t)}\) has labels.
    </div>
    <div>
        As being defined as the extension of cross-validation, meta-parameters can, therefore, be chosen as either:
        <ul>
            <li><em>learning rate</em> of task-adaptation step (the lower level) to learn \(\mathbf{w}_{i}^{*} \left(\theta\right)\) <a href="#li2017meta">(Li et al. 2017)</a>,</li>
            <li><em>initialisation</em> of model parameter<a href="#finn2017model">(Finn et al. 2017)</a>,</li>
            <li><em>data representation</em> or <em>feature extractor</em>(<a href="#vinyals2016matching">Vinyal et al. 2016</a>, <a href="#snell2017prototypical">Snell et al. 2017</a>),</li>
            <li><em>optimiser</em> for the task-adaptation in the lower-level (<a href="#andrychowicz2016learning">Andrychowicz et al. 2016</a>, <a href="#li2017learning">Li et al. 2017</a>).</li>
        </ul>
    </div>
</section>

<section>
    <h2 class="number-heading">Differentiation with other transfer learning approaches</h2>
    <div>
        Given the definition of meta-learning in \sectionautorefname~\ref{sec:meta_learning}, it is often a source of confusion to differentiate meta-learning from other transfer learning approaches. In this section, some popular transfer learning methods are described with their objective function formulated to purposely distinguish from meta-learning.
    </div>
    <section>
        <h3 class="number-heading">Fine-tuning</h3>
        <div>
            Fine-tuning is the most common technique in neural network based transfer learning (<a href="#pratt1991direct">Pratt et al. 1999</a>, <a href="#yosinski2014transferable">Yosinski et al. 2014</a>). Fine-tuning is often carried out by pre-training a neural network on a source task, and replacing the last or a few last layers and fine-tuning those layers on the target task. Formally, if \(f(.; \mathbf{w}_{0})\) is denoted as the forward function of the shared layers with shared parameters \(\mathbf{w}_{0}\), and \(\mathbf{w}_{s}\) and \(\mathbf{w}_{t}\) as the parameters of the few last layers trained on source and target tasks, then the objective of fine-tuning can be expressed as:
            \[
                \begin{aligned}
                    & \min_{\mathbf{w}_{t}} \mathbb{E}_{\mathbf{x}_{t}, \mathbf{y}_{t}} \left[ \ell \left( f\left( \mathbf{x}_{t}; \mathbf{w}_{0}^{*} \right), \mathbf{y}_{t}; \mathbf{w}_{t} \right) \right] \\
                    & \text{s.t.: } \mathbf{w}_{0}^{*}, \mathbf{w}_{s}^{*} = \arg\min_{\mathbf{w}_{0}, \mathbf{w}_{s}} \mathbb{E}_{\mathbf{x}_{s}, \mathbf{y}_{s}} \left[ \ell \left( f\left( \mathbf{x}_{s}; \mathbf{w}_{0} \right), \mathbf{y}_{s}; \mathbf{w}_{s} \right) \right].
                \end{aligned}
                \tag{fine-tuning}
            \]
            Comparing to the objective of meta-learning in (meta_learning), the objective function of fine-tuning in \eqref{eq:fine_tuning_formulation} is a constrained optimisation which is much easier to solve. Due to the simplicity optimising on a single training task, fine-tuning requires a decent number of training examples on the target tasks to fine-tune \(\mathbf{w}_{t}\). In contrast, meta-learning works on several training tasks, and can quickly adapt to a new task with only a few training examples.
        </div>
    </section>
    <section>
        <h3 class="number-heading">Domain adaptation</h3>
        <div>
            Domain adaptation or domain-shift refers to the case when the joint data-label distribution on source and target are different, denoted as \(p_{s}(\mathbf{x}, \mathbf{y}) \neq p_{t}(\mathbf{x}, \mathbf{y})\) (<a href="#heckman1979sample">Heckman 1979</a>, <a href="#shimodaira2000improving">Shimodaira 2000</a>, <a href="#japkowicz2002class">Japkowicz et al. 2002</a>, <a href="#daume2006domain">Daume et al. 2006</a>, <a href="#ben2007analysis">Ben-David et al. 2007</a>). There are two special situations that are well studied in the literature:
            <ul>
                <li><em>class imbalance</em>: \(p_{s} (\mathbf{x} | \mathbf{y}) = p_{t} (\mathbf{x} | \mathbf{y})\), but \(p_{s}(\mathbf{y}) \neq p_{t}(\mathbf{y})\), and</li>
                <li><em>covariate shift</em>: \(p_{s} (\mathbf{y} | \mathbf{x}) = p_{t} (\mathbf{y} | \mathbf{x})\), but \(p_{s} (\mathbf{x}) \neq p_{t} (\mathbf{x})\).</li>
            </ul>
            The aim of domain adaptation is to leverage the model trained on source domain to the un-labelled data in the target domain, so that the model adapted to the target domain can perform reasonably well. This differentiates domain adaptation from meta-learning since meta-learning does not have access to any un-labelled data of testing tasks during training. In general, meta-learning learns shared prior or hyper-parameters to generalise for unseen tasks, while domain adaptation produces a model to solve a particular task in a specified target domain. Recently, there is a variance of domain adaptation, named \textbf{domain generalisation}, where the aim is to learn a domain-invariant model without any information of target domain. In this view, domain generalisation is very similar to meta-learning, and there are some works that employ meta-learning algorithms for domain generalisation (<a href="#li2018learning">Li et al. 2018</a>, <a href="#li2019feature">Li et al. 2019</a>).
        </div>
    </section>
    <section>
        <h3 class="number-heading">Multi-task learning</h3>
        <div>
            Multi-task learning learns several related auxiliary tasks and a target task simultaneously to exploit the diversity of task representation to regularise and improve the performance on the main task (<a href="#caruana1997multitask">Caruana 1997</a>). If the input \(\mathbf{x}\) is assumed to be the same across \(T\) extra tasks and the target task \(\mathcal{T}_{t + 1}\), then the objective of multi-task learning can be expressed as:
            \[
                \min_{\phi, \mathbf{w}_{i}} \mathbb{E}_{\mathbf{x}, \mathbf{y}_{i}} \left[ \ell_{i} \left( f\left( \mathbf{x}; \phi \right), \mathbf{y}_{i}; \mathbf{w}_{i} \right) \right], ~ \forall i \in \{1, \ldots, T + 1\},
                \tag{multitask-learning}
            \]
            where \(\mathbf{y}_{i}\) and \(\ell_{i}\) are the label and loss function for task \(\mathcal{T}_{i}\), respectively, and \(\phi\) denoted as the parameters of the shared model.
        </div>
        <div>
            Although multi-task learning is often confused with meta-learning due to their similar nature extracting information from many tasks. However, the objective function of multi-task learning in \eqref{eq:mtl_formulation} consisting of multiple optimisation with shared variable \(\phi\), not as complicated as a bi-level optimisation seen in meta-learning as shown in \eqref{eq:meta_learning_bilevel_optimisation}. Furthermore, multi-task learning aims to solve a number of specific tasks known during training (referred as target tasks), while meta-learning points to generalise for unseen tasks in the future.
        </div>
    </section>
    <section>
        <h3 class="number-heading">Continual learning</h3>
        <div>
            Continual (or <em>life-long learning</em>) refers to a situation where a learning agent has access to a continuous stream of tasks available over time, and the number of tasks to be learnt is not pre-defined (<a href="#chen2018lifelong">Chen et al. 2018</a>, <a href="#parisi2019continual">Parisi et al. 2019</a>). The aim is to accommodate the knowledge extracting from one-time observed tasks to accelerate learning new tasks without catastrophically forgetting old tasks (<a href="#french1999catastrophic">French 1999</a>). In this sense, continual learning is very similar to meta-learning. However, continual learning most likely focuses on systematic design to acquire new knowledge in such a way that prevents interfering to the existing one, while meta-learning is more about algorithmic design to learn the new knowledge more efficiently. Nevertheless, continual learning criteria, especially catastrophic forgetting, can be encoded into meta-learning objective to advance further continual learning performance (<a href="#al2018continuous">Al-Shedivat et al. 2018</a>, <a href="#nagabandi2019learning">Nagabandi et al. 2019</a>).
        </div>
    </section>
</section>

<section>
    <h2>References</h2>
    <div>
        <!-- <ul style="list-style-type: none; padding-left: 0;"> -->
        <ol style="padding-left: 1.5em;">
            <li><a name="al2018continuous" style="text-decoration: none;">Al-Shedivat, M., Bansal, T., Burda, Y., Sutskever, I., Mordatch, I. and Abbeel, P., 2018. <i>Continuous adaptation via meta-learning in nonstationary and competitive environments</i>. International conference on learning representation.</a></li>
            <li><a name="andrychowicz2016learning" style="text-decoration: none;">Andrychowicz, M., Denil, M., Gomez, S., Hoffman, M.W., Pfau, D., Schaul, T., Shillingford, B. and De Freitas, N., 2016. Learning to learn by gradient descent by gradient descent. In Advances in neural information processing systems (pp. 3981-3989).</a></li>
            <li><a name="ben2007analysis" style="text-decoration: none;">Ben-David, S., Blitzer, J., Crammer, K. and Pereira, F., 2007. <i>Analysis of representations for domain adaptation</i>. Advances in neural information processing systems, 19, p.137.</a></li>
            <li><a name="caruana1997multitask" style="text-decoration: none;">Caruana, R., 1997. <i>Multitask learning</i>. Machine learning, 28(1), pp.41-75.</a></li>
            <li><a name="chen2018lifelong" style="text-decoration: none;">Chen, Z. and Liu, B., 2018. <i>Lifelong machine learning</i>. Synthesis Lectures on Artificial Intelligence and Machine Learning, 12(3), pp.1-207.</a></li>
            <li><a name="daume2006domain" style="text-decoration: none;">Daume III, H. and Marcu, D., 2006. <i>Domain adaptation for statistical classifiers</i>. Journal of artificial Intelligence research, 26, pp.101-126.</a></li>
            <li><a name="finn2017model" style="text-decoration: none;">Finn, C., Abbeel, P. and Levine, S., 2017, July. <i>Model-agnostic meta-learning for fast adaptation of deep networks</i>. In International Conference on Machine Learning (pp. 1126-1135). PMLR.</a></li>
            <li><a name="french1999catastrophic" style="text-decoration: none;">French, R.M., 1999. <i>Catastrophic forgetting in connectionist networks</i>. Trends in cognitive sciences, 3(4), pp.128-135.</a></li>
            <li><a name="heckman1979sample" style="text-decoration: none;">Heckman, J.J., 1979. <i>Sample selection bias as a specification error</i>. Econometrica: Journal of the econometric society, pp.153-161.</a></li>
            <li><a name="japkowicz2002class" style="text-decoration: none;">Japkowicz, N. and Stephen, S., 2002. <i>The class imbalance problem: A systematic study</i>. Intelligent data analysis, 6(5), pp.429-449.</a></li>
            <li><a name="li2017learning" style="text-decoration: none;">Li, K. and Malik, J., 2017. <i>Learning to optimize</i>. International conference on learning representation.</a></li>
            <li><a name="li2017meta" style="text-decoration: none;">Li, Z., Zhou, F., Chen, F. and Li, H., 2017. <i>Meta-sgd: Learning to learn quickly for few-shot learning</i>. arXiv preprint arXiv:1707.09835.</a></li>
            <li><a name="li2018learning" style="text-decoration: none;">Li, D., Yang, Y., Song, Y.Z. and Hospedales, T.M., 2018, April. <i>Learning to generalize: Meta-learning for domain generalization</i>. In AAAI Conference on Artificial Intelligence.</a></li>
            <li><a name="li2019feature" style="text-decoration: none;">Li, Y., Yang, Y., Zhou, W. and Hospedales, T., 2019, May. <i>Feature-critic networks for heterogeneous domain generalization</i>. In International Conference on Machine Learning (pp. 3915-3924). PMLR.</a></li>
            <li><a name="nagabandi2019learning" style="text-decoration: none;">Nagabandi, A., Clavera, I., Liu, S., Fearing, R.S., Abbeel, P., Levine, S. and Finn, C., 2019. <i>Learning to adapt in dynamic, real-world environments through meta-reinforcement learning</i>. International conference on learning representation.</a></li>
            <li><a name="parisi2019continual" style="text-decoration: none;">Parisi, G.I., Kemker, R., Part, J.L., Kanan, C. and Wermter, S., 2019. <i>Continual lifelong learning with neural networks: A review</i>. Neural Networks, 113, pp.54-71.</a></li>
            <li><a name="pratt1991direct" style="text-decoration: none;">Pratt, L.Y., Mostow, J., Kamm, C.A. and Kamm, A.A., 1991, July. <i>Direct Transfer of Learned Information Among Neural Networks</i>. In AAAI (Vol. 91, pp. 584-589).</a></li>
            <li><a name="shimodaira2000improving" style="text-decoration: none;">Shimodaira, H., 2000. <i>Improving predictive inference under covariate shift by weighting the log-likelihood function</i>. Journal of statistical planning and inference, 90(2), pp.227-244.</a></li>
            <li><a name="snell2017prototypical" style="text-decoration: none;">Snell, J., Swersky, K. and Zemel, R.S., 2017. <i>Prototypical networks for few-shot learning</i>. Advances in neural information processing systems.</a></li>
            <li><a name="vinyals2016matching" style="text-decoration: none;">Vinyals, O., Blundell, C., Lillicrap, T. and Wierstra, D., 2016. <i>Matching networks for one shot learning</i>. Advances in neural information processing systems, 29, pp.3630-3638.</a></li>
            <li><a name="yosinski2014transferable" style="text-decoration: none;">Yosinski, J., Clune, J., Bengio, Y. and Lipson, H., 2014. <i>How transferable are features in deep neural networks?</i>. Advances in neural information processing systems.</a></li>
        <!-- </ul> -->
        </ol>
    </div>
</section>
<br />