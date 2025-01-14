# Frequently Asked Questions
---
<details open>
<summary>

#### How can I keep my data when switching to a new computer?
</summary>

Yes, you can. Character and settings files are located in `%APPDATA%/com.maplesalon.io`. You can access files by entering the path in File Explorer or opening the `Save Folder` in settings. Copy all files from this location to the new computer.
Remember to close the application before copying the files, otherwise the save operation during shutdown might overwrite the old files!

</details>

<details open>
<summary>

#### Why does the application crash or fail to start after installation?
</summary>

This application is packaged with Tauri and uses Microsoft's [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH) on Windows. Some features require at lease Windows 10. Please ensure Windows 10 is up to date or update
 the [Webview2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH) to the latest version.

</details>

<details open>
<summary>

#### What should I do if no characters are displayed after launching?
</summary>

This usually occurs due to older operating systems or drivers. Besides updating your drivers, you can also change the renderer in setting from the default WebGPU to WebGL in the settings. You'll be prompted to restart the application, after that character should display normally.

</details>

<details open>
<summary>

#### What should I do if the equipment list and chair/mount list are empty or showing outdated content?
</summary>

The application may retain old cache during version changes. Use the `Clear Cache` button at the bottom of settings and refresh to see the latest data.

</details>

<details open>
<summary>

#### What game version should I use?
</summary>

According to users report, TMS, JMS, GMS, and KMS(T) are currently confirmed to work.

</details>

<details open>
<summary>

#### What should I do if some equipment doesn't appear as expected?
</summary>

The program's rendering logic is based on various simulators and personal experience. When specific equipment hava some issues, manual checking is needed. Please report equipment problems at discord!

</details>

<details open>
<summary>

#### Why does the exported GIF looks broken?
</summary>

Many MapleStory equipment items are semi-transparent, and GIF format doesn't support semi-transparent colors. You can set the GIF background color in settings or use other export formats (webp/apng).

</details>

<details open>
<summary>

#### Can this software run on other platforms?
</summary>

Technically yes, but there are no installation packages available for other platforms currently. If needed, you would need to download the project and package it yourself.

</details>