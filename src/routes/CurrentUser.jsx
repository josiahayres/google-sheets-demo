import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export async function validateCode(code) {
  const response = await fetch(`/.netlify/functions/validate?code=${code}`);
  const data = await response.json();
  return data;
}

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
  const navigate = useNavigate();
  const params = useParams();
  const code = params?.code;

  const validate = useQuery({
    refetchOnWindowFocus: false,
    queryFn: () => validateCode(code),
    onSuccess: (data) => {
      if (typeof data?.validUser !== "boolean" || !data.validUser) {
        return;
      }
      if (!!data.completed) {
        navigate("/already-complete");
      }
    },
  });

  const validParticipantCode = validate.isSuccess && validate.data.validUser;

  const query = useQuery({
    queryKey: ["answers"],
    queryFn: () => getAnswers(code),
    enabled: validParticipantCode,
  });

  const error = validate.isSuccess && validate.data.message;

  const handleStartClick = () => {
    navigate("./q1");
  };

  return (
    <div id="CurrentUser">
      <h1>Current participant code {code}</h1>
      {validate.isFetching && <p>Validating code</p>}
      {error && <p>{error}</p>}
      {validParticipantCode && (
        <>
          <code>
            {query.isFetching ? <p>Fetching</p> : <p>Todays answers:</p>}
            <pre>{JSON.stringify(query.data, null, 2)}</pre>
          </code>
          <button onClick={handleStartClick}>Start Questions</button>
          <Outlet />
        </>
      )}
    </div>
  );
}
