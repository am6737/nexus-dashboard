'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteHost, Host } from '@/api/hosts';
import { deleteRule, Rule } from '@/api/rule';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Popover,
  styled,
  Tooltip,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Circle } from '@phosphor-icons/react/dist/csr/Circle';
import { ArrowsCounterClockwise } from '@phosphor-icons/react/dist/ssr/ArrowsCounterClockwise';
import { DotsThreeOutline } from '@phosphor-icons/react/dist/ssr/DotsThreeOutline';
import toast from 'react-hot-toast';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

interface RuleTableTableProps {
  count?: number;
  page?: number;
  rows?: Rule[];
  rowsPerPage?: number;
}

export function RuleTable({ count = 0, rows = [], page = 0, rowsPerPage = 0 }: RuleTableTableProps): React.JSX.Element {
  const router = useRouter();

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [dialogContentText, setDialogContentText] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);
  const [selectRule, setSelectRule] = useState<Rule | undefined>(undefined);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setConfirmationMessage(`Delete ${selectRule?.name}?`);
    setDialogContentText(
      <>
        Once a host is deleted its certificate cannot be renewed.
        <br />
        <em>Note: If the host currently has a certificate it will continue to be valid until its expiration date.</em>
        <br />
        Are you sure you want to delete <strong>{selectRule?.name}</strong>?
      </>
    );
  }, [selectRule]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLoading(false);
  };

  function handleMenuItemEnroll(): void {
    handleClose();
    router.push(`/dashboard/hosts/${selectRule?.id}/enroll`);
  }

  function handleMenuItemEdit(): void {
    handleClose();
    router.push(`/dashboard/hosts/${selectRule?.id}/edit`);
  }

  function handleMenuItemDelete() {
    handleClose();
    setOpenDialog(true);
  }

  const handleDelete = () => {
    setLoading(true);
    // TODO 延迟一秒展示动画，后期可以去掉
    setTimeout(() => {
      deleteRule(selectRule?.id as string)
        .then(() => {
          toast.success(`Delete Host ${selectRule?.name} success`);
          // 删除成功后更新列表
          // 下面这行代码用于删除成功后重新加载页面
          router.refresh();
        })
        .catch((error) => {
          toast.error(`Host delete failed: ${error}`);
        })
        .finally(() => {
          setOpenDialog(false);
          setLoading(false);
        });
    }, 1000);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Protocol</TableCell>
              <TableCell>Portrange</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);
              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          cursor: 'pointer',
                          color: 'var(--color-text-accent)',
                          '&:hover': { textDecoration: 'underline', color: 'hsl(259deg, 73%, 72%)' },
                        }}
                        onClick={() => {
                          router.push(`/dashboard/hosts/${row.id}`);
                        }}
                      >
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.direction}</TableCell>
                  <TableCell>{row.proto}</TableCell>
                  <TableCell>{row.port}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                        setSelectRule(row);
                      }}
                    >
                      <DotsThreeOutline size={15} weight="fill" />
                    </IconButton>
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleMenuItemEdit} disableRipple>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={handleMenuItemDelete} disableRipple>
                        Delete
                      </MenuItem>
                    </StyledMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* Dialog component for confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{confirmationMessage}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton variant="contained" color="error" onClick={handleDelete} loading={loading}>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
}