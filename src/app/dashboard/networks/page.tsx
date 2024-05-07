'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllNetworks, Network } from '@/api/networks';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';

import { NetworksFilters } from '@/components/dashboard/networks/network-filters';
import { NetworksTables } from '@/components/dashboard/networks/network-table';

// const hosts = [
//   {
//     id: 'USR-010',
//     name: 'host-1',
//     lastSeen: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss').toString(),
//     address: '192.168.1.1',
//     publicIPpAddress: '111.111.111.111',
//     role: 'none',
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-009',
//     name: 'host-2',
//     lastSeen: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss').toString(),
//     address: '192.168.1.1',
//     publicIPpAddress: '222.222.222.222',
//     role: 'none',
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
// ] satisfies Networks[];

function applyPagination(rows: Network[], page: number, rowsPerPage: number): Network[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    // 在页面加载时调用 getAllNetworks() 函数获取网络列表
    getAllNetworks()
      .then((response) => {
        console.log('Fetched networks:', response);
        setNetworks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching networks:', error);
      });
  }, []); // 仅在组件挂载时调用一次

  const page = 0;
  const rowsPerPage = 5;
  const paginatedLighthouses = applyPagination(networks, page, rowsPerPage);
  const router = useRouter();

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Networks</Typography>
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
              router.push(`/dashboard/networks/add`);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>
      <NetworksFilters />
      <NetworksTables count={networks.length} rows={paginatedLighthouses} page={page} rowsPerPage={rowsPerPage} />
    </Stack>
  );
}
