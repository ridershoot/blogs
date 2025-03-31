---
aside: false
---

# git commit 规范

|   前缀   |                                  释义                                   |                            示例                             |
|:--------:|:---------------------------------------------------------------------:|:-----------------------------------------------------------:|
|   feat   |                                新增功能                                 |            `feat: add user login functionality`             |
|   fix    |                                 修复bug                                 |             `fix: correct minor typos in code`              |
|   docs   |                       修改文档<br/>比如README.md                        |      `docs: update README with API reference section`       |
|  style   |                    格式化代码样式<br/>不修改代码逻辑                    |     `style: format all JavaScript files with Prettier`      |
| refactor |                    重构代码，不涉及bug修复和功能新增                     |                                                             |
|   test   |                              增/删测试代码                              |           `test: add unit tests for user service`           |
|  chore   |            对构建过程或辅助工具和库的更改（例如更新依赖版本）。            |          `chore: update lodash to latest version`           |
|   perf   |                                性能优化                                 | `perf: improve query efficiency by adding index to user_id` |
|    ci    | 用于持续集成配置文件和脚本的改动（如 GitHub Actions, GitLab CI/CD 配置）。 |           `ci: add Node.js 14 to testing matrix`            |
|  build   |       用于影响构建系统或外部依赖关系的更改（如 gulp、webpack、npm）。        |            `build: upgrade webpack to version 5`            |
