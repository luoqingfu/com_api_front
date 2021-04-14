// 获取url 参数
export function getQueryString(name) {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
        location.href
        // eslint-disable-next-line no-sparse-arrays
      ) || [, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}
// 序列化请求参数
export function serializeData(obj) {
  let arr = [];
  for (let i in obj) {
    if (Object.hasOwnProperty.call(obj, i)) {
      arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
    }
  }
  return arr.join("&");
}
