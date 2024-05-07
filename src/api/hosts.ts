import request from '@/utils/request';

const Hotss = '/hosts';

// 定义网络对象的类型
export interface Host {
  id: string;
  name: string;
  ip_address: string;
  network_id: string;
  last_seen_at: string;
  created_at: string;
  role: string;
  port: number;
  is_lighthouse: boolean;
  online: boolean;
  static_addresses: null | any;
  tags: null | any;
}

// 定义请求函数的参数类型
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: Record<string, any>;
}

// 定义创建网络响应的类型
interface CreateHotsResponse {
  [x: string]: any;
  id: string;
  name: string;
  cidr: string;
}

export type GetAllHotssParams = {
  /**
   * Filter options
   */
  filters?: string;
  /**
   * Filter by IP address
   */
  ipAddress?: string;
  /**
   * Filter by lighthouse status
   */
  isLighthouse?: boolean;
  /**
   * Number of results to return
   */
  limit?: number;
  /**
   * Filter by name
   */
  name?: string;
  /**
   * Filter by network ID
   */
  networkID?: string;
  /**
   * Offset for pagination
   */
  offset?: number;
  /**
   * Filter by role
   */
  role?: string;
  /**
   * Sorting options
   */
  sort?: string;
  [property: string]: any;
};

// 获取所有网络
export function getAllHotss(params: Partial<GetAllHotssParams> = {}): Promise<Host> {
  if (!params.limit || params.limit === 0) {
    params.limit = 10;
  }
  const queryParams = new URLSearchParams(params as any).toString();
  return request({
    url: `${Hotss}?${queryParams}`,
    method: 'GET',
  });
}

// 定义创建网络请求的参数类型
interface CreateHotsRequest {
  network_id: string;
  name: string;
  ip_address: string;
  role: string;
}

/**
 * 创建网络
 * @param {Object} data
 * @param {String} data.network_id 网络id
 * @param {String} data.name 主机名称
 * @param {String} data.ip_address 主机IP地址，为空则自动分配
 * @param {String} data.role 主机角色
 * @returns
 */
export function createHots(data: CreateHotsRequest): Promise<any> {
  return request({
    url: Hotss,
    method: 'POST',
    data,
  });
}

/**
 * 获取网络信息
 * @param {String} HotsId 网络id
 * @returns
 */
export function getHots(HotsId: string): Promise<Host> {
  return request({
    url: `${Hotss}/${HotsId}`,
    method: 'GET',
  });
}

interface UpdateHotsRequest {
  id: string;
  name: string;
  role: string;
  ip_address: string;
}

/**
 * 更新网络 目前只能修改网络名称
 * @param {String} data.id 主机id
 * @param {Object} data.name 主机名称
 * @param {Object} data.role 主机角色
 * @param {Object} data.ip_address 主机地址
 * @returns
 */
export function updateHots(data: UpdateHotsRequest): Promise<any> {
  return request({
    url: `${Hotss}/${data.id}`,
    method: 'PUT',
    data,
  });
}

/**
 * 删除网络
 * @param {String} HotsId 网络id
 * @returns
 */
export function deleteHost(HotsId: string): Promise<void> {
  return request({
    url: `${Hotss}/${HotsId}`,
    method: 'DELETE',
  });
}

interface Response {
  code: number;
  msg: string;
  data: any;
}

interface EnrollCodeResponse {
  code: string;
  lifetime_seconds: number;
}

/**
 * 创建注册码
 * @param hostId 主机 ID
 * @returns 注册码和生命周期
 */
export function createEnrollCode(hostId: string): Promise<EnrollCodeResponse> {
  return request({
    url: `${Hotss}/${hostId}/enroll-code`,
    method: 'POST',
  });
}

interface EnrollCodeCheckRequest {
  code: string;
}

interface EnrollCodeCheckResponse {
  exists: boolean;
}

/**
 * 检查注册码
 * @param hostId 主机 ID
 * @param code 注册码
 * @returns 如果存在表示还没注册
 */
export function checkEnrollCode(hostId: string, code: string): Promise<EnrollCodeCheckResponse> {
  const requestBody: EnrollCodeCheckRequest = { code };
  return request({
    url: `${Hotss}/${hostId}/enroll-code-check`,
    method: 'POST',
    data: requestBody,
  });
}

export interface EnrollHostResponse {
  enroll_at: number;
}

/**
 * 检查注册码
 * @param hostId 主机 ID
 * @param code 注册码
 */
export function enrollHost(hostId: string, code: string): Promise<EnrollHostResponse> {
  const requestBody: EnrollCodeCheckRequest = { code };
  return request({
    url: `${Hotss}/${hostId}/enroll-code-check`,
    method: 'POST',
    data: requestBody,
  });
}
