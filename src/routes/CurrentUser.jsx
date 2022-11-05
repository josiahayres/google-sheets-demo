import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export const getAnswers = async (code) => {
  const response = await fetch(
    `/.netlify/functions/getAnswers?code=${code}&date=${dayjs().format(
      "DD-MM-YYYY"
    )}`
  );
  const data = await response.json();
  return data;
};

export default function CurrentUser() {
  const params = useParams();
  const navigate = useNavigate();

  const code = params?.code;
  const questionId = params.questionId;

  const query = useQuery({
    queryKey: ["answers"],
    queryFn: () => getAnswers(code),
  });

  // AUTO NAVIGATE TO FIRST QUESTION
  useEffect(() => {
    if (!questionId && query.isSuccess) navigate("./q1");
  }, [query.isSuccess, questionId, navigate]);

  return (
    <div id="CurrentUser">
      <h1>Current user code {code}</h1>
      <code>
        {query.isFetching ? <p>Fetching</p> : <p>Todays answers:</p>}
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </code>
      <Outlet />
    </div>
  );
}
