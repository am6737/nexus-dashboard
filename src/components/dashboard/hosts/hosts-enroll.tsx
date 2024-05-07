import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { AppleLogo, Desktop, LinuxLogo, WindowsLogo } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';

import 'highlight.js/styles/dark.css';

import { useRouter } from 'next/navigation';
import { checkEnrollCode } from '@/api/hosts';

import CopyableCodeSnippet from '@/components/codeblock/copyableCodeSnippet';

// const LinuxLogoIcon: Icon = LinuxLogo;
export const navIcons = {
  'linux-logo': LinuxLogo,
  'apple-logo': AppleLogo,
} as Record<string, Icon>;

const versions = [
  { label: 'amd64', year: 1994 },
  { label: 'arm64', year: 1972 },
];

export interface SetupHostsProps {
  hostId: string;
  code: string;
}

export function SetupHosts(props: SetupHostsProps) {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [selectedOs, setSelectedOs] = useState<number | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);

  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  const route = useRouter();

  const handleOsSelect = (index: number) => {
    setSelectedOs(null);
    setSelectedVersion('');
    setSelectedVersionIndex(null);

    setSelectedButton(index);
    setSelectedOs(index);
  };

  const handleVersionSelect = (event: SelectChangeEvent) => {
    const versionIndex = parseInt(event.target.value as string, 10);
    setSelectedVersion(event.target.value as string);
    setSelectedVersionIndex(versionIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      checkEnrollCode(props.hostId, props.code)
        .then((response) => {
          if (!response.data.exists) {
            route.push(`/dashboard/hosts/${props.hostId}`);
          }
        })
        .catch((error) => {
          console.error('Error fetching networks:', error);
        });
    }, 5000);

    return () => clearInterval(timer); // 清除定时器
  }, []); // 空数组表示仅在组件加载时执行

  const Item = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 240,
    height: 58,
  }));

  const platformItem = [
    {
      name: 'Linux',
      icon: <LinuxLogo fontSize="30" />,
      versions: [
        {
          label: 'amd64',
          year: 1994,
          downloadText: 'Download dnclient for Linux (amd64)',
          enrollText: 'Enroll host and start for Linux (amd64)',
          code: `curl -O xxx -code ${props.code}`,
        },
        {
          label: 'arm64',
          year: 1972,
          downloadText: 'Download dnclient for Linux (arm64)',
          enrollText: 'Enroll host and start for Linux (arm64)',
          code: `curl -O xxx -code ${props.code}`,
        },
      ],
    },
    {
      name: 'Macos',
      icon: <AppleLogo fontSize="30" />,
      versions: [
        {
          label: 'Universal',
          year: 0,
          downloadText: 'Download dnclient for Macos (Universal)',
          enrollText: 'Enroll host and start for Macos (Universal)',
          code: `curl -O xxx -code ${props.code}`,
        },
        {
          label: 'Universal (DMG)',
          year: 0,
          downloadText: 'Download dnclient for Macos (Universal DMG)',
          enrollText: 'Enroll host and start for Macos (Universal DMG)',
          code: `curl -O xxx -code ${props.code}`,
        },
      ],
    },
    {
      name: 'Windows',
      icon: <WindowsLogo fontSize="30" />,
      versions: [
        {
          label: 'amd64',
          year: 1994,
          downloadText: 'Download dnclient for Windows (amd64)',
          enrollText: 'Enroll host and start for Windows (amd64)',
          code: `curl -O xxx -code ${props.code}`,
        },
        {
          label: 'arm64',
          year: 1972,
          downloadText: 'Download dnclient for Windows (arm64)',
          enrollText: 'Enroll host and start for Windows (arm64)',
          code: `curl -O xxx -code ${props.code}`,
        },
      ],
    },
    {
      name: 'Other',
      icon: <Desktop fontSize="30" />,
      versions: [
        {
          label: 'docker',
          year: 0,
          downloadText: 'Download dnclient for Other (docker)',
          enrollText: 'Enroll host and start for Other (docker)',
          code: 'docker pull dl.defined.net/9b82a8a5/v0.4.1/dnclient',
        },
        {
          label: 'docker compose',
          year: 0,
          downloadText: 'Download dnclient for Other (docker compose)',
          enrollText: 'Enroll host and start for Other (docker compose)',
          code: 'docker-compose pull dl.defined.net/9b82a8a5/v0.4.1/dnclient',
        },
      ],
    },
  ];

  return (
    <Stack spacing={5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Set up hostname
        </Typography>
      </Stack>

      {/* Step 1: Select OS */}

      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight="bold">
          1. Select OS
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {platformItem.map((item, index) => (
              <Grid xs={2} sm={6} md={3} key={index}>
                <Item
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderColor: 'primary.main',
                  }}
                  variant="outlined"
                  onClick={() => handleOsSelect(index)}
                >
                  <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                    {' '}
                    {item.icon}
                    <Box sx={{ marginLeft: 1 }}>{item.name}</Box>
                  </Box>
                  {selectedButton === index ? <CheckCircleIcon color="primary" /> : ''}
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      {/* Step 2: Select Version */}
      {selectedOs !== null && (
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight="bold">
            2. Select version
          </Typography>
          <FormControl fullWidth>
            {/* <InputLabel id="version-select-label">Version</InputLabel> */}
            <Select
              labelId="version-select-label"
              id="version-select"
              value={selectedVersion}
              onChange={handleVersionSelect}
            >
              {platformItem[selectedOs].versions.map((version, index) => (
                <MenuItem key={index} value={index}>
                  {version.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {/* Step 3 & 4: Download dnclient and Enroll host */}
      {selectedOs !== null && selectedVersionIndex !== null && (
        <>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" fontWeight="bold">
              {platformItem[selectedOs].versions[selectedVersionIndex].downloadText}
              <Typography mt={1} variant="caption" display="block" gutterBottom>
                Run the provided curl command directly on the host.
              </Typography>
            </Typography>

            <CopyableCodeSnippet
              code={platformItem[selectedOs].versions[selectedVersionIndex].code}
            ></CopyableCodeSnippet>
          </Stack>

          <Stack direction="column" spacing={2} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h6" fontWeight="bold">
              {platformItem[selectedOs].versions[selectedVersionIndex].enrollText}
              <Typography mt={1} variant="caption" display="block" gutterBottom>
                In a terminal, run the following command to enroll the host.
              </Typography>
            </Typography>

            <CopyableCodeSnippet
              code={platformItem[selectedOs].versions[selectedVersionIndex].code}
            ></CopyableCodeSnippet>

            <Typography
              sx={{
                ml: -5,
              }}
              variant="caption"
              display="block"
              gutterBottom
            >
              <LoadingButton loadingPosition="end" endIcon={<CheckCircleIcon />} loading={loading} /> Waiting for host…
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
}
