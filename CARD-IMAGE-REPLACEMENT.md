# 角色卡牌图片替换说明

以后只换角色卡牌图片时，不需要修改网页代码。

## 在 GitHub 里进入哪个目录

打开官网仓库：

`https://github.com/YExipu/YexipuGameWebsite`

进入这个目录：

`images/cards/`

## 固定文件名

- `card-back.png`：所有角色共用的卡背
- `sun-wukong.png`：孙悟空
- `zhu-bajie.png`：猪八戒
- `sha-wujing.png`：沙悟净
- `tang-sanzang.png`：唐三藏

## 如何上传同名 PNG 覆盖旧图

1. 在 GitHub 打开 `images/cards/`。
2. 点 `Add file`。
3. 选择 `Upload files`。
4. 上传同名 PNG，例如要替换孙悟空，就上传 `sun-wukong.png`。
5. GitHub 会提示这是同名文件覆盖。
6. 在页面底部填写提交说明。
7. 点 `Commit changes`。

## 图片要求

- 推荐尺寸：`480 × 1340`
- 格式必须是 PNG
- 保留透明圆角
- 不要加黑色背景
- 不要转换成 WebP、JPG 或其他格式
- 文件名必须和上面固定文件名完全一致

## 更新后如何强制刷新

GitHub Pages 更新后，浏览器可能会缓存旧图片。

可以这样刷新：

- 电脑：按 `Command + Shift + R` 或 `Ctrl + F5`
- 手机：关闭浏览器页面后重新打开
- 仍然不更新时：用无痕模式打开官网

官网地址：

`https://yexipu.github.io/YexipuGameWebsite/`

## 增加新角色为什么还要改一次代码

替换现有角色图片只需要覆盖同名 PNG。

但如果要增加第五张、第六张新角色卡牌，网页需要新增一个卡牌位置、角色名称和说明文字，所以仍然需要修改一次网页代码。
