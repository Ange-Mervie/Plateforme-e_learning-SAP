// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./auth-context";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function AuthState() {
  const { user, loading } = useAuth();
  return <div>{loading ? "loading" : user?.email ?? "anonymous"}</div>;
}

describe("server-backed auth context", () => {
  it("initializes by resolving the server session", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        user: { id: 11, name: "Alex Learner", email: "alex@example.com", role: "apprenant" },
      }), { status: 200 }),
    );

    render(<AuthProvider><AuthState /></AuthProvider>);

    await waitFor(() => expect(screen.getByText("alex@example.com")).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/session", { credentials: "same-origin" });
  });

  it("does not fabricate an authenticated user when session lookup fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    render(<AuthProvider><AuthState /></AuthProvider>);

    await waitFor(() => expect(screen.getByText("anonymous")).toBeTruthy());
  });

  it("only clears the current user after server logout succeeds", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({
        user: { id: 11, name: "Alex Learner", email: "alex@example.com", role: "apprenant" },
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 503 }));

    function LogoutButton() {
      const { logout } = useAuth();
      return <button type="button" onClick={() => void logout().catch(() => undefined)}>Logout</button>;
    }

    render(<AuthProvider><AuthState /><LogoutButton /></AuthProvider>);
    await waitFor(() => expect(screen.getByText("alex@example.com")).toBeTruthy());
    await act(async () => { screen.getByRole("button", { name: "Logout" }).click(); });

    expect(screen.getByText("alex@example.com")).toBeTruthy();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  });
});
