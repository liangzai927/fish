// export function parseStringToObject(input: string): Record<string, any> {
//   // 去掉开头和结尾的花括号
//   const trimmedInput = input.trim().slice(1, -1);

//   // 使用正则表达式拆分键值对
//   const pairs = trimmedInput.split(',').map(pair => {
//     // 拆分每一对，使用 ':' 分割键和值
//     const [key, value] = pair.split(':').map(item => item.trim());
//     return { [key]: value }; // 返回一个对象
//   });

//   // 合并所有的键值对到一个对象中
//   return Object.assign({}, ...pairs);
// }

export function parseString(input: string): Record<string, any>[] | Record<string, any> {
    // 去掉开头和结尾的空格
    const trimmedInput = typeof input === 'string' ? input.trim() : String(input).trim();

    // 判断输入是否为数组格式
    if (trimmedInput.startsWith('[') && trimmedInput.endsWith(']')) {
        // 去掉开头和结尾的方括号
        const innerContent = trimmedInput.slice(1, -1).trim();

        // 使用正则表达式拆分对象
        const objects = innerContent.split('},').map(obj => {
            const cleanedObj = obj.trim().endsWith('}') ? obj : obj + '}'; // 确保每个对象以 '}' 结束
            return parseObject(cleanedObj);
        });

        return objects; // 返回数组
    } else if (trimmedInput.startsWith('{') && trimmedInput.endsWith('}')) {
        return parseObject(trimmedInput); // 返回对象
    } else {
        throw new Error('Invalid input format.'); // 抛出错误
    }
}

function parseObject(input: string): Record<string, any> {
    // 去掉开头和结尾的花括号
    const trimmedInput = input.trim().slice(1, -1);

    // 使用正则表达式拆分键值对
    const pairs = trimmedInput.split(',').map(pair => {
        // 拆分每一对，使用 ':' 分割键和值
        const [key, value] = pair.split(':').map(item => item.trim());
        return { [key]: value }; // 返回一个对象
    });

    // 合并所有的键值对到一个对象中
    return Object.assign({}, ...pairs);
}
