import type { Response } from "node-fetch"
import type { ApiResponse } from "../types"

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.error?.code || `HTTP_${response.status}`,
          message: data.error?.message || `Request failed with status ${response.status}`,
          details: data.error?.details,
        },
      }
    }

    return {
      success: true,
      data: data as T,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: "PARSE_ERROR",
        message: "Failed to parse API response",
        details: error,
      },
    }
  }
}
