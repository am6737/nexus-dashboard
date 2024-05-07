'use client';

import { useEffect, useState } from 'react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { getHots } from '@/api/hosts';
import { Backdrop, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

import { paths } from '@/paths';
import { HostEdit, HostEditProps } from '@/components/dashboard/hosts/hosts-edit';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const handleClosePage = () => {
    router.back();
  };

  const [ready, setReady] = useState<boolean>(false);

  const [hostEditProps, setHostEditProps] = useState<HostEditProps>();

  useEffect(() => {
    getHots(params.id as string)
      .then((response) => {
        // TODO 延迟一秒loading 后期去掉
        setTimeout(() => {
          setReady(true);
          setHostEditProps({
            // @ts-ignore
            id: response.data.id,
            // @ts-ignore
            name: response.data.name,
            // @ts-ignore
            role: response.data.role,
            // @ts-ignore
            ipAddress: response.data.ip_address,
            tags: {
              tag1: 'value1',
              tag2: 'value2',
              tag3: 'value3',
            },
            handleClosePage: handleClosePage,
          });
        }, 1000);
      })
      .catch((error) => {
        toast.error(`getNetwork error ${error}`);
        console.error('Error fetching networks:', error);
      });
  }, []);

  // const hostEditProps: HostEditProps = {
  //   id: params.id,
  //   name: 'd',
  //   role: 'Admin',
  //   ipAddress: '192.168.1.1',
  //   tags: {
  //     tag1: 'value1',
  //     tag2: 'value2',
  //     tag3: 'value3',
  //   },
  //   handleClosePage: handleClosePage,
  // };

  return (
    <>
      {ready ? (
        // @ts-ignore
        <HostEdit {...hostEditProps}></HostEdit>
      ) : (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Page;
