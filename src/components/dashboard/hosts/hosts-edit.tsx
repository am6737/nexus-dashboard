import React, { useEffect, useState } from 'react';
import router from 'next/router';
import { deleteHost, updateHots } from '@/api/hosts';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Button, IconButton, Snackbar, SnackbarOrigin, TextField } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import toast from 'react-hot-toast';

export interface HostEditProps {
  id: string | string[];
  name: string;
  role: string;
  ipAddress: string;
  tags: Tags;
  handleClosePage: () => void;
}

interface Tags {
  [key: string]: string;
}

export function HostEdit(props: HostEditProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpen(false);
  };

  // 保存初始的 props 值
  const [initialProps, setInitialProps] = useState({});
  useEffect(() => {
    setInitialProps({
      name: props.name,
      role: props.role,
      ipAddress: props.ipAddress,
      tags: JSON.stringify(props.tags),
    });
  }, [props.name, props.role, props.ipAddress, props.tags]);

  const [copiedProps, setCopiedProps] = useState({
    name: props.name,
    role: props.role,
    ipAddress: props.ipAddress,
    tags: JSON.stringify(props.tags),
  });

  useEffect(() => {
    const copied = {
      name: props.name,
      role: props.role,
      ipAddress: props.ipAddress,
      tags: JSON.stringify(props.tags),
    };
    setCopiedProps(copied);
  }, [props.name, props.role, props.ipAddress, props.tags]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCopiedProps((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // 检查修改后的值是否与原始值一致
    // @ts-ignore
    const initialPropValue = initialProps[name];
    const isChanged = initialPropValue !== value;
    setOpen(isChanged);
  };

  function handleSave(): void {
    setLoading(true);
    // TODO 延迟一秒展示动画，后期可以去掉
    setTimeout(() => {
      updateHots({
        id: props.id as string,
        name: copiedProps.name,
        role: copiedProps.role,
        ip_address: copiedProps.ipAddress,
      })
        .then(() => {
          toast.success(`Update Host ${copiedProps.name} success`);
          router.back();
        })
        .catch((error) => {
          toast.error(`Host update failed: ${error}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/hosts">
            Hosts
          </Link>
          <Link underline="hover" color="inherit" href={`/dashboard/hosts/${props.id}`}>
            {props.id}
          </Link>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
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
      <Stack direction="row" mb={4}>
        ID: {props.id}
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography>Name</Typography>
        <TextField
          fullWidth
          name="name"
          // id="standard-helperText"
          value={copiedProps.name}
          onChange={handleChange}
          helperText="We recommend using something you’ll recognize in logs and on your dashboard, like laptop-alice or server-www-wiki."
        />
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography>Role</Typography>
        <TextField
          fullWidth
          name="role"
          // id="standard-helperText"
          value={copiedProps.role}
          onChange={handleChange}
          helperText="Roles determine how hosts can interact with each other through firewall rules."
        />
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography>IP address</Typography>
        <TextField
          fullWidth
          name="ipAddress"
          // id="standard-helperText"
          value={copiedProps.ipAddress}
          onChange={handleChange}
          helperText="Specify IP address or leave blank for auto-assignment."
        />
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography>Tags</Typography>
        <TextField
          fullWidth
          name="tags"
          // id="standard-helperText"
          value={copiedProps.tags}
          onChange={handleChange}
          helperText="Tags are facets of identity and take the form “key:value” (e.g. “env:prod”)."
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert icon={false} severity="success" sx={{ width: '100%' }}>
            {/* This is a success Alert inside a Snackbar! */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>You have unsaved changes</Typography>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton color="primary" variant="contained" loading={loading} onClick={handleSave}>
                Save
              </LoadingButton>
            </Stack>
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
