// export function parseQuery(
//   queryString?: string,
// ): { [key: string]: string | string[] } {
//   return (queryString ?? "")
//     .replace(/\+/g, " ")
//     .split("&")
//     .filter(Boolean)
//     .reduce(
//       (
//         queryParameters: { [key: string]: string | string[] },
//         keyAndValue: string,
//       ): { [key: string]: string | string[] } => {
//         const keyAndValueCouple = keyAndValue.split("=")
//         const key: string = decodeURIComponent(keyAndValueCouple[0] ?? "")
//         const value = decodeURIComponent(keyAndValueCouple[1] ?? "")
//         const existingValue = queryParameters[key]
//         queryParameters[key] =
//           existingValue === undefined
//             ? value
//             : (Array.isArray(existingValue)
//                 ? existingValue
//                 : [existingValue]
//               ).concat([value])
//         return queryParameters
//       },
//       {},
//     )
// }

export function stringifyQuery(queryParameters?: {
  [key: string]: string | string[]
}): string {
  return Object.entries(queryParameters ?? {})
    .reduce(
      (
        queryArray: string[],
        [key, value]: [string, string | string[]],
      ): string[] => {
        if (Array.isArray(value)) {
          for (const item of value) {
            queryArray.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
            )
          }
        } else {
          queryArray.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`,
          )
        }
        return queryArray
      },
      [],
    )
    .join("&")
    .replace(/\s/g, "+")
}
