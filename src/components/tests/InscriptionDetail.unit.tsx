import { act, render, screen, waitFor } from "../../test-utils";
import { InscriptionDetail, InscriptionDetailI } from "../InscriptionDetail";

let mockInscriptionData: InscriptionDetailI;

describe("InscriptionDetail", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        Promise.resolve(new Response("Sample text content")),
      );

    // reset mock data
    mockInscriptionData = {
      id: "67fe0bc9b4f647f7d7a0da22e89342024ca0bfe06de82053453761e04084aa2fi0",
      number: 579680,
      address: "bc1pe6y27ey6gzh6p0j250kz23zra7xn89703pvmtzx239zzstg47j3s3vdvvs",
      genesis_tx_id:
        "67fe0bc9b4f647f7d7a0da22e89342024ca0bfe06de82053453761e04084aa2f",
      location:
        "67fe0bc9b4f647f7d7a0da22e89342024ca0bfe06de82053453761e04084aa2f:0:0",
      content_type: "text/plain;charset=utf-8",
      content_length: 1,
      value: 10089,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders InscriptionDetail component with correct data", async () => {
    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });

    expect(
      screen.getByText("Inscription " + mockInscriptionData.number),
    ).toBeInTheDocument();
    expect(screen.getByText(mockInscriptionData.id)).toBeInTheDocument();
    expect(screen.getByText(mockInscriptionData.address)).toBeInTheDocument();
    expect(
      screen.getByText(mockInscriptionData.value.toString()),
    ).toBeInTheDocument();
    // Encoding info, e.g. ;charset=utf-8 should be trimmed
    expect(screen.getByText("text/plain")).toBeInTheDocument();
    // Should be trimmed to 16 characters on each side
    expect(
      screen.getByText("67fe0bc9b4f647f7...61e04084aa2f:0:0"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("67fe0bc9b4f647f7...453761e04084aa2f"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Sample text content")).toBeInTheDocument();
    });
  });

  it("should display text content in a span element", async () => {
    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Sample text content").tagName).toBe("SPAN");
    });
  });

  it("should display non-svg image content in an image element", async () => {
    mockInscriptionData.content_type = "image/png";

    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });

    await waitFor(() => {
      expect(screen.queryByText("Sample text content")).toBeNull();
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        `https://ord.xverse.app/content/${mockInscriptionData.id}`,
      );
    });
  });

  it("should display svg and html content in an iframe", async () => {
    const testContentType = async (contentType: string) => {
      mockInscriptionData.content_type = contentType;

      await act(async () => {
        render(<InscriptionDetail data={mockInscriptionData} />);
      });

      await waitFor(() => {
        expect(screen.queryByText("Sample text content")).toBeNull();
        expect(screen.queryByRole("img")).toBeNull();
        const iframe = document.querySelector("iframe");
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute(
          "src",
          `https://ord.xverse.app/content/${mockInscriptionData.id}`,
        );
      });
    };

    await testContentType("image/svg+xml");
    await testContentType("text/html");
  });

  it("should differentiate between singular and plural form byte/bytes depending on the content length", async () => {
    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });
    expect(screen.getByText("1 byte")).toBeInTheDocument();

    mockInscriptionData.content_length = 2;

    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });
    expect(screen.getByText("2 bytes")).toBeInTheDocument();

    mockInscriptionData.content_length = 3;

    await act(async () => {
      render(<InscriptionDetail data={mockInscriptionData} />);
    });
    expect(screen.getByText("3 bytes")).toBeInTheDocument();
  });

  it("should gracefully handle unsupported content with a placeholder text", () => {
    const unsupportedData = {
      ...mockInscriptionData,
      content_type: "unsupported/type",
    };
    render(<InscriptionDetail data={unsupportedData} />);

    expect(screen.getByText("Unsupported content")).toBeInTheDocument();
  });
});
