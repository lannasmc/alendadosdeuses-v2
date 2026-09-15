/* Menu mobile: abre e fecha a navegação do cabeçalho.
   Sem este arquivo a navegação aparece aberta (classe sem-js no <html>). */
(function () {
	document.documentElement.classList.remove('sem-js');

	var botao = document.querySelector('.topo__menu');
	var nav = document.getElementById('menu-principal');
	if (!botao || !nav) return;

	function fechar() {
		nav.classList.remove('aberto');
		botao.setAttribute('aria-expanded', 'false');
		botao.setAttribute('aria-label', 'Abrir menu');
	}

	botao.addEventListener('click', function () {
		var abrir = !nav.classList.contains('aberto');
		nav.classList.toggle('aberto', abrir);
		botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
		botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && nav.classList.contains('aberto')) {
			fechar();
			botao.focus();
		}
	});

	window.matchMedia('(min-width: 62rem)').addEventListener('change', fechar);
})();
