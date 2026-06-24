export function successResponse<T>(message: string, data?: T, meta?: object) {
  return {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
}
