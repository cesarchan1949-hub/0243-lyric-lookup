# 0243 粤语查字

一个可直接部署到 GitHub Pages 的静态粤语填词查字工具。

支持：

- 0243 数字词云，例如 `43`；优先使用 0243.hk 公开接口缓存的常用词排序
- 在当前词云内继续搜索，支持输入近义意图筛选，例如在 `02` 里输入 `可惜` 找到 `遗憾`
- 按词性或情绪做本地智能分类，帮助快速缩小词云范围
- 深色模式与桌面工作台式界面
- 押韵查词，例如 `33ong` 或 `33当`
- 汉字查词，例如 `先生`
- 粤拼查词，例如 `syut`
- 单字粤拼、0243 和韵母分析

## 数据

公开站点使用 CC-Canto 与 CC-CEDICT Cantonese readings 的开放数据，两者均按
Creative Commons Attribution-ShareAlike 3.0 授权发布。

本项目没有复制 0243.hk 的私有词库。数字词云来自 0243.hk 公开接口缓存，基础查词数据来自开放词典。如果你有合法的个人词库导出，可以接入构建流程后重新生成 `data/lexicon.json`。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173`。

## 重新生成数据

```bash
python3 scripts/build_lexicon.py
```

## GitHub Pages

项目已包含 GitHub Pages 工作流。推送到 GitHub 后：

1. 打开仓库设置。
2. 将 Pages 发布方式设为 GitHub Actions。
3. 如未自动开始，手动运行 `Deploy static site to GitHub Pages` 工作流。
