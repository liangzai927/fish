export const getType = (value: any): string => {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object" && value.constructor === Object) {
    return "object";
  }
  return typeof value;
};

export function formatTime(dateString:string) {
  // 创建一个 Date 对象来处理传入的日期字符串
  const inputDate = new Date(dateString);
  
  // 获取当前日期
  const today = new Date();
  
  // 判断输入的日期是否为今天
  const isToday = inputDate.getFullYear() === today.getFullYear() &&
                  inputDate.getMonth() === today.getMonth() &&
                  inputDate.getDate() === today.getDate();
  // 如果是今天，则只显示 hh:mm 格式
  if (isToday) {
      const hours = inputDate.getHours().toString().padStart(2, '0');
      const minutes = inputDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
  } else {
      // 否则显示 yyyy/mm/dd 格式
      const year = inputDate.getFullYear();
      const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
      const day = inputDate.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
  }
}

// 示例用法
// console.log(getType(null)); // 输出: 'null'
// console.log(getType([])); // 输出: 'array'
// console.log(getType({})); // 输出: 'object'
// console.log(getType('Hello')); // 输出: 'string'
// console.log(getType(123)); // 输出: 'number'
// console.log(getType(true)); // 输出: 'boolean'
// console.log(getType(undefined)); // 输出: 'undefined'
// console.log(getType(() => {})); // 输出: 'function'
// console.log(getType(Symbol('test'))); // 输出: 'symbol'
