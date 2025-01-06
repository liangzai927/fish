/**
 * 
 * @returns scale 缩放值
 * @params canvasRef  可缩放的div
 * @params dragBoxRef 视图窗口
 * 
 */
const calculateAndApplyScale = (canvasRef, dragBoxRef): { scale: number, left: number, top: number } => {
  if (!canvasRef.value) return { scale: 1, left: 0, top: 0 };

  // 获取子元素的总宽度和高度
  const children = canvasRef.value.children;
  const parentRect = dragBoxRef.value.getBoundingClientRect();

  let mostBottomRightCorner = { left: 0, top: 0 };

  for (const child of Array.from(children)) {
    const childElement = child as HTMLElement;
    const childRect = childElement.getBoundingClientRect();

    const right = childRect.left - parentRect.left + childRect.width;
    const bottom = childRect.top - parentRect.top + childRect.height;

    mostBottomRightCorner.left = Math.max(mostBottomRightCorner.left, right);
    mostBottomRightCorner.top = Math.max(mostBottomRightCorner.top, bottom);
  }

  const scale = getScale(parentRect, mostBottomRightCorner)

  return {
    scale,
    ...mostBottomRightCorner
  }
};

export function getScale(parentRect, mostBottomRightCorner) {
  // 计算需要的缩放比例
  const scaleX = parentRect.width / mostBottomRightCorner.left;
  const scaleY = parentRect.height / mostBottomRightCorner.top;
  const scale: number = Math.min(scaleX, scaleY);

  return scale
}

export default calculateAndApplyScale