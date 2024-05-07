'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createEnrollCode } from '@/api/hosts';
import { Backdrop, CircularProgress } from '@mui/material';

import { SetupHosts, SetupHostsProps } from '@/components/dashboard/hosts/hosts-enroll';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const handleClosePage = () => {
    router.back();
  };

  const [enrollCode, setEnrollCode] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    // 在组件加载时获取网络列表
    createEnrollCode(params.id as string)
      .then((response) => {
        // TODO 延迟一秒加载loding效果 后期去掉
        setTimeout(() => {
          // @ts-ignore
          setEnrollCode(response.data.code);
          setReady(true);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error fetching networks:', error);
      });
  }, []);

  const props: SetupHostsProps = {
    hostId: params.id as string,
    code: enrollCode,
  };

  return (
    <>
      {ready ? (
        <SetupHosts {...props} />
      ) : (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Page;
