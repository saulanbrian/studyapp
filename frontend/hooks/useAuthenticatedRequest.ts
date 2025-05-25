import createAxiosInstance from "@/api";
import { useAuth } from "@clerk/clerk-expo";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useAuthenticatedRequest() {

  const { getToken } = useAuth()

  const getApi = useCallback(async () => {
    const token = await getToken()
    if (token) {
      const api = createAxiosInstance(token)
      return api
    }
  }, [getToken])

  return { getApi }
}
