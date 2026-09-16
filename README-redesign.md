# A Lenda dos Deuses — redesign v2

Proposta de identidade visual ("o livro como objeto") para apresentar ao
cliente. Publicada em <https://lannasmc.github.io/alendadosdeuses-v2/>, num
repositório separado; o site atual, em `lannasmc/alendadosdeuses`, não muda.

Site estático: HTML, CSS e dois arquivos JS pequenos. Sem build, sem
`package.json`. Arquivo salvo é arquivo publicado. Tudo pode ser editado
num editor de texto comum (Notepad++).

Abrir um `index.html` direto no navegador mostra a página, mas os links
entre páginas apontam para pastas (`livros/`, `autor/`) e só navegam
direito com o site publicado ou num servidor local
(`python3 -m http.server` na raiz). A 404 só funciona certa publicada
(ver "404" abaixo).

---

## Estrutura de pastas

```
index.html                  página inicial
404.html                    página não encontrada
livros/                     os oito volumes
livros/genesis/             Volume I
livros/cronicas/            Volume II
universo/                   O Universo
personagens/                fichas dos personagens (carrossel)
bestiario/                  fichas das criaturas (carrossel + filtro)
downloads/                  materiais para baixar
downloads/arquivos/         os arquivos em si (mapa em alta)
eventos/                    agenda
onde-comprar/               lojas e livrarias
autor/                      biografia

assets/fonts/               Cinzel Decorative, Cinzel, EB Garamond (woff2)
assets/css/                 um arquivo por componente (lista abaixo)
assets/js/menu.js           abre e fecha o menu no celular
assets/js/carrossel.js      carrossel de personagens e bestiário
assets/img/logo.png         logo do cabeçalho (logo inline do cliente, recortado)
assets/img/logo-empilhado.*  logo empilhado (remontado em alta resolução a partir
                            das letras do logo inline). .webp/.png com 960px no hero;
                            -p.webp/-p.png com 352px no rodapé. O navegador usa o
                            WebP e só cai no PNG se não suportar WebP.
assets/img/moldura.png      moldura alada (arte do logo, quadrada e transparente)
assets/img/livros/          capas: capa-<volume>.jpg
assets/img/personagens/     uma imagem por personagem: <nome>.jpg
assets/img/bestiario/       uma imagem por criatura: <nome>.jpg
assets/img/universo/        luminoso.jpg, sombrio.jpg, mapa.jpg
assets/img/home/            arte dos três portais e dos personagens no emblema do hero
assets/img/autor/           foto do autor
assets/img/erro/            arte dentro da moldura na 404
```

### CSS por componente

| Arquivo | O que tem | Onde é usado |
|---|---|---|
| `base.css` | fontes, tokens, cores por volume, tipografia, fundos, capitular, rótulo, selo | todas |
| `header.css` | cabeçalho fixo, COMPRAR, menu mobile | todas |
| `footer.css` | rodapé | todas |
| `ornamentos.css` | título com losangos, `.rule-double`, `.ornate`, `.placa`, `.moldura-alada`, citação | todas |
| `botoes.css` | primário, secundário, terciário, link com seta | todas |
| `convite.css` | caixa de convite de compra | várias |
| `capa.css` | capa, grade de volumes, navegação anterior/próximo | home, livros, onde comprar |
| `ficha.css` | `.ficha` / `.ficha-linha` (rótulo + valor) | volumes, universo, personagens, bestiário |
| `carrossel.css` | carrossel de placas e filtro | personagens, bestiário |
| `home.css` | hero, emblema com personagens e brilhos, mundos, portais, autor | home |
| `volume.css` | corpo da página de volume | volumes |
| `universo.css` | resumo, cartões dos mundos, mapa, tabela | universo |
| `cartoes.css` | cartões de download | downloads |
| `linha-tempo.css` | linha do tempo com losangos | eventos, autor |
| `lojas.css` | lojas e livrarias | onde comprar |
| `faixa.css` | faixa escura de título, retrato redondo | eventos, autor |
| `autor.css` | bio e "onde acompanhar" | autor |
| `erro.css` | 404 | 404 |

Cada página lista no `<head>` só os CSS de que precisa. `base`, `header`,
`footer`, `ornamentos` e `botoes` entram em todas.

---

## Tokens

