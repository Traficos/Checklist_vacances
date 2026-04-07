import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ProgressBar";

describe("ProgressBar", () => {
  it("shows percentage", () => {
    render(<ProgressBar checked={3} total={10} />);
    expect(screen.getByText("3/10")).toBeTruthy();
  });

  it("shows 0% when total is 0", () => {
    render(<ProgressBar checked={0} total={0} />);
    expect(screen.getByText("0/0")).toBeTruthy();
  });

  it("renders the bar with correct width", () => {
    const { container } = render(<ProgressBar checked={5} total={10} />);
    const bar = container.querySelector("[data-testid='progress-fill']");
    expect(bar).toBeTruthy();
    expect(bar!.getAttribute("style")).toContain("width: 50%");
  });
});
