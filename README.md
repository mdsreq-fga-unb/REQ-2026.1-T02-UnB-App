# REQ-2026.1-T02-UnB-App
Repositório de projeto da disciplina de REQ-T2, 2026.1.

## Entregas das Unidades 2 e 3
- Unidade 2: gitPages atual e a branch main
- Unidade 3: presente na branch feat/entregaUnidade3

## Como usar a documentação

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
