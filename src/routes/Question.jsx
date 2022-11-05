import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { getAnswers } from "./CurrentUser";

export async function updateQuestion({ code, date, rowId, questionId, value }) {
  const response = await fetch(
    `/.netlify/functions/update?code=${code}&date=${date}&rowId=${rowId}&questionId=${questionId}&value=${value}`
  );

  const data = await response.json();

  return data;
}

export default function Question() {
  const params = useParams();
  const code = params?.code;
  const questionId = params.questionId;
  const queryClient = useQueryClient();

  const answersQuery = useQuery({
    queryKey: ["answers"],
    queryFn: () => getAnswers(code),
  });

  const mutation = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["answers"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = new FormData(event.target).get(questionId);
    const rowId = answersQuery?.data?.rowId;
    const date = dayjs().format("DD-MM-YYYY");
    const data = {
      code,
      date,
      rowId,
      questionId,
      value,
    };
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div>
      <h2>Question {questionId}</h2>

      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={answersQuery.isFetching || mutation.isLoading}
          style={{ display: "flex", gap: "1em", border: "none" }}
        >
          <div>
            <label htmlFor={questionId}>Question </label>
            <input
              id={questionId}
              name={questionId}
              defaultValue={answersQuery.data?.[questionId]}
            ></input>
          </div>
          <button type="submit">Submit</button>
        </fieldset>
      </form>

      <p>Todo: Add form to show single question</p>

      {questionId === "q1" && <Link to="../q2">Next question</Link>}
      {questionId === "q2" && <Link to="../q1">Previous question</Link>}
    </div>
  );
}
