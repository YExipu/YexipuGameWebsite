# 《叶戏谱》官网游戏原声添加说明

官网原声音乐统一放在仓库根目录的 `audio/` 文件夹中。

## 添加新音乐

1. 打开官网仓库：`https://github.com/YExipu/YexipuGameWebsite`
2. 进入 `audio/` 目录，上传新的 MP3 文件。
3. 文件名建议只用小写英文字母、数字和短横线，例如 `leaf-market-night.mp3`。
4. 打开同目录中的 `soundtracks.json`，在最后一首曲目后增加新记录。

示例：

```json
{
  "id": "leaf-market-night",
  "title": "叶市夜话",
  "subtitle": "场景原声",
  "scene": "无名叶市",
  "duration": "03:12",
  "src": "./audio/leaf-market-night.mp3"
}
```

字段说明：

- `id`：每首曲目唯一的英文标识，不能重复。
- `title`：网页上显示的曲名。
- `subtitle`：曲目类型，例如“主题曲”或“场景原声”。
- `scene`：对应的游戏场景或章节。
- `duration`：显示时长，格式建议为 `分:秒`。
- `src`：MP3 的固定相对路径，必须以 `./audio/` 开头。

提交修改后，GitHub Pages 会自动更新。浏览器可能缓存旧清单，可以强制刷新页面：

- macOS：`Command + Shift + R`
- Windows：`Ctrl + F5`

静态 GitHub Pages 无法自动扫描文件夹，所以只上传 MP3 不会自动出现在网页中；每增加一首新音乐，都需要同时在 `audio/soundtracks.json` 中增加一条记录。
