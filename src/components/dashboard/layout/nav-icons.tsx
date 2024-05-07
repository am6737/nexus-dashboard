import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { HardDrives as ServerIcon } from '@phosphor-icons/react/dist/ssr/HardDrives';
import { Lighthouse as LighthouseIcon } from '@phosphor-icons/react/dist/ssr/Lighthouse';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { ShareNetwork as NetworkIcon } from '@phosphor-icons/react/dist/ssr/ShareNetwork';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Wall } from '@phosphor-icons/react/dist/ssr/Wall';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  servers: ServerIcon,
  lighthouses: LighthouseIcon,
  networks: NetworkIcon,
  rules: Wall,
} as Record<string, Icon>;
