# 常見問題
---
<details open>
<summary>

#### 換電腦可以保留原本的資料嗎?
</summary>

可以，角色及設定的存檔檔案都位於 `%APPDATA%/com.maplesalon.io`，在檔案總管輸入路徑後即可，也可於設定中的 `存檔資料夾` 開啟，複製這邊的所有檔案，移動至新電腦。
請記得要關閉應用後再複製檔案過去，否則關閉應用時會存檔，屆時可能會覆蓋舊檔案！

</details>

<details open>
<summary>

#### 為什麼安裝完後開不起來或是會閃退
</summary>

這個應用使用 Tauri 打包，於 windows 是使用微軟的 [Webview2](https://developer.microsoft.com/zh-tw/microsoft-edge/webview2/?form=MA13LH)，並且部分程式需要 win10 以上才可使用，請確保 win10 的更新，或是更新 [Webview2](https://developer.microsoft.com/zh-tw/microsoft-edge/webview2/?form=MA13LH) 至最新版。

</details>

<details open>

<summary>

#### 可以使用 TMS 以外的楓之谷嗎?
</summary>

我沒測試過，但底層的 Wz 邏輯理論上一樣，可以試試看，只能說我沒信心可以和 TMS 一樣運作順利。

</details>

<details open>
<summary>

#### 有些裝備穿上時不如預期怎麼辦
</summary>

程式的渲染邏輯是參考各種模擬器及自己的經驗，特定裝備有問題時只能手動檢查，請至 `issue/巴哈` 回報裝備問題！

</details>

<details open>
<summary>

#### 可以在其他平台使用這個軟體嗎
</summary>

嚴格來說可以，但目前沒有建立相關安裝檔，若真的需要，得自己下載專案下來打包。

</details>