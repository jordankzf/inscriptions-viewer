import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import { render, fireEvent, screen } from "../../test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("NavigationBar", () => {
  it("renders the title", () => {
    render(<NavigationBar title="My Title" />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders the back button when showBackButton is true", () => {
    render(<NavigationBar title="My Title" showBackButton />);
    expect(screen.getByAltText("back")).toBeInTheDocument();
  });

  it("does not render the back button when showBackButton is false", () => {
    render(<NavigationBar title="My Title" />);
    expect(screen.queryByAltText("back")).not.toBeInTheDocument();
  });

  it("navigates to the previous page when the back button is clicked", () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    render(<NavigationBar title="My Title" showBackButton />);
    fireEvent.click(screen.getByAltText("back"));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
