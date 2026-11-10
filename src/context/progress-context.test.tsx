// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProgressProvider, useProgress } from "./progress-context";

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

function ProgressControls() {
  const { getProgress, setLessonCompleted, resetProgress } = useProgress();
  const progress = getProgress("fi-test");

  return (
    <div>
      <span>{progress?.completedLessons.join(",") ?? "empty"}</span>
      <button onClick={() => void setLessonCompleted("fi-test", "lesson-2", true, 2)}>Complete</button>
      <button onClick={() => void resetProgress("fi-test")}>Reset</button>
    </div>
  );
}

describe("server-backed progress context", () => {
  it("loads progress from the authenticated API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        rows: [{ course_slug: "fi-test", lesson_title: "lesson-1", completed: 1 }],
      }), { status: 200 }),
    );

    render(<ProgressProvider><ProgressControls /></ProgressProvider>);
    await waitFor(() => expect(screen.getByText("lesson-1")).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith("/api/progress", { credentials: "same-origin" });
  });

  it("reports when server progress cannot be loaded", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 503 }));

    function ProgressError() {
      const { error } = useProgress();
      return <div>{error ?? "no-error"}</div>;
    }

    render(<ProgressProvider><ProgressError /></ProgressProvider>);
    await waitFor(() => expect(
      screen.getByText("Impossible de charger votre progression depuis le serveur."),
    ).toBeTruthy());
  });

  it("writes progress to MySQL before showing a completed lesson", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ rows: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ course_slug: "fi-test", lesson_title: "lesson-2", completed: 1 }],
      }), { status: 200 }));

    render(<ProgressProvider><ProgressControls /></ProgressProvider>);
    await waitFor(() => expect(screen.getByText("empty")).toBeTruthy());
    await act(async () => { screen.getByRole("button", { name: "Complete" }).click(); });

    await waitFor(() => expect(screen.getByText("lesson-2")).toBeTruthy());
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ courseSlug: "fi-test", lessonTitle: "lesson-2", completed: true }),
    });
  });

  it("does not delete the previous local cache until all progress entries are migrated", async () => {
    localStorage.setItem("sap_academy_progress", JSON.stringify([{
      courseSlug: "fi-test",
      completedLessons: ["lesson-1", "lesson-2"],
      lastLessonId: "lesson-2",
      percent: 100,
    }]));
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ rows: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 503 }));

    render(<ProgressProvider><ProgressControls /></ProgressProvider>);

    await waitFor(() => expect(localStorage.getItem("sap_academy_progress")).not.toBeNull());
  });

  it("deletes the previous local cache after every item has been accepted by the server", async () => {
    localStorage.setItem("sap_academy_progress", JSON.stringify([{
      courseSlug: "fi-test",
      completedLessons: ["lesson-1"],
      lastLessonId: "lesson-1",
      percent: 50,
    }]));
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ rows: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ course_slug: "fi-test", lesson_title: "lesson-1", completed: 1 }],
      }), { status: 200 }));

    render(<ProgressProvider><ProgressControls /></ProgressProvider>);

    await waitFor(() => expect(localStorage.getItem("sap_academy_progress")).toBeNull());
    await waitFor(() => expect(screen.getByText("lesson-1")).toBeTruthy());
  });

  it("deletes only the current user's course progress through the API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({
        rows: [{ course_slug: "fi-test", lesson_title: "lesson-1", completed: 1 }],
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    render(<ProgressProvider><ProgressControls /></ProgressProvider>);
    await waitFor(() => expect(screen.getByText("lesson-1")).toBeTruthy());
    await act(async () => { screen.getByRole("button", { name: "Reset" }).click(); });

    expect(fetchMock.mock.calls[1]?.[0]).toBe("/api/progress");
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "DELETE",
      body: JSON.stringify({ courseSlug: "fi-test" }),
    });
  });
});
