import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/github-actions/);
  await expect(
    page.getByRole("heading", { name: "Vite + React" })
  ).toBeVisible();
});
