import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'networks', title: 'Networks', href: paths.dashboard.networks, icon: 'networks' },
  { key: 'hosts', title: 'Hosts', href: paths.dashboard.hosts, icon: 'servers' },
  { key: 'lighthouses', title: 'Lighthouses', href: paths.dashboard.lighthouses, icon: 'lighthouses' },
  { key: 'rules', title: 'Rules', href: paths.dashboard.rules, icon: 'rules' },
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
