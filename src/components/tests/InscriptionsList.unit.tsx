import { render, fireEvent, screen } from "@testing-library/react";
import { InscriptionsList } from "../InscriptionsList";

describe("InscriptionsList", () => {
  const inscriptions = [
    { content_type: "image/jpg", id: "id1", offset: 0 },
    { content_type: "text/plain", id: "id2", offset: 1 },
  ];
  const handleLoadMore = jest.fn();
  const navigate = jest.fn();
  const walletAddress = "0x1234567890abcdef";

  it("renders inscriptions", () => {
    render(
      <InscriptionsList
        inscriptions={inscriptions}
        handleLoadMore={handleLoadMore}
        showLoadMore={false}
        navigate={navigate}
        walletAddress={walletAddress}
      />,
    );

    expect(screen.getByText("Inscription id1")).toBeInTheDocument();
    expect(screen.getByText("Inscription id2")).toBeInTheDocument();
    expect(screen.queryByText("Inscription id3")).toBeNull();
  });

  it("navigates to detail page when inscription is clicked", () => {
    render(
      <InscriptionsList
        inscriptions={inscriptions}
        handleLoadMore={handleLoadMore}
        showLoadMore={false}
        navigate={navigate}
        walletAddress={walletAddress}
      />,
    );

    fireEvent.click(screen.getByText(`Inscription ${inscriptions[0].id}`));
    expect(navigate).toHaveBeenCalledWith(
      `/detail/${walletAddress}/${inscriptions[0].id}`,
    );
  });

  it("calls handleLoadMore when Load more button is clicked", () => {
    render(
      <InscriptionsList
        inscriptions={inscriptions}
        handleLoadMore={handleLoadMore}
        showLoadMore={true}
        navigate={navigate}
        walletAddress={walletAddress}
      />,
    );

    expect(screen.getByText("Load more")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Load more"));
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it("does not render Load more button if showLoadMore is false", () => {
    render(
      <InscriptionsList
        inscriptions={inscriptions}
        handleLoadMore={handleLoadMore}
        showLoadMore={false}
        navigate={navigate}
        walletAddress={walletAddress}
      />,
    );

    expect(screen.queryByText("Load more")).toBeNull();
  });

  it("trims inscription ID to 8 characters", () => {
    const longId =
      "1234567890123456789012345678901234567890123456789012345678901234567890";
    render(
      <InscriptionsList
        inscriptions={[{ content_type: "type1", id: longId, offset: 0 }]}
        handleLoadMore={handleLoadMore}
        showLoadMore={false}
        navigate={navigate}
        walletAddress={walletAddress}
      />,
    );

    expect(
      screen.getByText(`Inscription ${longId.slice(0, 8)}`),
    ).toBeInTheDocument();
  });
});
