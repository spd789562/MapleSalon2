import { useTranslate } from '@/context/i18n';

import DiscordLine from 'mingcute_icon/svg/logo/discord_line.svg';
import { Link } from '@/components/ui/link';

const DISCORD_LINK = 'https://discord.gg/pXa6e6GHxy';

export const DiscordLink = () => {
  const t = useTranslate();
  return (
    <Link
      as="a"
      href={DISCORD_LINK}
      title={t('setting.goToDiscord')}
      target="_blank"
      textStyle="sm"
    >
      {t('setting.discordLink')}
      <DiscordLine />
    </Link>
  );
};
