import request from '@/utils/request';

// API路径
const networks = '/networks';

// 定义网络对象的类型
export interface Network {
  id: string;
  name: string;
  cidr: string;
  created_at: string;
}

// 定义请求函数的参数类型
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: Record<string, any>;
}

// 定义创建网络响应的类型
interface CreateNetworkResponse {
  [x: string]: any;
  id: string;
  name: string;
  cidr: string;
}

// 获取所有网络
export function getAllNetworks(): Promise<any> {
  return request({
    url: networks,
    method: 'GET',
  });
}

// 定义创建网络请求的参数类型
interface CreateNetworkRequest {
  name: string;
  cidr: string;
}

/**
 * 创建网络
 * @param {Object} data
 * @param {String} data.name 网络名称
 * @param {String} data.cidr 网络CIDR
 * @returns
 */
export function createNetwork(data: CreateNetworkRequest): Promise<any> {
  return request({
    url: networks,
    method: 'POST',
    data,
  });
}

/**
 * 获取网络信息
 * @param {String} networkId 网络id
 * @returns
 */
export function getNetwork(networkId: string): Promise<any> {
  return request({
    url: `${networks}/${networkId}`,
    method: 'GET',
  });
}

interface UpdateNetworkRequest {
  id: string;
  name: string;
}

/**
 * 更新网络 目前只能修改网络名称
 * @param {Object} data 网络信息
 * @param {String} data.id 网络id
 * @param {Object} data.name 网络名称
 * @returns
 */
export function updateNetwork(data: UpdateNetworkRequest): Promise<any> {
  return request({
    url: `${networks}/${data.id}`,
    method: 'PUT',
    data,
  });
}

/**
 * 删除网络
 * @param {String} networkId 网络id
 * @returns
 */
export function deleteNetwork(networkId: string): Promise<void> {
  return request({
    url: `${networks}/${networkId}`,
    method: 'DELETE',
  });
}
