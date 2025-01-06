/**
 * 
 * @returns queryParams:{key:value}
 */
export function getHashQueryParams() {
  // 获取 hash 部分的 URL 
  const hash = window.location.hash;

  // 查找 hash 中 `?` 后面的部分（即 `?id=123&type=111`）
  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) {
    // 如果 hash 中没有 `?`，返回空对象
    return {};
  }

  // 解析 `?` 后面的部分
  const queryString = hash.slice(queryIndex + 1);

  // 使用 URLSearchParams 解析查询字符串
  const params = new URLSearchParams(queryString);

  // 将查询参数存储在对象中
  let queryParams = {};
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
}