/* Carrossel de fichas (personagens/ e bestiario/).
   Mostra a placa ativa no meio, com até duas vizinhas de cada lado,
   e abre a ficha correspondente. Setas do teclado, filtro por classe
   e link direto (?ficha=gaia). */
(function () {
	var raiz = document.querySelector('[data-carrossel]');
	if (!raiz) return;

	var itens = [].slice.call(raiz.querySelectorAll('.carrossel__placas > li'));
	var fichas = [].slice.call(raiz.querySelectorAll('.carrossel__ficha'));
	var filtros = [].slice.call(raiz.querySelectorAll('.filtro button'));
	var palco = raiz.querySelector('.carrossel__palco');
	var anunciador = raiz.querySelector('.carrossel__aviso');
	var grupo = '';
	var atual = 0;

	function slug(li) { return li.getAttribute('data-slug'); }

	function visiveis() {
		return itens.filter(function (li) {
			return !grupo || li.getAttribute('data-grupo') === grupo;
		});
	}

	function vizinhos() {
		return window.matchMedia('(min-width: 52rem)').matches ? 2 : 1;
	}

	function mostrar(i, gravar) {
		var lista = visiveis();
		var n = lista.length;
		if (!n) return;
		atual = ((i % n) + n) % n;
		var ativo = lista[atual];
		var r = Math.min(vizinhos(), Math.floor((n - 1) / 2));

		itens.forEach(function (li) {
			li.hidden = true;
			li.classList.remove('ativo');
			li.style.order = '';
			li.querySelector('button').removeAttribute('aria-current');
		});
		lista.forEach(function (li, k) {
			var d = k - atual;
			if (d > n / 2) d -= n;
			if (d < -n / 2) d += n;
			if (Math.abs(d) > r) return;
			li.hidden = false;
			li.style.order = d + r;
		});
		ativo.classList.add('ativo');
		ativo.querySelector('button').setAttribute('aria-current', 'true');

		fichas.forEach(function (f) { f.hidden = f.getAttribute('data-slug') !== slug(ativo); });

		if (anunciador) {
			anunciador.textContent = ativo.querySelector('.carrossel__nome').textContent + ', ' + (atual + 1) + ' de ' + n;
		}
		if (gravar && window.history && history.replaceState) {
			history.replaceState(null, '', location.pathname + '?ficha=' + slug(ativo));
		}
	}

	itens.forEach(function (li) {
		li.querySelector('button').addEventListener('click', function () {
			mostrar(visiveis().indexOf(li), true);
		});
	});

	raiz.querySelector('.carrossel__seta--ant').addEventListener('click', function () { mostrar(atual - 1, true); });
	raiz.querySelector('.carrossel__seta--prox').addEventListener('click', function () { mostrar(atual + 1, true); });

	palco.addEventListener('keydown', function (e) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		e.preventDefault();
		var focoNaPlaca = document.activeElement.classList.contains('carrossel__item');
		mostrar(atual + (e.key === 'ArrowLeft' ? -1 : 1), true);
		if (focoNaPlaca) visiveis()[atual].querySelector('button').focus();
	});

	/* deslize com o dedo, no celular */
	var toqueX = 0, toqueY = 0, arrastando = false;
	palco.addEventListener('touchstart', function (e) {
		if (e.touches.length !== 1) return;
		toqueX = e.touches[0].clientX;
		toqueY = e.touches[0].clientY;
		arrastando = true;
	}, { passive: true });
	palco.addEventListener('touchmove', function (e) {
		if (!arrastando) return;
		var dx = e.touches[0].clientX - toqueX;
		var dy = e.touches[0].clientY - toqueY;
		/* só assume o gesto se for claramente horizontal, para não
		   atrapalhar a rolagem da página */
		if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) e.preventDefault();
	}, { passive: false });
	palco.addEventListener('touchend', function (e) {
		if (!arrastando) return;
		arrastando = false;
		var t = e.changedTouches[0];
		var dx = t.clientX - toqueX;
		var dy = t.clientY - toqueY;
		if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
		mostrar(atual + (dx < 0 ? 1 : -1), true);
	}, { passive: true });
	palco.addEventListener('touchcancel', function () { arrastando = false; }, { passive: true });

	filtros.forEach(function (b) {
		b.addEventListener('click', function () {
			grupo = b.getAttribute('data-grupo');
			filtros.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
			mostrar(0, true);
		});
	});

	window.matchMedia('(min-width: 52rem)').addEventListener('change', function () { mostrar(atual, false); });

	var pedido = new URLSearchParams(location.search).get('ficha');
	var inicio = 0;
	if (pedido) {
		itens.forEach(function (li, k) { if (slug(li) === pedido) inicio = k; });
	}
	mostrar(inicio, false);
})();
