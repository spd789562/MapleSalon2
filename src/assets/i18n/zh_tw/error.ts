import { template } from '@solid-primitives/i18n';

export const dict = {
  initTitle: '初始化錯誤',
  initBaseWzTitle: '初始化 Base.wz 錯誤',
  initDescPermission: '無法建立或讀取存檔，請確認應用程式權限並重啟。',
  initEquipError: '無法讀取裝備資訊，請檢察 Wz 完整度。',
  initChairError: '無法讀取椅子資訊，請檢察 Wz 完整度。',
  initRendererError: '無法初始化渲染器，請更新 webview2。',

  gpuInitializeError: '無法初始化 WebGPU',
  gpuInitializeDesc:
    '請確保您的 Webview 版本支援 WebGPU。或是嘗試更新顯示卡驅動',

  equipmentLoadFailed: '裝備載入失敗',
  equipmentLoadFailedDesc: template<{ errorNames: string }>(
    '下列裝備載入失敗：{{ errorNames }}',
  ),

  chairLoadFailed: '椅子載入失敗',
  chairLoadFailedDesc: '此椅子可能檔案不完全或尚未支援',

  mountLoadFailed: '坐騎載入失敗',
  mountLoadFailedDesc: '此坐騎可能檔案不完全或尚未支援',

  message: template<{ text: string }>('錯誤訊息：{{ text }}'),
  unknownError: '未知錯誤',
};
