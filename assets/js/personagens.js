/* Galeria de fichas (personagens/ e bestiario/): troca o card visivel,
   sincroniza o cartao selecionado e a URL, setas, teclado e deslize.
   Se a pagina tiver .pers-grupo (classes do bestiario), filtra o
   carrossel pelo grupo ativo; o botao com data-grupo="" mostra todos. */
(function () {
  var main = document.querySelector('main.best, main#personagens');
  var avatares = Array.prototype.slice.call(document.querySelectorAll('.pers-avatar'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.pers-card'));
  var grupos = Array.prototype.slice.call(document.querySelectorAll('.pers-grupo'));
  if (!avatares.length || !cards.length) return;

  var PARAM = (main && main.getAttribute('data-param')) || 'p';
  var slugs = cards.map(function (c) { return c.getAttribute('data-slug'); });
  var grupoDe = cards.map(function (c) { return c.getAttribute('data-grupo'); });
  var atual = -1;
  var grupoAtual = null;

  function visiveis() {
    var v = [];
    for (var k = 0; k < slugs.length; k++) {
      if (!grupoAtual || grupoDe[k] === grupoAtual) v.push(k);
    }
    return v;
  }

  function mostrar(i, gravarUrl) {
    var v = visiveis();
    if (v.indexOf(i) === -1) i = v[0];
    if (i === atual) return;
    atual = i;
    cards.forEach(function (c, k) {
      c.classList.toggle('on', k === i);
      fecharFicha(c);
    });
    avatares.forEach(function (a, k) {
      a.classList.toggle('on', k === i);
      a.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    /* centraliza o cartao ativo na lista, sem rolar a pagina */
    var ativo = avatares[i];
    var lista = ativo && ativo.closest('.pers-lista');
    if (lista) {
      var alvo = ativo.offsetLeft - (lista.clientWidth - ativo.offsetWidth) / 2;
      if (lista.scrollTo) lista.scrollTo({ left: alvo, behavior: gravarUrl === false ? 'auto' : 'smooth' });
      else lista.scrollLeft = alvo;
    }
    if (gravarUrl !== false && window.history && history.replaceState) {
      history.replaceState(null, '', window.location.pathname + '?' + PARAM + '=' + slugs[i]);
    }
  }

  /* arte em pe (personagens/): no celular a ficha fica recolhida, so com o
     nome, e abre por cima da arte ao tocar no botao */
  var retrato = main && main.classList.contains('retrato');

  function fecharFicha(card) {
    var b = card.querySelector('.pers-abrir');
    if (!b) return;
    card.classList.remove('aberta');
    b.setAttribute('aria-expanded', 'false');
    b.textContent = 'Ver ficha';
  }

  if (retrato) {
    cards.forEach(function (card) {
      var ficha = card.querySelector('.pers-ficha');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pers-abrir';
      ficha.insertBefore(b, ficha.querySelector('dl'));
      fecharFicha(card);
      b.addEventListener('click', function () {
        if (card.classList.contains('aberta')) return fecharFicha(card);
        card.classList.add('aberta');
        b.setAttribute('aria-expanded', 'true');
        b.textContent = 'Fechar';
      });
      card.querySelector('.pers-arte').addEventListener('click', function () { fecharFicha(card); });
    });
  }

  function passo(dir) {
    var v = visiveis();
    var pos = v.indexOf(atual);
    var prox = v[(pos + dir + v.length) % v.length];
    mostrar(prox);
  }

  function escolherGrupo(g, manterAtual) {
    grupoAtual = g;
    grupos.forEach(function (b) {
      var on = (b.getAttribute('data-grupo') || null) === g;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    avatares.forEach(function (a, k) {
      var li = a.parentNode;
      li.hidden = !!g && grupoDe[k] !== g;
    });
    var v = visiveis();
    if (!manterAtual || v.indexOf(atual) === -1) {
      atual = -1;
      mostrar(v[0], manterAtual !== 'inicio');
    }
  }

  avatares.forEach(function (a, k) {
    a.addEventListener('click', function () { mostrar(k); });
  });
  grupos.forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-grupo') || null;
      /* "ver todos" mantem a criatura que ja esta no palco */
      escolherGrupo(g, !g);
    });
  });

  var ant = document.querySelector('.pers-seta--ant');
  var prox = document.querySelector('.pers-seta--prox');
  if (ant) ant.addEventListener('click', function () { passo(-1); });
  if (prox) prox.addEventListener('click', function () { passo(1); });

  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') passo(-1);
    if (e.key === 'ArrowRight') passo(1);
  });

  /* deslize no celular */
  var palco = document.querySelector('.pers-palco');
  var x0 = null;
  if (palco) {
    palco.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 50) return;
      passo(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* estado inicial: ?param=slug ou o primeiro item */
  var pedido = (window.location.search.match(new RegExp('[?&]' + PARAM + '=([a-z0-9-]+)')) || [])[1];
  var inicial = slugs.indexOf(pedido);
  if (inicial < 0) inicial = 0;
  if (grupos.length) {
    escolherGrupo(null, 'inicio');
    atual = -1;
  }
  mostrar(inicial, false);
})();
