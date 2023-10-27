import { test, expect, Page } from "@playwright/test";

test.describe("Main Page", () => {
  const VALID_ADDRESS =
    "bc1pe6y27ey6gzh6p0j250kz23zra7xn89703pvmtzx239zzstg47j3s3vdvvs";

  const validAddressUrlRegex = new RegExp(`^.+\\/${VALID_ADDRESS}$`);

  const lookUpValidAddress = async ({
    page,
    clickButton = true,
    address = VALID_ADDRESS,
  }: {
    page: Page;
    clickButton?: boolean;
    address?: string;
  }) => {
    const inputField = page.locator("#address");
    const button = page.locator("button");
    await inputField.fill(address);
    clickButton && (await button.click());
  };

  const waitForApiResponse = async (
    page: Page,
    endpoint = "https://api-3.xverse.app/v1/address/",
  ) => {
    await page.waitForResponse((resp) => resp.url().includes(endpoint));
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 375, height: 1198 });
  });

  test("should have page title", async ({ page }) => {
    const pageTitle = await page.title();
    await expect(pageTitle).toBe("Inscription Viewer");
  });

  test("should load the page correctly", async ({ page }) => {
    const title = page.locator("h1");
    await expect(title).toHaveText("Ordinals Inscription Lookup");

    const label = page.locator("label");
    await expect(label).toHaveText("Owner Bitcoin Address:");

    const inputField = page.locator("#address");
    await expect(inputField).toBeVisible();

    const button = page.locator("button");
    await expect(button).toBeVisible();
    await expect(button).toHaveText("Look up");
  });

  test("should disable 'Look up' button when address input field is empty", async ({
    page,
  }) => {
    const button = page.locator("button");
    await expect(button).toBeDisabled();
  });

  test("should display loader when button is clicked with a valid address", async ({
    page,
  }) => {
    await lookUpValidAddress({ page });
    const loader = page.getByTestId("loader-spinner");
    await expect(loader).toBeVisible();

    const button = page.locator("button");
    await expect(button).toBeDisabled();
  });

  test("should disable button when loading", async ({ page }) => {
    await lookUpValidAddress({ page });

    const button = page.locator("button");
    await expect(button).toBeDisabled();
  });

  test("should display inscriptions list when data is fetched", async ({
    page,
  }) => {
    await lookUpValidAddress({ page });

    const inscriptionsList = page.getByTestId("inscriptions-list");
    await expect(inscriptionsList).toBeVisible();
  });

  test("should navigate to /:address when button is clicked with a valid address", async ({
    page,
  }) => {
    await lookUpValidAddress({ page });

    await expect(page).toHaveURL(validAddressUrlRegex);
  });

  test("should navigate to /:address when enter is pressed with a valid address", async ({
    page,
  }) => {
    await lookUpValidAddress({ page, clickButton: false });

    const inputField = page.locator("#address");
    await inputField.press("Enter");

    await expect(page).toHaveURL(validAddressUrlRegex);
  });

  test("should display error message when input field contains unescaped characters", async ({
    page,
  }) => {
    await lookUpValidAddress({ page, address: `“${VALID_ADDRESS}”` });

    const errorMessage = page.getByTestId("error-message");
    await expect(errorMessage).toHaveText(
      "Request path contains unescaped characters",
    );
  });

  test("should display error message when looking up invalid address", async ({
    page,
  }) => {
    await lookUpValidAddress({ page, address: "i am not a real address" });

    const errorMessage = page.getByTestId("error-message");
    await expect(errorMessage).toHaveText(
      "Request failed with status code 400",
    );
  });

  test("should display more inscriptions when load more button is clicked", async ({
    page,
  }) => {
    await lookUpValidAddress({ page });

    const loadMoreButton = await page.getByText("Load more");
    const inscriptionsList = await page
      .getByTestId("inscriptions-list")
      .locator("span");

    await waitForApiResponse(page);
    await expect(await inscriptionsList.count()).toBe(30);

    // Will be flaky with an active wallet
    // Consider using an untouched wallet or mock the returned data
    await loadMoreButton.click();
    await waitForApiResponse(page);

    await expect(loadMoreButton).not.toBeVisible();
    // Some results return an empty inscriptions array
    // They aren't ordinals - so what are they?
    await expect(await inscriptionsList.count()).toBeGreaterThanOrEqual(44);
  });

  test("should navigate to /detail/:address/:inscriptionId when an inscription is clicked", async ({
    page,
  }) => {
    await lookUpValidAddress({ page });

    const firstInscription = page
      .getByTestId("inscriptions-list")
      .locator("div")
      .first();

    const firstInscriptionText = await firstInscription.textContent();
    const firstInscriptionId = firstInscriptionText?.split(" ")[1];

    await firstInscription.click();

    const regex = new RegExp(`^.+\\/${VALID_ADDRESS}/${firstInscriptionId}`);
    await expect(page).toHaveURL(regex);
  });
});
