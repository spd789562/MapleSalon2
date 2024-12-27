import type { ErrorDictionary } from '@/assets/i18n/type';
import { template } from '@solid-primitives/i18n';

export const dict: ErrorDictionary = {
  initTitle: 'Initialize Error',
  initBaseWzTitle: 'Initialize Base.wz Error',
  initDescPermission:
    "Can't not create or load save file, please check the permissions and restart the app.",
  initEquipError:
    "Can't not load equipment data, please check the wz data is fully function.",
  initChairError:
    "Can't not load chair data, please check the wz data is fully function.",
  initRendererError: 'Initialize renderer failed, please update the webview2.',

  gpuInitializeError: 'Initialize WebGPU Error',
  gpuInitializeDesc:
    'Please make sure your webview version support WebGPU. Or try to update the GPU driver.',

  equipmentLoadFailed: 'Equipment Load Failed',
  equipmentLoadFailedDesc: template<{ errorNames: string }>(
    'The errors equipments: {{ errorNames }}',
  ),

  chairLoadFailed: 'Chair Load Failed',
  chairLoadFailedDesc: 'This chair might not supported or damaged',

  mountLoadFailed: 'Mount Load Failed',
  mountLoadFailedDesc: 'This mount might not supported or damaged',

  message: template<{ text: string }>('Error message: {{ text }}'),
  unknownError: 'Unknown Error',
};
