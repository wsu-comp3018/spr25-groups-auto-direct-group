import api from "../data/api-calls";

export async function requestPasswordReset(emailAddress) {
  const res = await fetch(api + "/user/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailAddress })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(api + "/user/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


