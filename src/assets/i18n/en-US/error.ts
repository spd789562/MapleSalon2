import type { ErrorDictionary } from '@/assets/i18n/type';
import { template } from '@solid-primitives/i18n';

export const dict: ErrorDictionary = {
  initTitle: 'Initialization Error',
  initBaseWzTitle: 'Base.wz Initialization Error',
  initDescPermission:
    'Cannot create or load save file. Please check application permissions and restart.',
  initEquipError:
    'Cannot load equipment data. Please check that the wz data is complete.',
  initChairError:
    'Cannot load chair data. Please check that the wz data is complete.',
  initRendererError: 'Failed to initialize renderer. Please update WebView2.',

  gpuInitializeError: 'WebGPU Initialization Error',
  gpuInitializeDesc:
    'Please ensure your WebView version supports WebGPU, or try updating your GPU drivers.',

  equipmentLoadFailed: 'Equipment Load Failed',
  equipmentLoadFailedDesc: template<{ errorNames: string }>(
    'Failed to load the following equipment: {{ errorNames }}',
  ),

  chairLoadFailed: 'Chair Load Failed',
  chairLoadFailedDesc:
    'This chair may not be supported or the file may be incomplete',

  mountLoadFailed: 'Mount Load Failed',
  mountLoadFailedDesc:
    'This mount may not be supported or the file may be incomplete',

  message: template<{ text: string }>('Error message: {{ text }}'),
  unknownError: 'Unknown Error',
};
