'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { getAllHotss, Host } from '@/api/hosts';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { HostFilters } from '@/components/dashboard/hosts/hosts-filters';
import { HostTable } from '@/components/dashboard/hosts/hosts-table';

// export const metadata = { title: `Hosts | Dashboard | ${config.site.name}` } satisfies Metadata;

// const hosts = [
//   {
//     id: 'USR-010',
//     name: 'host-1',
//     lastSeen: dayjs().subtract(2, 'hours').toDate().toString(),
//     address: '192.168.1.1',
//     role: 'none',
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-009',
//     name: 'host-2',
//     lastSeen: dayjs().subtract(2, 'hours').toDate().toString(),
//     address: '192.168.1.1',
//     role: 'none',
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
// ] satisfies Host[];

function applyPagination(rows: Host[], page: number, rowsPerPage: number): Host[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const page = 0;
  const rowsPerPage = 5;

  const [hosts, setHosts] = useState<Host[]>([]);

  const [hostsLoaded, setHostsLoaded] = useState(false);

  useEffect(() => {
    // 在组件加载时获取网络列表
    getAllHotss()
      .then((response) => {
        console.log('response', response);
        setHosts(response.data);
        setHostsLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching networks:', error);
      });
  }, []);

  if (!hostsLoaded) {
    return <></>;
  }

  const paginatedCustomers = applyPagination(hosts, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Hosts</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              router.push(`/dashboard/hosts/add`);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>
      <HostFilters />
      <HostTable count={paginatedCustomers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />
    </Stack>
  );
}
