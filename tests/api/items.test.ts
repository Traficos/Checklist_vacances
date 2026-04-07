import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = "http://127.0.0.1:3001";

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

let categoryId: string;

beforeEach(async () => {
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.checklist.deleteMany();
  const { body: checklist } = await api("/api/checklists", {
    method: "POST",
    body: JSON.stringify({ title: "Test" }),
  });
  const { body: category } = await api(`/api/checklists/${checklist.shareToken}/categories`, {
    method: "POST",
    body: JSON.stringify({ name: "Documents", icon: "📄" }),
  });
  categoryId = category.id;
});

describe("POST /api/categories/[id]/items", () => {
  it("adds an item", async () => {
    const { status, body } = await api(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text: "Passeport" }),
    });
    expect(status).toBe(201);
    expect(body.text).toBe("Passeport");
    expect(body.checked).toBe(false);
    expect(body.position).toBe(0);
  });

  it("rejects empty text", async () => {
    const { status } = await api(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text: "" }),
    });
    expect(status).toBe(400);
  });
});

describe("PATCH /api/items/[id]", () => {
  it("toggles checked", async () => {
    const { body: created } = await api(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text: "Passeport" }),
    });
    const { status, body } = await api(`/api/items/${created.id}`, {
      method: "PATCH",
      body: JSON.stringify({ checked: true }),
    });
    expect(status).toBe(200);
    expect(body.checked).toBe(true);
  });

  it("updates note and due date", async () => {
    const { body: created } = await api(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text: "Passeport" }),
    });
    const { status, body } = await api(`/api/items/${created.id}`, {
      method: "PATCH",
      body: JSON.stringify({ note: "Check expiry", dueDate: "2026-06-15" }),
    });
    expect(status).toBe(200);
    expect(body.note).toBe("Check expiry");
    expect(body.dueDate).toBe("2026-06-15");
  });
});

describe("DELETE /api/items/[id]", () => {
  it("deletes an item", async () => {
    const { body: created } = await api(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text: "To Delete" }),
    });
    const { status } = await api(`/api/items/${created.id}`, {
      method: "DELETE",
    });
    expect(status).toBe(204);
  });
});
