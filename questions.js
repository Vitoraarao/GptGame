(() => {
  'use strict';

  const source = 'Base educativa: Ministério da Saúde e Organização Mundial da Saúde.';
  const questions = [
    {
      id: 'transmissao', title: 'O caminho do parasita', topic: 'Transmissão', location: 'Casas da floresta', type: 'order',
      prompt: 'Como pode acontecer a transmissão pelo barbeiro? Toque nos cartões na ordem dos acontecimentos. Toque novamente em um cartão escolhido para removê-lo da sequência.',
      options: [
        'Fezes com o parasita são depositadas perto da picada',
        'O parasita entra no organismo e a infecção pode ocorrer',
        'Um barbeiro infectado se alimenta do sangue de uma pessoa',
        'As fezes infectadas alcançam pele machucada ou uma mucosa, como os olhos'
      ],
      answer: [2, 0, 3, 1],
      hint: 'Comece pelo barbeiro se alimentando. Depois, pense nas fezes infectadas e na porta de entrada do parasita.',
      explanation: 'Na transmissão vetorial, o Trypanosoma cruzi está nas fezes do barbeiro infectado. Ao coçar ou esfregar a região, a pessoa pode levar essas fezes à pele lesionada ou a uma mucosa. A picada, por si só, não transmite a doença.',
      source
    },
    {
      id: 'outras-vias', title: 'Além do barbeiro', topic: 'Outras vias', location: 'Casas da floresta', type: 'choice',
      prompt: 'Além da transmissão vetorial, qual destas situações pode transmitir a doença de Chagas?',
      options: ['Ingestão de um alimento contaminado pelo parasita', 'Um aperto de mão em uma pessoa infectada', 'Picada de um mosquito comum'],
      answer: 0,
      hint: 'O parasita também pode chegar ao organismo pela ingestão. Contato social comum não transmite a doença.',
      explanation: 'A transmissão oral pode ocorrer pela ingestão de alimentos contaminados com o parasita. Também existem outras vias, como transmissão da gestante para o bebê, transfusão e transplante. Aperto de mão e convívio social não transmitem Chagas.',
      source
    },
    {
      id: 'sinal-clinico', title: 'Uma pista no olhar', topic: 'Sinal clínico', location: 'Caminho da descoberta', type: 'choice',
      prompt: 'Qual sinal pode aparecer na fase aguda quando a porta de entrada do parasita é a conjuntiva, nos olhos?',
      options: ['Sinal de Romaña: inchaço de uma das pálpebras, geralmente sem dor', 'Icterícia obrigatória em todas as pessoas infectadas', 'Dor lombar isolada que confirma o diagnóstico'],
      answer: 0,
      hint: 'O nome desse sinal está associado a um inchaço palpebral de um lado do rosto.',
      explanation: 'O sinal de Romaña é um edema palpebral unilateral, geralmente indolor, que pode ocorrer na fase aguda. Ele não aparece em todos os casos e não confirma o diagnóstico sozinho.',
      source
    },
    {
      id: 'caso', title: 'Investigar antes de concluir', topic: 'O caso', location: 'Posto de investigação', type: 'choice',
      prompt: 'Um bebê apresenta febre e inchaço em uma pálpebra. Qual é a melhor conduta da equipe de saúde?',
      options: ['Confirmar Chagas apenas pelo inchaço', 'Investigar a história epidemiológica, examinar a criança e solicitar os exames apropriados', 'Descartar Chagas porque a pessoa é uma criança'],
      answer: 1,
      hint: 'Uma boa investigação reúne o contexto, a avaliação clínica e os exames. Um sinal isolado não basta.',
      explanation: 'É preciso integrar história epidemiológica, exame clínico e exames apropriados. A doença pode ocorrer em crianças, inclusive por transmissão da gestante para o bebê. O sinal isolado não permite concluir a causa.',
      source
    },
    {
      id: 'diagnostico', title: 'A evidência no sangue', topic: 'Diagnóstico', location: 'Caminho do laboratório', type: 'choice',
      prompt: 'Na fase aguda da doença de Chagas, qual estratégia laboratorial costuma ser especialmente útil?',
      options: ['Pesquisar diretamente o parasita no sangue', 'Usar somente um eletrocardiograma para confirmar a infecção', 'Usar uma radiografia de tórax como teste confirmatório'],
      answer: 0,
      hint: 'Na fase aguda, costuma haver mais parasitas circulando no sangue.',
      explanation: 'Na fase aguda, a parasitemia costuma ser maior e os métodos parasitológicos diretos têm papel importante. Na fase crônica, a investigação geralmente envolve testes sorológicos. A escolha dos exames cabe à equipe de saúde.',
      source
    },
    {
      id: 'prevencao', title: 'Cuidar de toda a comunidade', topic: 'Prevenção e políticas públicas', location: 'Comunidade e saúde', type: 'choice',
      prompt: 'Qual conjunto de ações individuais e de políticas públicas ajuda a prevenir a doença de Chagas?',
      options: ['Depender somente do uso de repelente, sem ações coletivas', 'Melhorar moradias, manter a vigilância dos barbeiros, promover alimentos seguros e fazer a triagem de sangue e órgãos doados', 'Isolar pessoas infectadas e evitar apertos de mão'],
      answer: 1,
      hint: 'Pense em condições de moradia, vigilância em saúde, segurança dos alimentos e serviços públicos.',
      explanation: 'A prevenção combina moradia adequada, vigilância e controle vetorial por equipes capacitadas, segurança dos alimentos e triagem de doações. O SUS também oferece diagnóstico, tratamento e acompanhamento. Ao encontrar um possível barbeiro, não toque nele: procure a vigilância em saúde local.',
      source
    },
    {
      id: 'tratamento', title: 'Da descoberta ao cuidado', topic: 'Tratamento', location: 'Laboratório e cuidado', type: 'choice',
      prompt: 'Qual afirmação descreve corretamente o tratamento da doença de Chagas?',
      options: ['Benznidazol ou nifurtimox podem ser indicados pela equipe de saúde; o tratamento precoce tem maior chance de cura', 'Qualquer antibiótico cura a infecção, sem avaliação médica', 'Todas as pessoas deixam de precisar de acompanhamento após o tratamento'],
      answer: 0,
      hint: 'O momento do tratamento importa, e a indicação precisa considerar a fase da doença e cada pessoa.',
      explanation: 'O tratamento antiparasitário deve ser indicado e acompanhado pela equipe de saúde. A chance de cura é maior nas fases iniciais. Na fase crônica, a indicação é individualizada; problemas cardíacos ou digestivos também precisam de cuidado. Não se automedique.',
      source
    },
    {
      id: 'conclusao', title: 'Um nome para a descoberta', topic: 'Conclusão', location: 'Laboratório', type: 'choice',
      prompt: 'Qual é o agente causador da doença de Chagas?',
      options: ['Leishmania braziliensis', 'Trypanosoma cruzi', 'Plasmodium vivax'],
      answer: 1,
      hint: 'É um protozoário cujo nome homenageia Oswaldo Cruz.',
      explanation: 'Trypanosoma cruzi é o protozoário causador da doença de Chagas. Seu caderno agora conecta transmissão, investigação, prevenção e tratamento. O combate da fase final é uma fantasia do jogo: o cuidado real acontece com a equipe de saúde.',
      source
    }
  ];

  class QuizPanel {
    constructor({ onSolved = () => {}, onClose = () => {} } = {}) {
      this.onSolved = onSolved;
      this.onClose = onClose;
      this.isOpen = false;
      this.index = -1;
      this.order = [];
      this.selection = null;
      this.verified = false;
      this.nodes = {};
      for (const name of ['dialog', 'meta', 'location', 'title', 'prompt', 'options', 'order', 'feedback', 'source', 'hint', 'undo', 'reset', 'check', 'close']) {
        const node = document.getElementById(`quiz-${name}`);
        if (!node) throw new Error(`Elemento necessário ao quiz não encontrado: quiz-${name}`);
        this.nodes[name] = node;
      }
      this.nodes.feedback.setAttribute('aria-live', 'polite');
      this.nodes.close.addEventListener('click', () => this.close());
      this.nodes.dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); });
      this.nodes.dialog.addEventListener('close', () => this.finishClose());
      this.nodes.hint.addEventListener('click', () => {
        if (!this.verified) this.feedback(this.question.hint);
      });
      this.nodes.undo.addEventListener('click', () => {
        if (this.verified) return;
        this.order.pop();
        this.feedback('');
        this.renderOptions();
      });
      this.nodes.reset.addEventListener('click', () => {
        if (this.verified) return;
        this.order = [];
        this.selection = null;
        this.feedback('');
        this.renderOptions();
      });
      this.nodes.check.addEventListener('click', () => this.check());
    }

    get question() { return questions[this.index]; }

    open(index, review = false) {
      if (!Number.isInteger(index) || !questions[index]) return;
      this.index = index;
      this.verified = Boolean(review);
      this.order = review && this.question.type === 'order' ? [...this.question.answer] : [];
      this.selection = review && this.question.type === 'choice' ? this.question.answer : null;
      const q = this.question;
      this.nodes.meta.textContent = `INVESTIGAÇÃO ${index + 1} / ${questions.length} · SELO DE CONHECIMENTO`;
      this.nodes.location.textContent = q.location;
      this.nodes.title.textContent = q.title;
      this.nodes.prompt.textContent = q.prompt;
      this.nodes.source.textContent = q.source;
      this.nodes.check.textContent = review ? 'Voltar à expedição →' : 'Verificar resposta →';
      this.nodes.hint.disabled = Boolean(review);
      this.feedback(review ? q.explanation : '', review ? 'correct' : '');
      this.renderOptions();
      this.isOpen = true;
      if (!this.nodes.dialog.open) this.nodes.dialog.showModal();
      this.nodes.dialog.scrollTop = 0;
    }

    close() {
      if (!this.isOpen) return;
      if (this.nodes.dialog.open) this.nodes.dialog.close();
      this.finishClose();
    }

    finishClose() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.onClose();
    }

    feedback(text, state = '') {
      this.nodes.feedback.textContent = text;
      this.nodes.feedback.hidden = !text;
      this.nodes.feedback.classList.remove('correct', 'incorrect');
      if (state) this.nodes.feedback.classList.add(state);
    }

    renderOptions(focusIndex = null) {
      const q = this.question;
      const ordered = q.type === 'order';
      this.nodes.options.replaceChildren();
      q.options.forEach((text, index) => {
        const position = this.order.indexOf(index);
        const selected = ordered ? position >= 0 : this.selection === index;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option' + (selected ? ' selected' : '') + (selected && this.verified ? ' correct' : '');
        button.disabled = this.verified;
        button.setAttribute('aria-pressed', String(selected));
        if (ordered) button.setAttribute('aria-label', `${selected ? `Etapa ${position + 1}. ` : ''}${text}${selected && !this.verified ? '. Toque para remover da sequência.' : ''}`);
        const number = document.createElement('span');
        number.className = 'option-number';
        number.setAttribute('aria-hidden', 'true');
        number.textContent = ordered ? (selected ? String(position + 1) : '+') : String.fromCharCode(65 + index);
        const label = document.createElement('span');
        label.textContent = text;
        button.append(number, label);
        button.addEventListener('click', () => {
          if (this.verified) return;
          if (ordered) {
            const oldPosition = this.order.indexOf(index);
            if (oldPosition >= 0) this.order.splice(oldPosition, 1);
            else this.order.push(index);
          } else this.selection = index;
          this.feedback('');
          this.renderOptions(index);
        });
        this.nodes.options.append(button);
      });
      this.nodes.order.replaceChildren();
      this.nodes.order.hidden = !ordered || this.order.length === 0;
      if (ordered) this.order.forEach((optionIndex, position) => {
        const line = document.createElement('div');
        line.className = 'order-line';
        line.textContent = `${position + 1}. ${q.options[optionIndex]}`;
        this.nodes.order.append(line);
      });
      this.nodes.undo.hidden = !ordered;
      this.nodes.reset.hidden = !ordered;
      this.nodes.undo.disabled = this.verified || this.order.length === 0;
      this.nodes.reset.disabled = this.verified || this.order.length === 0;
      if (focusIndex !== null) this.nodes.options.children[focusIndex]?.focus();
    }

    check() {
      if (this.verified) { this.close(); return; }
      const q = this.question;
      if (q.type === 'order' && this.order.length !== q.options.length) {
        this.feedback('Escolha os quatro cartões para completar a sequência antes de verificar.', 'incorrect');
        return;
      }
      if (q.type === 'choice' && this.selection === null) {
        this.feedback('Escolha uma alternativa antes de verificar.', 'incorrect');
        return;
      }
      const correct = q.type === 'order' ? q.answer.every((answer, i) => this.order[i] === answer) : this.selection === q.answer;
      if (!correct) {
        this.feedback(q.type === 'order'
          ? 'Ainda não é essa a sequência. Comece pelo barbeiro se alimentando; em seguida, acompanhe as fezes infectadas até a porta de entrada. Use Desfazer, Recomeçar ordem ou toque em um cartão escolhido para ajustar.'
          : 'Ainda não. Você pode escolher outra alternativa e tentar novamente. Use “Ver uma pista” se precisar.', 'incorrect');
        return;
      }
      this.verified = true;
      this.feedback('Descoberta registrada! ' + q.explanation, 'correct');
      this.nodes.check.textContent = 'Continuar expedição →';
      this.nodes.hint.disabled = true;
      this.renderOptions();
      this.onSolved(this.index);
    }
  }

  window.ChagasQuestions = questions;
  window.QuizPanel = QuizPanel;
})();
