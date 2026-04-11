# REQ-2026.1-T02-UnB-App
Repositório de projeto da disciplina de REQ-T2, 2026.1.

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
