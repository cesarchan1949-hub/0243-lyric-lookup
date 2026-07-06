# 0243 粤语查字

一个可直接部署到 GitHub Pages 的静态粤语填词查字工具。

支持：

- 0243 数字词云，例如 `43`、`433`、`3434`；优先使用 0243.hk 公开接口缓存的常用词排序
- 在当前词云内继续搜索，支持输入近义意图筛选，例如在 `02` 里输入 `可惜` 找到 `遗憾`
- 按词性或情绪做本地智能分类，帮助快速缩小词云范围
- 深色模式与桌面工作台式界面
- 押韵词云，例如 `33ong` 或 `33当`，同样支持搜索、近义意图、词性和情绪分类
- 汉字查词，例如 `先生`
- 粤拼查词，例如 `syut`
- 单字粤拼、0243 和韵母分析

## 数据

公开站点的数字词云和汉字搜词优先使用 0243.hk 公开接口缓存，当前缓存 1 到 4 位
0243 数字组合。CC-Canto 与 CC-CEDICT Cantonese readings 保留用于粤拼、单字读音、
押韵辅助和缺口补充，两者均按 Creative Commons Attribution-ShareAlike 3.0 授权发布。

本项目没有接入登录态或私有接口。如果你有合法的个人词库导出，可以接入构建流程后重新生成数据。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173`。

## 重新生成数据

```bash
python3 scripts/build_lexicon.py
python3 scripts/build_official_cloud.py --min-length 1 --max-length 4
```

## GitHub Pages

项目已包含 GitHub Pages 工作流。推送到 GitHub 后：

1. 打开仓库设置。
2. 将 Pages 发布方式设为 GitHub Actions。
3. 如未自动开始，手动运行 `Deploy static site to GitHub Pages` 工作流。
