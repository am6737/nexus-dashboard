import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createHots } from '@/api/hosts';
import { createNetwork, Network } from '@/api/networks';
import { isValidIpAddress, isValidIPForCIDR } from '@/utils/util';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Alert, Autocomplete, Box, Button, Checkbox, IconButton, Snackbar, TextField } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import toast from 'react-hot-toast';

export interface HostsAddProps {
  id: string | string[];
  name: string;
  ipAddress: string;
  networks: Network[];
  handleClosePage: () => void;
}

export function HostsAdd(props: HostsAddProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [cidrError, setCidrError] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [copiedProps, setCopiedProps] = useState({
    name: props.name,
    ipAddress: props.ipAddress,
    networks: props.networks,
  });

  useEffect(() => {
    const allFieldsNotEmpty = Object.values(copiedProps).every((value) => value !== '');
    const isValidAddress = isValidAddr(copiedProps.ipAddress);

    // 检查 IP 地址是否匹配当前选择的网络 CIDR
    const isMatchingCIDR = selectedNetwork ? isValidIPForCIDR(copiedProps.ipAddress, selectedNetwork.cidr) : false;

    console.log('copiedProps.ipAddress', copiedProps.ipAddress);

    // 如果 IP 地址不匹配当前选择的网络 CIDR，则设置 CIDR 错误状态
    if (!isMatchingCIDR && copiedProps.ipAddress !== '' && selectedNetwork && !isValidAddress) {
      setCidrError(true);
    } else {
      setCidrError(false);
    }

    // 设置打开状态
    setOpen(allFieldsNotEmpty && isValidAddress && isMatchingCIDR);
  }, [copiedProps, selectedNetwork]);

  // 处理输入框值变化的回调函数
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateProps(name, value);
  };

  // 提取更新属性的函数
  const updateProps = (name: string, value: string) => {
    setCopiedProps((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   handleChange(event);
  // };

  // const handleCidrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   handleChange(event);
  //   const { value } = event.target;
  //   if (value == '') {
  //     return;
  //   }
  //   if (value !== '' && !isValidAddr(value)) {
  //     setCidrError(true);
  //   } else {
  //     setCidrError(false);
  //   }
  // };

  const isValidAddr = (input: string) => {
    if (!isValidIpAddress(input)) {
      return false;
    }
    return isValidIPForCIDR(input, selectedNetwork!.cidr);
  };

  // 处理选择network变化的回调函数
  const handleNetworkChange = (event: React.SyntheticEvent, value: Network | null) => {
    setSelectedNetwork(value);
  };

  // 处理取消按钮点击事件的回调函数
  const handleCancel = () => {
    setOpen(false);
    props.handleClosePage();
  };

  // 处理保存按钮点击事件的回调函数
  const handleSave = () => {
    if (cidrError) {
      return;
    }
    setLoading(true);

    // TODO 延迟一秒测试动画，后期需删除
    setTimeout(() => {
      createHots({
        network_id: selectedNetwork?.id as string,
        name: copiedProps.name,
        ip_address: copiedProps.ipAddress,
        role: 'none',
      })
        .then((response) => {
          console.log('createNetwork response', response);
          setTimeout(() => {
            toast.success(`Success create network ${response.data.name}`);
            router.push(`/dashboard/hosts/${response.data.id}/enroll`);
          }, 1000);
        })
        .catch((error) => {
          toast.error(`createNetwork error ${error}`, {
            duration: 5000,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/hosts">
            Hosts
          </Link>
          <Typography color="text.primary">Add</Typography>
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
      <Stack direction="column" spacing={2}>
        <Typography>Name</Typography>
        <TextField
          fullWidth
          name="name"
          // id="standard-helperText"
          value={copiedProps.name}
          onChange={handleChange}
          //   helperText="We recommend using something you’ll recognize in logs and on your dashboard, like laptop-alice or server-www-wiki."
        />
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography>Network</Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={copiedProps.networks}
          clearIcon={null}
          getOptionLabel={(option) => `${option.name} (${option.cidr})`}
          onChange={handleNetworkChange}
          renderInput={(params) => (
            <TextField
              sx={{
                borderRadius: 2,
              }}
              {...params}
            />
          )}
        />
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography>IP address</Typography>
        <TextField
          fullWidth
          name="ipAddress"
          error={cidrError}
          // id="standard-helperText"
          value={copiedProps.ipAddress}
          onChange={handleChange}
          helperText="Specify IP address or leave blank for auto-assignment."
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
        >
          <Alert icon={false} severity="success" sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>You have unsaved changes</Typography>
              <Button variant="text" onClick={handleCancel}>
                Cancel
              </Button>
              <LoadingButton variant="contained" color="primary" loading={loading} onClick={handleSave}>
                Save
              </LoadingButton>
            </Stack>
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
