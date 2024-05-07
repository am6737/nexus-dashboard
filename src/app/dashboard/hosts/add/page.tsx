'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAllNetworks, Network } from '@/api/networks';

import { HostsAdd, HostsAddProps } from '@/components/dashboard/hosts/hosts-add';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [networks, setNetworks] = useState<Network[]>([]);

  const [networksLoaded, setNetworksLoaded] = useState(false); // 添加状态来跟踪网络列表是否已加载

  useEffect(() => {
    // 在组件加载时获取网络列表
    getAllNetworks()
      .then((response) => {
        console.log('response', response);
        setNetworks(response.data);
        setNetworksLoaded(true); // 设置状态为已加载
      })
      .catch((error) => {
        console.error('Error fetching networks:', error);
      });
  }, []);

  const handleClosePage = () => {
    router.back();
  };

  // 等待网络列表加载完成后再渲染 HostsAdd 组件
  return networksLoaded ? (
    <HostsAdd id={params.id} name="" ipAddress="" networks={networks} handleClosePage={handleClosePage} />
  ) : null;
};

export default Page;
