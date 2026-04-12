# REQ-2026.1-T02-UnB-App
Repositório de projeto da disciplina de REQ-T2, 2026.1.

## Estrutura da documentação

### Fonte da documentação (branch de trabalho)

```
REQ-2026.1-T02-UnB-App/
├── mkdocs.yml                  # Configuração de navegação, tema e plugins
├── requirements.txt
└── docs/
    ├── index.md                # Página inicial
    ├── referencias.md
    ├── assets/
    │   ├── logo.svg
    │   └── stylesheets/
    │       └── extra.css
    ├── 01-cenario/
    ├── 02-solucao/
    ├── 03-estrategias/
    ├── 04-er/
    ├── 05-cronograma/
    ├── 06-interacao/
    ├── 07-requisitos/
    ├── 08-dor-dod/
    ├── 09-backlog/
    └── 10-licoes/
```

## Como usar

### 1. Instalar dependências

```bash
pip install -r requirements.txt
```

### 2. Rodar localmente

```bash
mkdocs serve
```

Acesse em `http://127.0.0.1:8000`

### 3. Build para produção

```bash
mkdocs build
```

O comando acima gera a pasta `site/` localmente com os arquivos estáticos do site.

### 4. Deploy no GitHub Pages

```bash
mkdocs gh-deploy --clean
```

> O comando acima faz o build, limpa arquivos antigos e publica automaticamente o resultado na branch `gh-pages`.

---

## Personalização rápida

| O que alterar | Onde |
|---------------|------|
| Nome do produto e equipe | `mkdocs.yml` → `site_name` e `docs/index.md` |
| Logo | Substitua `docs/assets/logo.svg` |
| Cores | `docs/assets/stylesheets/extra.css` → variáveis `:root` |
| Imagens (rich picture, Ishikawa...) | Coloque em `docs/assets/` e referencie nos `.md` |
| Conteúdo | Edite os arquivos `.md` de cada seção |

## Componentes CSS disponíveis

Os seguintes componentes customizados estão prontos para uso nos arquivos `.md`:

```html
<!-- Cards da home -->
<div class="vpp-hero"> <div class="vpp-hero-card"> ... </div> </div>

<!-- Chips de status -->
<div class="vpp-chip-row"> <div class="vpp-chip">🎯 Texto</div> </div>

<!-- Cards de objetivos específicos -->
<div class="oe-grid"> <div class="oe-card"> <span class="oe-id">OE1</span> <p>...</p> </div> </div>

<!-- Timeline de sprints -->
<div class="sprint-timeline"> <div class="sprint-item"> ... </div> </div>

<!-- Cards de equipe -->
<div class="team-grid"> <div class="team-card"> <div class="avatar">AB</div> ... </div> </div>

<!-- Badges -->
<span class="badge badge-blue">Em andamento</span>
<span class="badge badge-green">Concluído</span>
<span class="badge badge-amber">Revisão</span>
<span class="badge badge-red">Bloqueado</span>
```

## Commits

Formato:
```
<type>[optional scope]!: <short summary>

[body]
```
Tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `build`, `ci`, `add`, `revert`.

Ex.: `feat(api): adiciona rota de login`.

## Branches

Formato:
```
<type>/<short summary>-<author name>
```
Tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Ex.: `feat/AdicionaRotaDeLogin-EnzoGabriel`.

## Contribuição

Siga o workflow abaixo para contribuir:

1. Crie uma branch a partir da `development`:
    ```bash
    git checkout dev
    git pull
    git checkout -b tipo/SuaFeature-SeuNome
    ```

2. Faça suas alterações e commits na nova branch.

3. Envie sua branch para o repositório remoto:
    ```bash
    git push origin tipo/SuaFeature-SeuNome
    ```
4. Abra um Pull Request (PR) da sua branch para a branch `dev` (só ir no site e colocar Base: dev <-- compare: sua-feature).

**Desenvolvido para Requisitos de Software FCTE-UnB 2026-1** 🎓
