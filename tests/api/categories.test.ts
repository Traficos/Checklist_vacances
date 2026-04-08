import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = "http://127.0.0.1:3003";

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

let checklistToken: string;

beforeEach(async () => {
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.checklist.deleteMany();
  const { body } = await api("/api/checklists", {
    method: "POST",
    body: JSON.stringify({ title: "Test" }),
  });
  checklistToken = body.shareToken;
});

describe("POST /api/checklists/[token]/categories", () => {
  it("adds a category", async () => {
    const { status, body } = await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "Documents", icon: "📄" }),
    });
    expect(status).toBe(201);
    expect(body.name).toBe("Documents");
    expect(body.icon).toBe("📄");
    expect(body.position).toBe(0);
  });

  it("auto-increments position", async () => {
    await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "First" }),
    });
    const { body } = await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "Second" }),
    });
    expect(body.position).toBe(1);
  });

  it("rejects empty name", async () => {
    const { status } = await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });
    expect(status).toBe(400);
  });
});

describe("PATCH /api/categories/[id]", () => {
  it("updates category name", async () => {
    const { body: created } = await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "Old Name" }),
    });
    const { status, body } = await api(`/api/categories/${created.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: "New Name" }),
    });
    expect(status).toBe(200);
    expect(body.name).toBe("New Name");
  });
});

describe("DELETE /api/categories/[id]", () => {
  it("deletes a category", async () => {
    const { body: created } = await api(`/api/checklists/${checklistToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name: "To Delete" }),
    });
    const { status } = await api(`/api/categories/${created.id}`, {
      method: "DELETE",
    });
    expect(status).toBe(204);
  });
});
