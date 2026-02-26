import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Bokdetaljer</h1>
      <p>Bok-ID: {id}</p>
    </div>
  );
};

export default BookDetails;