import { render, screen } from "@testing-library/react";
import Root from "./Root";

test("renders learn react link", () => {
  render(<Root />);
  const linkElement = screen.getByText(/React Router Contacts/i);
  expect(linkElement).toBeInTheDocument();
});
