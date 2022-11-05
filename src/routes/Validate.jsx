import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Validate() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const code = params.get("code");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Don't try submit
    navigate(`/user/${code}`);
  };

  const handleCodeChange = (e) => {
    const newCode = e.currentTarget.value;
    setParams({ code: newCode });
  };

  return (
    <form onSubmit={handleSubmit} id="search-form">
      <h1>Enter participant code</h1>
      <fieldset>
        <input
          id="code"
          aria-label="Enter ID"
          placeholder="Search"
          type="search"
          name="code"
          value={code}
          onChange={handleCodeChange}
          required
        />
        <button type="submit">Validate</button>
      </fieldset>
    </form>
  );
}
