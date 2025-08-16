import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rate }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      stars.push(<FaStar key={i} color="#ffc107" />); // 채워진 별
    } else {
      stars.push(<FaRegStar key={i} color="#e4e5e9" />); // 빈 별
    }
  }
  return <div>{stars}</div>;
};

export default StarRating;
