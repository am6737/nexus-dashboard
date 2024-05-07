'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import { listRule, Rule } from '@/api/rule';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import toast from 'react-hot-toast';

import AddRuleDialog from '@/components/dashboard/rules/dialog';
import { RuleTable } from '@/components/dashboard/rules/rules-table';

function applyPagination(rows: Rule[], page: number, rowsPerPage: number): Rule[] {
  if (!rows || rows.length === 0 || page < 0 || rowsPerPage <= 0) {
    return [];
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // 检查开始索引和结束索引是否在有效范围内
  if (startIndex >= rows.length) {
    return [];
  }

  // 截取指定范围内的数据
  return rows.slice(startIndex, endIndex);
}

// const rules = [
//   {
//     id: 'USR-010',
//     name: 'inbound-1',
//     direction: 'inbound',
//     protocol: 'any',
//     portrange: '22',
//     action: 'allow',
//     host: [],
//     description: '只允许访问22端口流量入站',
//     createdAt: '',
//   },
//   {
//     id: 'USR-010',
//     name: 'outbound-1',
//     direction: 'outbound',
//     protocol: 'any',
//     portrange: 'any',
//     action: 'allow',
//     host: [],
//     description: '允许所有流量出站',
//     createdAt: '',
//   },
// ] satisfies Rule[];

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const page = 0;
  const rowsPerPage = 5;

  const [openDialog, setOpenDialog] = useState(false);

  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    listRule({ page: 1, limit: 10 })
      .then((response) => {
        console.log('response', response);
        setRules(response.data);
      })
      .catch((error) => {
        toast.error(`${error}`);
        console.error('Error fetching rules:', error);
      });
  }, []);

  const paginatedCustomers = applyPagination(rules, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Rules</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setOpenDialog(true);
              //   router.push(`/dashboard/rules/add`);
            }}
          >
            Add
          </Button>
        </div>
      </Stack>
      {/* <NetworksFilters /> */}
      <RuleTable count={paginatedCustomers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />

      <AddRuleDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
      />
    </Stack>
  );
}
