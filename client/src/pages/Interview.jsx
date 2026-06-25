import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});

  const generateInterview = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/interview/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuestions(res.data.interview.questions);
      setAnswers({});
      setEvaluations({});
    } catch (err) {
      alert(err.response?.data?.msg || "Interview generation failed");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async (item, index) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/interview/evaluate",
        {
          question: item.question,
          expectedAnswer: item.expectedAnswer,
          userAnswer: answers[index]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEvaluations({
        ...evaluations,
        [index]: res.data.evaluation
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Answer evaluation failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2>AI Mock Interview</h2>

        <button
          className="btn btn-primary w-100 my-3"
          onClick={generateInterview}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Interview Questions"}
        </button>

        {questions.map((item, index) => (
          <div className="card p-3 mb-3" key={index}>
            <h5>{index + 1}. {item.question}</h5>
            <p><b>Difficulty:</b> {item.difficulty}</p>
            <p><b>Expected Answer:</b> {item.expectedAnswer}</p>

            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Type your answer here..."
              value={answers[index] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [index]: e.target.value
                })
              }
            />

            <button
              className="btn btn-success"
              onClick={() => evaluateAnswer(item, index)}
            >
              Evaluate Answer
            </button>

            {evaluations[index] && (
              <div className="mt-3 alert alert-info">
                <h6>Score: {evaluations[index].score}/100</h6>
                <p><b>Feedback:</b> {evaluations[index].feedback}</p>

                <b>Improvements:</b>
                <ul>
                  {evaluations[index].improvements?.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Interview;