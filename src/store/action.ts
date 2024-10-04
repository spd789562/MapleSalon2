import { fileStore as equipHistoryFileStore } from './equipHistory';
import { saveSetting } from './settingDialog';
import { fileStore as characterDrawerFileStore } from './characterDrawer';
// fileSelectHistory is already save with any edit.
// import { fileStore as fileSelectHistoryFileStore } from "./fileSelectHistory";

export async function refreshPage() {
  await equipHistoryFileStore.save();
  await saveSetting();
  await characterDrawerFileStore.save();
  window.location.reload();
}
