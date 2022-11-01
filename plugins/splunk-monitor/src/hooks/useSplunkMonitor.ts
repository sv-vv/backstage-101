import { useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/lib/useAsync";
import { splunkMonitorApiRef } from "../api/types";

export const useSplunkMonitorApi = () => {
  const splunkMonitorApi = useApi(splunkMonitorApiRef);

  return useAsync(async (): Promise<any[]> => {

    const response = await splunkMonitorApi.getStatus();
    const data = await response.json();
    return data.status;
  }, []);

}