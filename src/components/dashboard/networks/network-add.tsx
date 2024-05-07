import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { createNetwork } from '@/api/networks';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Snackbar,
  SnackbarOrigin,
  TextField,
} from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import toast from 'react-hot-toast';

export interface NetworksAddProps {
  id: string | string[];
  name: string;
  cidr: string;
  tags: string;
  handleClosePage: () => void;
}

interface Tags {
  [key: string]: string;
}

export function NetworksAdd(props: NetworksAddProps) {
  const [open, setOpen] = useState(false);
  const [cidrError, setCidrError] = useState(false);
  const router = useRouter();

  // 保存初始的 props 值
  const [initialProps, setInitialProps] = useState({});
  useEffect(() => {
    setInitialProps({
      name: props.name,
      cidr: props.cidr,
      //   tags: props.tags,
    });
  }, [props.name, props.cidr, props.tags]);

  const [copiedProps, setCopiedProps] = useState({
    name: props.name,
    cidr: props.cidr,
    // tags: props.tags,
  });

  useEffect(() => {
    const allFieldsNotEmpty = Object.values(copiedProps).every((value) => value !== '');
    setOpen(allFieldsNotEmpty && !cidrError);
    // setOpen(allFieldsNotEmpty);
  }, [copiedProps]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCopiedProps((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (cidrError) {
      return;
    }

    // setOpen(false);
    setLoading(true);

    createNetwork(copiedProps)
      .then((response) => {
        console.log('createNetwork response', response);
        // TODO 延迟一秒展示loding 后期去掉
        setTimeout(() => {
          toast.success(`Success create network ${response.data.name}`);
          router.back();
        }, 1000);
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCidrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCopiedProps((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    setCidrError(value !== '' && !isValidCIDR(value));
  };

  // CIDR 校验函数
  const isValidCIDR = (input: string) => {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return cidrRegex.test(input);
  };

  return (
    <Stack spacing={2}>
      {/* <Alert severity="error" onClose={() => {}}>
        <AlertTitle>Create Network</AlertTitle>
        This Alert displays the default close icon.
      </Alert> */}
      <Stack direction="row" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/networks">
            Networks
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
          multiline={true}
          maxRows={2}
          // id="standard-helperText"
          value={copiedProps.name}
          onChange={handleChange}
          //   helperText="We recommend using something you’ll recognize in logs and on your dashboard, like laptop-alice or server-www-wiki."
        />
      </Stack>
      <Stack direction="column" spacing={2}>
        <Typography>Cidr</Typography>
        <TextField
          // id="standard-helperText"
          error={cidrError}
          fullWidth
          name="cidr"
          value={copiedProps.cidr}
          onChange={handleCidrChange}
          helperText="Enter the CIDR notation for IP address range, e.g., 192.168.1.0/24."
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
              <Button
                variant="text"
                onClick={() => {
                  setOpen(false);
                  props.handleClosePage();
                }}
              >
                Cancel
              </Button>
              <LoadingButton variant="contained" color="primary" loading={loading} onClick={handleSave}>
                <span>Save</span>
              </LoadingButton>
            </Stack>
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
