import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = "http://127.0.0.1:3003";

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return { status: res.status, body: await res.json() };
}

describe("POST /api/checklists", () => {
  beforeEach(async () => {
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.checklist.deleteMany();
  });

  it("creates a checklist without template", async () => {
    const { status, body } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Vacances été 2026" }),
    });
    expect(status).toBe(201);
    expect(body.title).toBe("Vacances été 2026");
    expect(body.shareToken).toBeTruthy();
    expect(body.shareToken.length).toBe(12);
    expect(body.categories).toEqual([]);
  });

  it("creates a checklist with template", async () => {
    const { status, body } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Plage 2026", templateId: "vacances-plage" }),
    });
    expect(status).toBe(201);
    expect(body.categories.length).toBe(7);
    expect(body.categories[0].name).toBe("Documents");
    expect(body.categories[0].items.length).toBe(5);
  });

  it("rejects empty title", async () => {
    const { status } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });
    expect(status).toBe(400);
  });
});

describe("GET /api/checklists/[token]", () => {
  it("returns a full checklist with categories and items", async () => {
    const { body: created } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Test", templateId: "vacances-classiques" }),
    });

    const { status, body } = await api(`/api/checklists/${created.shareToken}`);
    expect(status).toBe(200);
    expect(body.title).toBe("Test");
    expect(body.categories.length).toBe(6);
    expect(body.categories[0].items.length).toBeGreaterThan(0);
  });

  it("returns 404 for unknown token", async () => {
    const { status } = await api("/api/checklists/unknown12345");
    expect(status).toBe(404);
  });
});

describe("PATCH /api/checklists/[token]", () => {
  it("updates title", async () => {
    const { body: created } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Old" }),
    });

    const { status, body } = await api(`/api/checklists/${created.shareToken}`, {
      method: "PATCH",
      body: JSON.stringify({ title: "New Title" }),
    });
    expect(status).toBe(200);
    expect(body.title).toBe("New Title");
  });
});

describe("PATCH /api/checklists/[token]/reorder", () => {
  it("reorders categories", async () => {
    const { body: checklist } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Test", templateId: "vacances-classiques" }),
    });

    const categories = checklist.categories;
    const reversed = categories.map((c: { id: string }, i: number) => ({
      id: c.id,
      position: categories.length - 1 - i,
    }));

    const { status } = await api(`/api/checklists/${checklist.shareToken}/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ categories: reversed }),
    });
    expect(status).toBe(200);

    const { body: updated } = await api(`/api/checklists/${checklist.shareToken}`);
    expect(updated.categories[0].id).toBe(categories[categories.length - 1].id);
  });

  it("reorders items across categories", async () => {
    const { body: checklist } = await api("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ title: "Test", templateId: "vacances-classiques" }),
    });

    const firstCategory = checklist.categories[0];
    const secondCategory = checklist.categories[1];
    const movedItem = firstCategory.items[0];

    const { status } = await api(`/api/checklists/${checklist.shareToken}/reorder`, {
      method: "PATCH",
      body: JSON.stringify({
        items: [{ id: movedItem.id, categoryId: secondCategory.id, position: 0 }],
      }),
    });
    expect(status).toBe(200);

    const { body: updated } = await api(`/api/checklists/${checklist.shareToken}`);
    const movedItemInSecond = updated.categories[1].items.find(
      (i: { id: string }) => i.id === movedItem.id
    );
    expect(movedItemInSecond).toBeTruthy();
  });
});
