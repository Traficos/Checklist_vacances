import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateChecklistForm } from "@/components/CreateChecklistForm";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("CreateChecklistForm", () => {
  it("renders title input and template selector", () => {
    render(<CreateChecklistForm />);
    expect(screen.getByPlaceholderText("Ex: Vacances été 2026")).toBeTruthy();
    expect(screen.getByText("Aucun template")).toBeTruthy();
  });

  it("disables submit when title is empty", () => {
    render(<CreateChecklistForm />);
    const button = screen.getByRole("button", { name: /créer/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("enables submit when title is filled", async () => {
    render(<CreateChecklistForm />);
    const input = screen.getByPlaceholderText("Ex: Vacances été 2026");
    await userEvent.type(input, "Mon voyage");
    const button = screen.getByRole("button", { name: /créer/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });
});
