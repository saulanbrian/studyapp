import * as FileSystem from "expo-file-system"


export default async function checkFileSize({
  uri,
  options
}: {
  uri: string;
  options?: FileSystem.InfoOptions
}): Promise<number | null> {
  const file = await FileSystem.getInfoAsync(uri, { size: true })
  return file.exists && !file.isDirectory ? file.size : null
}
