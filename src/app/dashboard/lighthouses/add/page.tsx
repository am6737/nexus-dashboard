'use client';

import { useParams, useRouter } from 'next/navigation';

import { LighthousesAdd, LighthousesAddProps } from '@/components/dashboard/lighthouses/lighthouses-add';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const handleClosePage = () => {
    router.back();
  };

  const hostEditProps: LighthousesAddProps = {
    id: params.id,
    name: '',
    role: '',
    ipAddress: '',
    publicIPpAddress: '',
    port: 7777,
    tags: '',
    rules: ['ping', 'tcp'],
    handleClosePage: handleClosePage,
  };

  return <LighthousesAdd {...hostEditProps}></LighthousesAdd>;
};

export default Page;
