import { describe, it, expect } from "vitest";
import { getTemplates, getTemplateById } from "@/lib/templates";

describe("templates", () => {
  it("returns all templates", () => {
    const templates = getTemplates();
    expect(templates).toHaveLength(3);
    expect(templates.map((t) => t.id)).toEqual([
      "vacances-classiques",
      "vacances-plage",
      "voyage-etranger",
    ]);
  });

  it("returns a template by id", () => {
    const template = getTemplateById("vacances-classiques");
    expect(template).toBeDefined();
    expect(template!.name).toBe("Vacances classiques");
    expect(template!.categories.length).toBeGreaterThanOrEqual(6);
  });

  it("returns undefined for unknown template", () => {
    const template = getTemplateById("unknown");
    expect(template).toBeUndefined();
  });

  it("each template has categories with names, icons, and items", () => {
    const templates = getTemplates();
    for (const t of templates) {
      for (const cat of t.categories) {
        expect(cat.name).toBeTruthy();
        expect(cat.icon).toBeTruthy();
        expect(cat.items.length).toBeGreaterThan(0);
        for (const item of cat.items) {
          expect(typeof item).toBe("string");
          expect(item.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
