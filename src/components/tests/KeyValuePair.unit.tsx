import { render, screen } from "../../test-utils";

import KeyValuePair from "../KeyValuePair";

describe("KeyValuePair", () => {
  const key = "Inscription ID";
  const value =
    "16b43759fc0342ca47c81c61f63b358c46caa864015cdde091c4bb1622d8964di0";

  it("renders the key and value", () => {
    render(<KeyValuePair keyString={key} value={value} />);
    expect(screen.getByText(key)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("truncates the value if truncate prop is true", () => {
    render(<KeyValuePair keyString={key} value={value} truncate />);
    expect(
      screen.getByText("16b43759fc0342ca...c4bb1622d8964di0"),
    ).toBeInTheDocument();
  });

  it("does not truncate the value if truncate prop is false", () => {
    render(<KeyValuePair keyString={key} value={value} />);
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});
