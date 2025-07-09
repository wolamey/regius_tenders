// src/utils/tryProtectedRequest.js
export async function tryProtectedRequest({
  url,
  method = "GET",
  body = null,
  token,
  refreshToken,
  setCookie,
  logout,
  headers = {},
  retry = false,
}) {
  const requestConfig = {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  };

  if (body) {
    requestConfig.body = JSON.stringify(body);
    requestConfig.headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, requestConfig);
  const data = await response.json();

  if (response.status === 404 || response.status === 401 && !retry) {
    const newToken = await refreshToken();
    if (!newToken) return logout();

    return await tryProtectedRequest({
      url,
      method,
      body,
      token: newToken,
      refreshToken,
      setCookie,
      logout,
      headers,
      retry: true,
    });
  }

  return { data, response };
}
