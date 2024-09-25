import DiscordLine from 'mingcute_icon/svg/logo/discord_line.svg';
import { Link } from '@/components/ui/link';

const DISCORD_LINK = 'https://discord.gg/pXa6e6GHxy';

export const DiscordLink = () => {
  return (
    <Link
      as="a"
      href={DISCORD_LINK}
      title="點擊前往 Discord 群組邀請"
      target="_blank"
      textStyle="sm"
    >
      Discord 群組
      <DiscordLine />
    </Link>
  );
};
