import React from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";

export async function action({ request, params }) {
  let formData = await request.formData();
  const contact = await fetch(
    `/.netlify/functions/validate?code=${formData.get("code")}`
  );
  const data = await contact.json();
  // if (data?.hasCompletedToday) return redirect(`/already-complete`);
  return redirect(`/user/${formData.get("code")}`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  return { code };
}

export default function Validate() {
  const { code } = useLoaderData();

  return (
    <div>
      <Form id="search-form" method="post">
        <input
          id="code"
          aria-label="Enter ID"
          placeholder="Search"
          type="search"
          name="code"
          defaultValue={code}
        />
        <div id="search-spinner" aria-hidden hidden={true} />
        <div className="sr-only" aria-live="polite"></div>
      </Form>
    </div>
  );
}
