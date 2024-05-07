'use client';

import { useEffect, useState } from 'react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { getNetwork, Network } from '@/api/networks';
import toast from 'react-hot-toast';

import { NetworkEdit, NetworkEditProps } from '@/components/dashboard/networks/network-edit';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const [network, setNetwork] = useState<Network>();

  useEffect(() => {
    getNetwork(params.id as string)
      .then((response) => {
        setNetwork(response.data);
      })
      .catch((error) => {
        toast.error(`getNetwork error ${error}`);
        console.error('Error fetching networks:', error);
      });
  }, []); // 仅在组件挂载时调用一次

  const handleClosePage = () => {
    router.back();
  };

  console.log('network 111hjhjsfhvshjf', network);

  if (network === null || network === undefined) {
    return <div>Loading...</div>; // 返回加载中状态
  }

  const NetworkEditProps: NetworkEditProps = {
    id: network.id,
    name: network.name,
    cidr: network.cidr,
    handleClosePage: handleClosePage,
  };

  return <NetworkEdit {...NetworkEditProps}></NetworkEdit>;
};

export default Page;