Declarados em `:root`, no topo de `assets/css/base.css`.

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#0D0A0B` | fundo base |
| `--leather` | `#1A1012` | blocos de couro |
| `--gold` | `#C9A227` | filetes, rótulos, navegação, botão primário |
| `--parch` | `#EDE4CE` | seções claras |
| `--vol` | cor do volume | capitular, links no texto, filete sob títulos, borda do selo, botão terciário, brilho no centro do emblema |

Derivados: `--vol-text` (a cor do volume clareada, para usar como texto
sobre fundo escuro sem perder contraste) e `--vol-on` (cor do texto dentro
do botão terciário; só Reis usa tinta escura, porque o dourado dele é claro).

### Cor por volume

`data-vol` no `<body>` pinta a página inteira. Também vale num elemento
isolado (uma capa, um cartão), e aí só ele muda.

```html
<body data-vol="genesis">
```

| `data-vol` | Cor | Situação |
|---|---|---|
| `genesis` | `#8C2F2F` | publicado |
| `cronicas` | `#2E4A7D` | publicado |
| `proverbios` | `#3F7F4F` | proposta |
| `exodo` | `#B4592A` | proposta |
| `lamentacoes` | `#6B3F8C` | proposta |
| `atos` | `#1F6F7A` | proposta |
| `reis` | `#A8862A` | proposta |
| `apocalipse` | `#5A1E1E` | proposta |

As páginas que não são de um volume usam `genesis`, o volume de entrada.

### Tipografia

- **Cinzel Decorative 700**: títulos de página e de seção
- **Cinzel 400/600**: rótulos, navegação, selos, sempre com espaçamento largo
- **EB Garamond 400/600 + itálico**: texto corrido, sempre alinhado à esquerda

---

## Como adicionar um volume novo

Exemplo: Provérbios (Volume III) foi lançado.

1. **Cor.** Confira a linha `[data-vol="proverbios"]` em
   `assets/css/base.css`. Para um volume que ainda não está na lista, crie
   a linha com a cor nova. Se a cor for clara (como a de Reis), acrescente
   `--vol-on: var(--ink);` para o texto do botão ficar legível.

2. **Capa.** Substitua `assets/img/livros/capa-proverbios.jpg` pela capa
   real, com o mesmo nome (proporção 867 × 1200).

3. **Página do volume.** Copie a pasta `livros/cronicas/` para
   `livros/proverbios/` e, no `index.html` copiado, troque:
   - `data-vol="cronicas"` por `data-vol="proverbios"` no `<body>`
   - `<title>`, `Volume II` → `Volume III`, `Crônicas` → `Provérbios`
   - o caminho da capa e o `alt`
   - a sinopse, a ficha e os botões de compra
   - a navegação: anterior aponta para Crônicas; o próximo (Êxodo) fica
     como `<span … aria-disabled="true">` até ser lançado

4. **Página anterior.** Em `livros/cronicas/index.html`, troque o
   "Próximo volume" de `<span … aria-disabled="true">` para
   `<a class="volume-nav__item volume-nav__item--prox" href="../proverbios/">`.

5. **Grade de volumes.** Em `livros/index.html`, no item de Provérbios:
   tire a classe `volume--breve` e o `aria-disabled="true"`, acrescente
   `href="proverbios/"`, tire `capa--breve` da capa e troque o selo
   `selo--apagado` "Em breve" por `<span class="selo">Disponível</span>`.

6. **Rodapé (todas as páginas).** Troque
   `<li class="breve"><a aria-disabled="true"><small>Vol. III</small> Provérbios</a></li>`
   por um link normal. O caminho muda com a profundidade da página:

   | Página | Link |
   |---|---|
   | `index.html` e `404.html` | `livros/proverbios/` |
   | páginas de primeiro nível (`universo/`, `autor/` …) | `../livros/proverbios/` |
   | páginas de volume (`livros/genesis/` …) | `../../livros/proverbios/` |

   No Notepad++, "Localizar em arquivos" acha as 12 ocorrências de uma vez.

7. **Onde comprar.** Em `onde-comprar/index.html`, copie o bloco
   `<section class="compra" id="genesis" …>` e ajuste `id`, `data-vol`,
   capa, título e lojas.

