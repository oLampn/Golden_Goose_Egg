# Golden Goose Egg

一个以《Deadlock》“金鹅蛋”为主题的非官方、非商业静态网页。网站把装备的等待与成长机制做成番茄钟式孵化器，可选择无限孵化或定时孵化，并统计魂魄与永久增益。

线上地址：<https://goldengooseegg.net/>

## 当前功能

- 无限孵化：进度条按每分钟循环，每分钟积累 80 魂魄。
- 定时孵化：默认 30 分钟，可自定义时长；计时结束后等待玩家主动孵化。
- 2 秒孵化读条，读条期间可按空格取消。
- `Z` 快捷键可触发所有“孵化鹅蛋”操作。
- 购买后点击中央金蛋可确认取消计时，支持无限与定时模式。
- 暂停孵化、快进一分钟、购买与孵化音效、永久增益统计。
- 连续点击同一位置设有约 300 ms 防误触阈值。
- 孵化超过 60 分钟时，结果文案变为“鹅蛋孵化了，但是...”。
- 无账号系统、无登录验证、无服务端数据收集。

## 仓库结构

```text
dist/                       可直接部署的完整静态站点
  index.html
  styles.css
  app.js
  assets/
docs/DEVELOPMENT_HISTORY.md 重要需求、设计和部署节点
docs/MAINTENANCE.md         续费、证书与定期维护清单
```

`dist/` 是当前唯一的发布源，上传时应保持目录结构不变。

## 本地预览

在仓库根目录运行任意静态文件服务器，例如：

```powershell
python -m http.server 4173 --directory dist
```

然后访问 <http://127.0.0.1:4173/>。

## 当前生产环境

- 域名：`goldengooseegg.net`
- 托管：阿里云 OSS，中国香港地域
- Bucket：`goldengooseegg-net-hk`
- 根域名 CNAME：`goldengooseegg-net-hk.cn-hongkong.thepacificgls.com`
- 静态首页与 404 页面：`index.html`
- HTTPS：阿里云个人测试证书（DigiCert DV）

详细部署经过见 [开发与部署记录](docs/DEVELOPMENT_HISTORY.md)，续费和维护事项见 [维护清单](docs/MAINTENANCE.md)。

## 发布更新

1. 在本地预览并验证 `dist/`。
2. 将 `dist/` 内文件上传到 Bucket 根目录；`assets/` 保持为子目录。
3. 保持 Bucket 可公开读取，且“阻止公共访问”不会拦截静态站点。
4. 验证 <https://goldengooseegg.net/>、主要图片、声音和计时交互。
5. DNS 或证书变更后预留 10–30 分钟传播时间。

## 版权说明

本项目是非官方、非商业粉丝作品。《Deadlock》、相关商标及游戏素材归 Valve Corporation 所有。仓库中的游戏素材仅用于该粉丝项目；再次分发或用于商业用途前请自行确认授权范围。
