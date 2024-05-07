'use client';

import { redirect, useParams, useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { NetworksAdd, NetworksAddProps } from '@/components/dashboard/networks/network-add';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const handleClosePage = () => {
    router.back();
  };

  const hostEditProps: NetworksAddProps = {
    id: params.id,
    name: '',
    cidr: '',
    tags: '',
    handleClosePage: handleClosePage,
  };

  return <NetworksAdd {...hostEditProps}></NetworksAdd>;
};

export default Page;