8. **Home.** Se ele virar o volume em destaque, troque o bloco
   "VOLUME EM DESTAQUE" e, no emblema, `data-vol` e o rótulo "Volume I".

---

## Conteúdo x estrutura

Todo trecho que o autor vai editar está marcado com um comentário:

```html
<!-- CONTEÚDO: ficha de Gaia -->
```

Cabeçalho e rodapé ficam entre `<!-- ============ CABEÇALHO … -->` e
`<!-- ============ /CABEÇALHO ============ -->` (idem rodapé) e são
idênticos em todas as páginas; muda só o `aria-current="page"` do item
atual e o prefixo `../` dos caminhos.

Estas convenções existem para uma possível migração para tema WordPress:
cada `CONTEÚDO` vira um campo, cada CSS de componente vira um arquivo
enfileirado, e as URLs já estão no formato final.

---

## O que é real e o que é provisório

**Real (vem do site atual e do blog do cliente):** logo inline no cabeçalho; moldura alada do logo; arte da 404 (fantasma gerado por IA); capas de Gênesis e
Crônicas; ilustrações e fichas dos 10 personagens e das 13 criaturas;
texto da cosmogênese; mapa do Mundo Concreto; bio, trajetória e foto do
autor; links e preços da Amazon e do Mercado Livre; livrarias; redes
sociais; e-mail de contato.

**Lorem ipsum / exemplo:** sinopses dos volumes; textos curtos dos Mundos
Luminoso e Sombrio; texto sobre o mapa; citações das fichas (as de Gaia e
Zolos são as dos mockups); "Aparece em" das fichas; páginas e personagens
em destaque dos volumes; epígrafe do Universo; frase do autor na página
dele; agenda de eventos; itens de download (menos o mapa); linha "450
páginas" nas etiquetas.

**Placeholders de imagem** (arquivos neutros, com "em produção" escrito,
nos caminhos definitivos; é só sobrescrever com a arte final de mesmo nome):

| Arquivo | Medida sugerida |
|---|---|
| `assets/img/livros/capa-proverbios.jpg` … `capa-apocalipse.jpg` | 867 × 1200 |
| `assets/img/universo/luminoso.jpg`, `sombrio.jpg` | 1600 × 900 |

A moldura alada (`assets/img/moldura.png`) é a arte do logo, colocada num
quadrado de 1000 × 1000 com fundo transparente. O miolo fica centrado em
50% × 52,5%; a arte de dentro é recortada por
`clip-path: ellipse(26.5% 31% at 50% 52.5%)` em `.moldura-alada__arte`
(`ornamentos.css`). Se a moldura for trocada por outra, ajuste esse
recorte. As sete gemas vêm desenhadas na própria arte.

Para trocar a arte da 404 (`assets/img/erro/404.jpg`): imagem quadrada de
800 × 800 com o assunto dentro de um oval centrado, de 53% da largura por
62% da altura, com o centro a 52,5% do topo. O que fica fora do oval é
coberto pela moldura.

A moldura aparece em três lugares apenas: emblema da home, portais da home
e 404. Personagens e bestiário usam placas retangulares.

---

## Detalhes técnicos

- **404:** o GitHub Pages serve `404.html` em qualquer endereço inexistente,
  em qualquer profundidade. Por isso ela usa `<base href="/alendadosdeuses-v2/">`.
  Se o site for para um domínio próprio, troque para `<base href="/">`.
- **Carrossel:** troca a ficha nas setas, com as setas do teclado ou
  deslizando o dedo no celular. Aceita link direto para uma ficha,
  `personagens/?ficha=aron` ou `bestiario/?ficha=zolos`. Sem JS, todas as
  fichas aparecem em sequência.
- **Menu:** abaixo de 78rem (≈ 1250px, ou 1280px com 110%+ de zoom) a
  navegação vira menu. Sem JS, a navegação fica aberta.
- **Contraste:** pares principais conferidos (WCAG AA, 4,5:1 ou mais),
  inclusive texto claro sobre couro e a cor do volume usada como texto.
- **Ícones das redes:** SVG inline no HTML (rodapé e menu do celular),
  com os desenhos oficiais do Simple Icons (licença CC0) em `currentColor`.
  Não há arquivo de imagem nem versão separada para o hover.
- **Volumes não lançados:** `aria-disabled="true"` e `pointer-events: none`,
  não só cor apagada.
