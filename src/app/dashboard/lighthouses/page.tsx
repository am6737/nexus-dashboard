'use client';

import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';

import { LighthousesFilters } from '@/components/dashboard/lighthouses/lighthouses-filters';
import { Lighthouses, LighthousesTables } from '@/components/dashboard/lighthouses/lighthouses-table';

const hosts = [
  {
    id: 'USR-010',
    name: 'host-1',
    lastSeen: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss').toString(),
    address: '192.168.1.1',
    publicIPpAddress: '111.1.1.1',
    role: 'none',
    online: true,
    last_seen_at: 'Online',
    tags: '',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-009',
    name: 'host-2',
    lastSeen: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss').toString(),
    address: '192.168.1.1',
    publicIPpAddress: '222.1.1.1',
    role: 'none',
    online: false,
    last_seen_at: '1分钟前',
    tags: '',

    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-009',
    name: 'host-2',
    lastSeen: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss').toString(),
    address: '192.168.1.1',
    publicIPpAddress: '222.1.1.2',
    role: 'none',
    online: false,
    last_seen_at: '',
    tags: '',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Lighthouses[];

function applyPagination(rows: Lighthouses[], page: number, rowsPerPage: number): Lighthouses[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const paginatedLighthouses = applyPagination(hosts, page, rowsPerPage);

  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Lighthouses</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button> */}
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              // do nothing
              console.log('clicked');
              router.push(`/dashboard/lighthouses/add`);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>
      <LighthousesFilters />
      <LighthousesTables count={hosts.length} rows={paginatedLighthouses} page={page} rowsPerPage={rowsPerPage} />
    </Stack>
  );
}
