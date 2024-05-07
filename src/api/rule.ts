import request from '@/utils/request';
import { ruRU } from '@mui/x-date-pickers';

const Rules = '/rules';

export interface Rule {
  id: string;
  name: string;
  direction: string;
  proto: string;
  port: string;
  action: string;
  host: string[];
  description: string;
  createdAt: string;
}

/**
 * 创建网络
 * @returns
 */
export type CreateHruleRequest = {
  action: string;
  description?: string;
  host?: string[];
  name?: string;
  port: string;
  proto: string;
  type: string;
  [property: string]: any;
};

export enum Proto {
  Any = 'any',
  Icmp = 'icmp',
  Tcp = 'tcp',
  Udp = 'udp',
}

/**
 * 创建规则
 * @param {Object} data
 * @returns
 */
export function creatRule(data: CreateHruleRequest): Promise<any> {
  return request({
    url: Rules,
    method: 'POST',
    data,
  });
}

export type ListRuleRequest = {
  /**
   * Host ID
   */
  host_id?: string;
  /**
   * Page number
   */
  page_num?: number;
  /**
   * Number of results to return
   */
  page_size?: number;
  [property: string]: any;
};

/**
 * 获取规则列表
 * @returns
 */
export function listRule(params: ListRuleRequest): Promise<Rule[]> {
  const queryParams = new URLSearchParams(params as any).toString();

  return request({
    url: `${Rules}?${queryParams}`,
    method: 'GET',
  });
}

/**
 * 删除规则
 * @param {String} id 规则id
 * @returns
 */
export function deleteRule(id: string): Promise<void> {
  return request({
    url: `${Rules}/${id}`,
    method: 'DELETE',
  });
}
