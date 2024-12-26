import { template } from '@solid-primitives/i18n';

export const dict = {
  initTitle: '初始化錯誤',
  initBaseWzTitle: '初始化 Base.wz 錯誤',
  initDescPermission: '無法建立或讀取存檔，請確認應用程式權限並重啟。',
  initEquipError: '無法讀取裝備資訊，請檢察 Wz 完整度。',
  initChairError: '無法讀取椅子資訊，請檢察 Wz 完整度。',
  initRendererError: '無法初始化渲染器，請更新 webview2。',

  message: template<{ text: string }>('錯誤訊息：{{ text }}'),
  unknownError: '未知錯誤',
};
