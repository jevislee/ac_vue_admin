//获取搜索参数
export const getSearchParams = (searchItems) => {
  const searchParams = {}
  for (let key in searchItems) {
    searchParams[key] = searchItems[key].value
  }
  return searchParams
}

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
