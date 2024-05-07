import React, { useEffect, useState } from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Alert,
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface LighthousesAddProps {
  id: string | string[];
  name: string;
  role: string;
  ipAddress: string;
  publicIPpAddress: string;
  port: number;
  tags: string;
  rules: string[];
  handleClosePage: () => void;
}

interface Tags {
  [key: string]: string;
}

export function LighthousesAdd(props: LighthousesAddProps) {
  const [open, setOpen] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false); // Track if any changes made

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    // Check if there are unsaved changes
    if (hasChanges) {
      // Do not close the alert
      return;
    }
    setOpen(false);
  };

  // 保存初始的 props 值
  const [initialProps, setInitialProps] = useState({});
  useEffect(() => {
    setInitialProps({
      name: props.name,
      publicIPpAddress: props.publicIPpAddress,
      port: props.port,
      role: props.role,
      ipAddress: props.ipAddress,
      tags: props.tags,
      rules: props.rules,
    });
  }, [props.name, props.publicIPpAddress, props.port, props.role, props.ipAddress, props.tags, props.rules]);

  const [copiedProps, setCopiedProps] = useState({
    name: props.name,
    publicIPpAddress: props.publicIPpAddress,
    port: props.port,
    role: props.role,
    ipAddress: props.ipAddress,
    tags: props.tags,
    rules: props.rules,
  });

  //   useEffect(() => {
  //     const copied = {
  //       name: props.name,
  //       publicIPpAddress: props.publicIPpAddress,
  //       port: props.port,
  //       role: props.role,
  //       ipAddress: props.ipAddress,
  //       tags: props.tags,
  //     };
  //     setCopiedProps(copied);
  //   }, [props.name, props.publicIPpAddress, props.port, props.role, props.ipAddress, props.tags]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCopiedProps((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check if any field has changed
    let changed = false;
    for (const key in initialProps) {
      if (copiedProps.hasOwnProperty(key)) {
        // @ts-ignore
        if (copiedProps[key] !== value) {
          changed = true;
          break;
        } else {
          changed = false;
        }
      }
    }

    // // Check if all fields in copiedProps are empty
    // let allFieldsEmpty = true;
    // for (const key in copiedProps) {
    //   if (copiedProps[key] !== '') {
    //     allFieldsEmpty = false;
    //     break;
    //   }
    // }

    // if (allFieldsEmpty) {
    //   setOpen(false);
    //   setHasChanges(false);
    //   return;
    // }

    setOpen(changed);
    setHasChanges(changed);
  };

  const handleSave = () => {
    setOpen(false);
    setHasChanges(false);
  };

  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
  ];

  //   const top100Films = ['ping', 'tcp'];

  //   const handleAutocompleteChange = (event, value) => {
  //     // Do something with the selected value
  //     console.log('Selected value:', value);
  //   };

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
        <Typography>Public IP</Typography>
        <TextField
          fullWidth
          name="publicIPpAddress"
          // id="standard-helperText"
          value={copiedProps.publicIPpAddress}
          onChange={handleChange}
          //   helperText="Specify IP address or leave blank for auto-assignment."
        />
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography>Port</Typography>
        <TextField
          fullWidth
          name="port"
          // id="standard-helperText"
          value={copiedProps.port}
          onChange={handleChange}
          //   helperText="Specify IP address or leave blank for auto-assignment."
        />
      </Stack>

      {/* <Stack direction="column" spacing={2}>
        <Typography>Role</Typography>
        <TextField
          fullWidth
          name="role"
          // id="standard-helperText"
          value={copiedProps.role}
          onChange={handleChange}
          //   helperText="Roles determine how hosts can interact with each other through firewall rules."
        />
      </Stack> */}

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
        <Typography>Rules</Typography>
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={top100Films}
          disableCloseOnSelect
          getOptionLabel={(option) => option.title}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.title}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
              {option.title}
            </li>
          )}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
      {/* <Stack direction="column" spacing={2}>
        <Typography>Tags</Typography>
        <TextField
          fullWidth
          name="tags"
          // id="standard-helperText"
          value={copiedProps.tags} // Check if tags is empty object
          onChange={handleChange}
          helperText="Tags are facets of identity and take the form “key:value” (e.g. “env:prod”)."
        />
      </Stack> */}
      <Stack direction="row" spacing={1}>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          onClose={handleClose}
        >
          <Alert icon={false} severity="success" sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>You have unsaved changes</Typography>
              <Button
                variant="text"
                onClick={() => {
                  setOpen(false);
                  setHasChanges(false);
                  props.handleClosePage();
                }}
              >
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
