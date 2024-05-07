import React, { useEffect, useState } from 'react';
import { updateNetwork } from '@/api/networks';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Alert, Box, Button, IconButton, Snackbar, SnackbarOrigin, TextField } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import toast from 'react-hot-toast';

export interface NetworkEditProps {
  id: string | string[];
  name: string;
  cidr: string;
  handleClosePage: () => void;
}

export function NetworkEdit(props: NetworkEditProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // 保存初始的 props 值
  const [initialProps, setInitialProps] = useState<NetworkEditProps>({
    id: '',
    name: '',
    cidr: '',
    handleClosePage: () => {},
  });
  useEffect(() => {
    setInitialProps({ ...props });
  }, [props]);

  // 复制 props 以便在输入时进行修改
  const [copiedProps, setCopiedProps] = useState<NetworkEditProps>({ ...props });
  useEffect(() => {
    setCopiedProps({ ...props });
  }, [props]);

  // 处理输入框值的变化
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCopiedProps((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // 检查修改后的值是否与原始值一致
    const isChanged = initialProps[name as keyof NetworkEditProps] !== value;
    setOpen(isChanged);
  };

  // 处理确认保存按钮的点击事件
  const handleConfirm = () => {
    // 检查 name 是否为空
    if (!copiedProps.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);
    // TODO 延迟一秒展示动画，后期可以去掉
    setTimeout(() => {
      updateNetwork({ id: copiedProps.id as string, name: copiedProps.name })
        .then(() => {
          toast.success('Network updated success');
        })
        .catch((error) => {
          toast.error(`Network update failed: ${error}`);
        })
        .finally(() => {
          setOpen(false);
          setLoading(false);
          props.handleClosePage();
        });
    }, 1000);
  };

  return (
    <Stack spacing={2}>
      {/* 面包屑导航 */}
      <Stack direction="row" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/networks">
            Networks
          </Link>
          <Link underline="hover" color="inherit" href={`/dashboard/networks/${props.id}`}>
            {props.name}
          </Link>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
        {/* 关闭页面按钮 */}
        <Box ml="auto">
          <IconButton
            aria-label="delete"
            size="large"
            sx={{ width: '48px', height: '48px', borderRadius: '8px' }}
            onClick={props.handleClosePage}
          >
            <X fontSize="inherit" />
          </IconButton>
        </Box>
      </Stack>
      {/* 网络名称输入框 */}
      <Stack direction="column" spacing={2}>
        <Typography>Name</Typography>
        <TextField
          fullWidth
          name="name"
          value={copiedProps.name}
          onChange={handleChange}
          helperText="We recommend using something you’ll recognize in logs and on your dashboard, like laptop-alice or server-www-wiki."
        />
      </Stack>
      {/* 网络CIDR输入框 */}
      <Stack direction="column" spacing={2}>
        <Typography>Cidr</Typography>
        <TextField
          fullWidth
          name="cidr"
          disabled
          value={copiedProps.cidr}
          onChange={handleChange}
          helperText="Roles determine how hosts can interact with each other through firewall rules."
        />
      </Stack>
      {/* 提示未保存的更改 */}
      <Stack direction="row" spacing={1}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert icon={false} severity="success" sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>You have unsaved changes</Typography>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton variant="contained" color="primary" loading={loading} onClick={handleConfirm}>
                Save
              </LoadingButton>
            </Stack>
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
