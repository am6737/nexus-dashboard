'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deleteNetwork, getNetwork, Network } from '@/api/networks';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import {
  Backdrop,
  Breadcrumbs,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ProhibitInset } from '@phosphor-icons/react/dist/csr/ProhibitInset';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ArrowsCounterClockwise } from '@phosphor-icons/react/dist/ssr/ArrowsCounterClockwise';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import toast from 'react-hot-toast';

// const details = [
//   {
//     ID: '2fpLGUji5mQHOfbnCmuSadb49RZ ',
//     Name: 't1',
//     Cird: '192.168.1.0/24',
//     CreatedAt: '4/21/2024 9:26:58 PM GMT+8',
//   },
//   {
//     Tags: '',
//   },
// ];

const Icons = {
  'arrows-counter-clockwise': ArrowsCounterClockwise,
  'pencil-simple': PencilSimple,
  'prohibit-inset': ProhibitInset,
  trash: Trash,
} as Record<string, Icon>;

interface NetworkDetailCardProps {
  name: string | string[];
  network?: Network | Network[];
}

interface DialogHandlerParams {
  hostId: string | string[];
  key: string;
}

interface DialogContentMap {
  [key: string]: {
    title: string;
    content: React.ReactNode;
    button: string;
  };
}

const NetworkDetailCard: React.FC<NetworkDetailCardProps> = ({ name, network }) => {
  if (!network) {
    return null;
  }

  const networks = Array.isArray(network) ? network : [network]; // 统一处理传入的数据为数组形式

  return (
    <>
      {networks.map((network, index) => {
        const { id, name: networkName, cidr, created_at } = network;
        const networkDetails = [
          { label: 'ID', value: id },
          { label: 'Name', value: networkName },
          { label: 'CIDR', value: cidr },
          { label: 'CreatedAt', value: created_at },
        ];
        return (
          <Card key={index}>
            <CardHeader title={networkName} />
            <CardContent>
              <List>
                {networkDetails.map((detail, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      <div className="flex">
                        <div className="w-[300px]">{detail.label}</div>
                        <div>{detail.value}</div>
                      </div>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

const Page = () => {
  const params = useParams();
  const hostId = params.id as string;
  const [networks, setNetworks] = useState<Network>();
  const router = useRouter();

  const [ready, setReady] = useState(false); // 加载页面的蒙层

  useEffect(() => {
    // 在组件加载时获取网络详情
    const fetchNetworkDetails = async () => {
      try {
        const response = await getNetwork(params.id as string);
        const networkData: Network = response.data;

        // TODO 延迟一秒loading 后期去掉
        setTimeout(() => {
          setNetworks(networkData);
          setReady(true);
        }, 1000);
      } catch (error) {
        toast.error(`getNetwork error ${error}`, {
          duration: 5000,
        });
      }
    };

    fetchNetworkDetails();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [dialogContentText, setDialogContentText] = useState<React.ReactNode>(null);
  const [buttonText, setButtonText] = useState('');

  const [loading, setLoading] = useState(false);

  const dialogContentMap: DialogContentMap = {
    trash: {
      title: `Delete ${params.id}?`,
      content: (
        <>
          Once a host is deleted its certificate cannot be renewed.
          <br />
          <em>Note: If the host currently has a certificate it will continue to be valid until its expiration date.</em>
          <br />
          Are you sure you want to delete <strong>{params.id}</strong>?
        </>
      ),
      button: 'Delete',
    },
    'prohibit-inset': {
      title: `Block ${params.id}?`,
      content: (
        <>
          Only block <strong>{params.id}</strong> if you believe it has been compromised. Once blocked, an update will
          be issued to all other hosts and lighthouses instructing them to reject any attempts to communicate with this
          host.
        </>
      ),
      button: 'Block',
    },
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = () => {
    setLoading(true);
    deleteNetwork(hostId as string)
      .then(() => {
        setTimeout(() => {
          toast.success(`Delete success ${networks?.name}`);
          router.back();
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          toast.error(`${error}`);
        }, 1000);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setOpenDialog(false);
        }, 1000);
      });
  };

  const handleDelete = ({ hostId, key }: DialogHandlerParams) => {
    setOpenDialog(true);
    setConfirmationMessage(dialogContentMap[key].title);
    setDialogContentText(dialogContentMap[key].content);
    setButtonText(dialogContentMap[key].button);
  };

  const iconHandlers: Record<string, (params: DialogHandlerParams) => void> = {
    // 'arrows-counter-clockwise': () => {},
    'pencil-simple': ({ hostId }: DialogHandlerParams) => {
      router.push(`/dashboard/networks/${hostId}/edit`);
    },
    trash: ({ hostId, key }: DialogHandlerParams) => {
      handleDelete({ hostId, key });
    },
    'prohibit-inset': ({ hostId, key }: DialogHandlerParams) => {
      handleDelete({ hostId, key });
    },
  };

  return (
    <Stack spacing={1}>
      {/* 蒙层loading */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={!ready}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack direction="row" spacing={1} alignItems="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/hosts">
            Networks
          </Link>
          <Typography color="text.primary">{networks?.name}</Typography>
        </Breadcrumbs>
        <Box ml="auto">
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            {Object.keys(iconHandlers).map((iconName, index) => {
              const Icon = Icons[iconName];
              const handleIconClick = () => {
                const handler = iconHandlers[iconName];
                if (handler) {
                  handler({ hostId: params.id, key: iconName });
                } else {
                  alert(`No handler for ${iconName}`);
                }
              };
              return (
                <Button key={index} onClick={handleIconClick}>
                  {Icon && (
                    <Icon
                      fill="var(--NavItem-icon-active-color)"
                      fontSize="var(--icon-fontSize-md)"
                      weight={'regular'}
                    />
                  )}
                </Button>
              );
            })}
          </ButtonGroup>
        </Box>
      </Stack>

      {/* Dialog component for confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{confirmationMessage}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton onClick={handleConfirmAction} loading={loading} variant="contained" color="error">
            <span> {buttonText}</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <NetworkDetailCard name={params.id} network={networks} />
    </Stack>
  );
};

export default Page;
