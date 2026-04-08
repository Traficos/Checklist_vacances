import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChecklistItem } from "@/components/ChecklistItem";

const mockItem = {
  id: "1",
  text: "Passeport",
  checked: false,
  note: null,
  dueDate: null,
  position: 0,
  categoryId: "cat1",
};

describe("ChecklistItem", () => {
  it("renders item text", () => {
    render(<ChecklistItem item={mockItem} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Passeport")).toBeTruthy();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const onToggle = vi.fn();
    render(<ChecklistItem item={mockItem} onToggle={onToggle} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith("1", true);
  });

  it("shows strikethrough when checked", () => {
    render(<ChecklistItem item={{ ...mockItem, checked: true }} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    const text = screen.getByText("Passeport");
    expect(text.className).toContain("line-through");
  });

  it("shows due date indicator", () => {
    render(<ChecklistItem item={{ ...mockItem, dueDate: "2026-06-15" }} onToggle={vi.fn()} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("15/06/2026", { exact: false })).toBeTruthy();
  });
});
