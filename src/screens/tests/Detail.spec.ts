import { test, expect, Page } from "@playwright/test";

test.describe("Detail Page", () => {
  const TEST_WALLET =
    "bc1pe6y27ey6gzh6p0j250kz23zra7xn89703pvmtzx239zzstg47j3s3vdvvs";

  const TEXT_INSCRIPTION =
    "67fe0bc9b4f647f7d7a0da22e89342024ca0bfe06de82053453761e04084aa2fi0";

  const SVG_INSCRIPTION =
    "aba765c6a961187036043d1629be5298bc06db9718478499177d019e15ea875ai0";

  const HTML_INSCRIPTION =
    "013c873f7bb4374d00999e3c1a2ddf83855f36925da9926579b88115e21ea3aai0";

  const PNG_INSCRIPTION =
    "efbc751890c9b156fe4b4f2a84dd305c460bf5b87c1ded2bef35e59f795d501di0";

  const GIF_INSCRIPTION =
    "d60aac6ae76492f2475765f641c246647b07700a74debfdcec89cc6643e18335i0";

  const WEBP_INSCRIPTION =
    "9a2315da257d6c1010157bec4fecb20472666055ed79cd7462c28cf15b298522i0";

  const explorerContentUrl = (inscriptionId: string) =>
    `https://ord.xverse.app/content/${inscriptionId}`;

  const navigateToInscription = async (
    page: Page,
    walletAddress: string = TEST_WALLET,
    inscriptionId: string,
  ) => {
    await page.goto(`detail/${walletAddress}/${inscriptionId}`);
  };

  // Experimenting with relative locators (Playwright doesn't support it out of the box)
  // Are relative locators inherently "bad"?
  // For integration testing, and NOT unit testing, shouldn't elements depend on another?
  // Debatable, me thinks
  const getSiblingElement = ({
    parentTag = "span",
    parentText,
    followingTag = "span",
  }: {
    parentTag?: string;
    parentText: string;
    followingTag?: string;
  }) =>
    `//${parentTag}[normalize-space(text())='${parentText}']/following::${followingTag}`;

  const testVisualElements = async (
    page: Page,
    inscriptionId: string,
    expectedContent: {
      type: string;
      tag: string;
      attribute?: {
        name: string;
        value: string;
      };
      text?: string;
    },
  ) => {
    // Is locating the element via its tag and nth position "fragile"?
    // Yes, but shouldn't the order be guaranteed? If it changes, is that not a reason for the test to fail?
    // Again, debatable
    const navigationBarHeader = page.locator("h1").nth(0);
    await expect(navigationBarHeader).toHaveText("Details");

    const inscriptionContent = page
      .locator(
        getSiblingElement({
          parentTag: "h1",
          parentText: "Details",
          followingTag: expectedContent.tag,
        }),
      )
      .first();

    if (expectedContent.attribute) {
      await expect(inscriptionContent).toHaveAttribute(
        expectedContent.attribute.name,
        expectedContent.attribute.value,
      );
    }

    if (expectedContent.text) {
      await expect(inscriptionContent).toHaveText(expectedContent.text);
    }

    const backButton = page.getByAltText("back");
    await expect(backButton).toBeVisible();

    const inscriptionTitle = page.locator("h1").nth(1);
    await expect(inscriptionTitle).toHaveText(/Inscription\s*(-?\d+)/);

    const inscriptionIdText = page
      .locator(getSiblingElement({ parentText: "Inscription ID" }))
      .first();
    await expect(inscriptionIdText).toHaveText(inscriptionId);

    const ownerAddressText = page
      .locator(getSiblingElement({ parentText: "Owner Address" }))
      .first();
    await expect(ownerAddressText).toHaveText(TEST_WALLET);

    const attributesSection = page.locator("h1").nth(2);
    await expect(attributesSection).toHaveText("Attributes");

    const outputValueText = page
      .locator(getSiblingElement({ parentText: "Output Value" }))
      .first();
    await expect(outputValueText).toHaveText(/(-?\d+)/);

    const contentLengthText = page
      .locator(getSiblingElement({ parentText: "Content Length" }))
      .first();
    await expect(contentLengthText).toHaveText(/(-?\d+) byte/);

    const locationText = page
      .locator(getSiblingElement({ parentText: "Location" }))
      .first();
    await expect(locationText).toHaveText(
      /^[a-zA-Z0-9]{16}\.\.\.[a-zA-Z0-9]{12}:\d+:\d+$/,
    );

    const genesisTxText = page
      .locator(getSiblingElement({ parentText: "Genesis Transaction" }))
      .first();
    await expect(genesisTxText).toHaveText(
      /^[a-zA-Z0-9]{16}\.\.\.[a-zA-Z0-9]{16}$/,
    );

    const contentTypeText = page
      .locator(getSiblingElement({ parentText: "Content Type" }))
      .first();
    await expect(contentTypeText).toHaveText(expectedContent.type);
  };

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 1198 });
  });

  test("should have page title", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, TEXT_INSCRIPTION);
    const pageTitle = await page.title();
    await expect(pageTitle).toBe("Inscription Viewer");
  });

  test("should display loader when loading inscription details", async ({
    page,
  }) => {
    await navigateToInscription(page, TEST_WALLET, TEXT_INSCRIPTION);
    const loader = page.getByTestId("loader-spinner");
    await expect(loader).toBeVisible();
  });

  test("should display a text inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, TEXT_INSCRIPTION);

    await testVisualElements(page, TEXT_INSCRIPTION, {
      type: "text/plain",
      tag: "div",
      text: "9",
    });
  });

  test("should display an svg inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, SVG_INSCRIPTION);

    await testVisualElements(page, SVG_INSCRIPTION, {
      type: "image/svg+xml",
      tag: "iframe",
      attribute: {
        name: "src",
        value: explorerContentUrl(SVG_INSCRIPTION),
      },
    });
  });

  test("should display a html inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, HTML_INSCRIPTION);

    await testVisualElements(page, HTML_INSCRIPTION, {
      type: "text/html",
      tag: "iframe",
      attribute: {
        name: "src",
        value: explorerContentUrl(HTML_INSCRIPTION),
      },
    });
  });

  test("should display a png inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, PNG_INSCRIPTION);

    await testVisualElements(page, PNG_INSCRIPTION, {
      type: "image/png",
      tag: "img",
      attribute: {
        name: "src",
        value: explorerContentUrl(PNG_INSCRIPTION),
      },
    });
  });

  test("should display a gif inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, GIF_INSCRIPTION);

    await testVisualElements(page, GIF_INSCRIPTION, {
      type: "image/gif",
      tag: "img",
      attribute: {
        name: "src",
        value: explorerContentUrl(GIF_INSCRIPTION),
      },
    });
  });

  test("should display a webp inscription correctly", async ({ page }) => {
    await navigateToInscription(page, TEST_WALLET, WEBP_INSCRIPTION);

    await testVisualElements(page, WEBP_INSCRIPTION, {
      type: "image/webp",
      tag: "img",
      attribute: {
        name: "src",
        value: explorerContentUrl(WEBP_INSCRIPTION),
      },
    });
  });

  test("should return to previous page when back button is clicked", async ({
    page,
  }) => {
    // Navigate to Main page, and look up test wallet
    await page.goto("/");
    const inputField = page.locator("#address");
    const lookUpButton = page.getByText("Look up");
    await inputField.fill(TEST_WALLET);
    await lookUpButton.click();

    // Click on first inscription to navigate to Detail page
    const firstInscription = page
      .getByTestId("inscriptions-list")
      .locator("div")
      .first();

    await firstInscription.click();

    // Finally, hit back and see if where it takes us
    const backButton = page.getByAltText("back");
    await backButton.click();
    const regex = new RegExp(`^.+\\/${TEST_WALLET}$`);
    await expect(page).toHaveURL(regex);
  });

  test("should display an error for a non-existing inscription", async ({
    page,
  }) => {
    await navigateToInscription(page, TEST_WALLET, "made up inscription id");

    const errorMessage = page.getByTestId("error-message");
    // the endpoint returns a 400 as the statusCode, but the error message states it's 500 lol
    await expect(errorMessage).toHaveText(
      "Request failed with status code 500",
    );
  });

  test("should display an error if no inscription is provided", async ({
    page,
  }) => {
    await navigateToInscription(page, "made up wallet", "");

    // not handled by Detail screen, but by the router
    const errorMessage = await page.getByText("404 Not Found");
    await expect(errorMessage).toBeVisible();
  });

  // xverse's api doesn't seem to care if the wallet address provided is wrong
  //   test("should display an error for a non-existing wallet", async ({
  //     page,
  //   }) => {
  //     await navigateToInscription(page, "made up wallet", TEXT_INSCRIPTION);
  //     const errorMessage = page.getByTestId("error-message");
  //     await expect(errorMessage).toHaveText(
  //       "Request failed with status code 500"
  //     );
  //   });
});
