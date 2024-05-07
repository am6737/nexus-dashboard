'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deleteHost, getHots, Host } from '@/api/hosts';
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

// interface HostDetailCardProps {
//   host: Host;
// }

interface HostDetailCardProps {
  id: string;
  name: string;
  ip_address: string;
  network_id: string;
  last_seen_at: string;
  created_at: string;
  role: string;
  tags: null | any;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [dialogContentText, setDialogContentText] = useState<React.ReactNode>(null);
  const [buttonText, setButtonText] = useState('');

  const [ready, setReady] = useState(false); // 加载页面的蒙层

  const [loading, setLoading] = useState(false);
  const [host, setHost] = useState<Host>();

  useEffect(() => {
    getHots(params.id as string)
      .then((response) => {
        // TODO 延迟一秒loading 后期去掉
        setTimeout(() => {
          setReady(true);
          // @ts-ignore
          setHost(response.data);
        }, 1000);
      })
      .catch((error) => {
        toast.error(`getNetwork error ${error}`);
        console.error('Error fetching networks:', error);
      });
  }, []);

  const hostDetailProps = {
    id: host?.id,
    name: host?.name,
    ip_address: host?.ip_address,
    network_id: host?.network_id,
    last_seen_at: host?.last_seen_at,
    created_at: host?.created_at,
    role: host?.role,
    tags: host?.tags,
  };

  const HostDetailCard: React.FC<HostDetailCardProps> = (props) => {
    return (
      <Card>
        <CardHeader title={props.name} />
        <CardContent>
          <List>
            {Object.entries(props).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText>
                  <div className="flex">
                    <div className="w-[300px]">{key}</div>
                    <div>{value}</div>
                  </div>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const Icons = {
    'arrows-counter-clockwise': ArrowsCounterClockwise,
    'pencil-simple': PencilSimple,
    'prohibit-inset': ProhibitInset,
    trash: Trash,
  } as Record<string, Icon>;

  const dialogContentMap: DialogContentMap = {
    trash: {
      title: `Delete ${host?.name}?`,
      content: (
        <>
          Once a host is deleted its certificate cannot be renewed.
          <br />
          <em>Note: If the host currently has a certificate it will continue to be valid until its expiration date.</em>
          <br />
          Are you sure you want to delete <strong>{host?.name}</strong>?
        </>
      ),
      button: 'Delete',
    },
    'prohibit-inset': {
      title: `Block ${host?.name}?`,
      content: (
        <>
          Only block <strong>{host?.name}</strong> if you believe it has been compromised. Once blocked, an update will
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
    // TODO 延迟一秒展示动画，后期可以去掉
    setTimeout(() => {
      deleteHost(hostDetailProps.id as string)
        .then(() => {
          toast.success(`Delete Host ${hostDetailProps.name} success`);
          router.back();
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

  const handleDelete = ({ hostId, key }: DialogHandlerParams) => {
    setOpenDialog(true);
    setConfirmationMessage(dialogContentMap[key].title);
    setDialogContentText(dialogContentMap[key].content);
    setButtonText(dialogContentMap[key].button);
  };

  const iconHandlers: Record<string, (params: DialogHandlerParams) => void> = {
    'arrows-counter-clockwise': ({ hostId }: DialogHandlerParams) => {
      router.push(`/dashboard/hosts/${hostId}/enroll`);
    },
    'pencil-simple': ({ hostId }: DialogHandlerParams) => {
      router.push(`/dashboard/hosts/${hostId}/edit`);
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
            Hosts
          </Link>
          <Typography color="text.primary">{hostDetailProps.name}</Typography>
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
          <LoadingButton variant="contained" color="error" onClick={handleConfirmAction} loading={loading}>
            {buttonText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {host && <HostDetailCard {...hostDetailProps} />}
    </Stack>
  );
};

export default Page;
