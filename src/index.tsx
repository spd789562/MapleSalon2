/* @refresh reload */
import { render } from 'solid-js/web';
import { I18nProvider } from './context/i18n';
import { ItemContextMenuProvider } from './context/itemContextMenu';
import App from './App';

render(
  () => (
    <I18nProvider>
      <ItemContextMenuProvider>
        <App />
      </ItemContextMenuProvider>
    </I18nProvider>
  ),
  document.getElementById('root') as HTMLElement,
);
