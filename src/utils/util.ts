export function isValidIPForCIDR(ip: string, cidr: string): boolean {
  // 将 CIDR 子网分解为 IP 地址和子网前缀长度
  const [subnetIP, subnetPrefix] = cidr.split('/');

  // 将 IP 地址和子网掩码转换为二进制字符串
  const subnetBinary = subnetIP
    .split('.')
    .map((part) => parseInt(part).toString(2).padStart(8, '0'))
    .join('');
  const ipBinary = ip
    .split('.')
    .map((part) => parseInt(part).toString(2).padStart(8, '0'))
    .join('');

  // 通过前缀长度截取子网掩码和 IP 地址的二进制字符串
  const subnetPrefixBinary = subnetBinary.slice(0, parseInt(subnetPrefix));
  const ipPrefixBinary = ipBinary.slice(0, parseInt(subnetPrefix));

  // 检查 IP 地址的前缀是否与子网的前缀相同
  return subnetPrefixBinary === ipPrefixBinary;
}

export function isValidIpAddress(ipAddress: string): boolean {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ipAddress);
}
