import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import StarRating from "../../../features/common/StarRating";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, setSelectedReview } from "../../../features/review/reviewSlice";
import ReviewItemDialog from "./ReviewItemDialog";

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("edit");

  const formattedDate = new Date(review.updatedAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const updateButton = (reviewId, productId) => {
    dispatch(setSelectedReview(review));
    setShowDialog(true);
  };

  const deleteButton = (reviewId, productId) => {
    dispatch(deleteReview({ reviewId, productId }));
  };

  return (
    <>
      <Container className="review-area" fluid>
        <Row className="p-0">
          <Col className="fw-bold" lg={9} sm={8}>
            {review.userId.name}
          </Col>
          {user && user._id === review.userId._id && (
            <>
              <Col lg={3} sm={4}>
                <Button
                  variant="success"
                  onClick={() =>
                    updateButton(review._id, review.item.productId._id)
                  }
                >
                  수정
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() =>
                    deleteButton(review._id, review.item.productId._id)
                  }
                >
                  삭제
                </Button>
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col className="review-info" lg={5} sm={4}>
            {review.item.productId.name}({review.item.size.toUpperCase()})
          </Col>
          <Col className="review-info" lg={5} sm={5}>
            {formattedDate}
          </Col>
          <Col className="review-info" lg={2} sm={3}>
            <StarRating rate={review.rate} />
          </Col>
        </Row>
        {review.image && (
          <Row className="mt-1">
            <img
              src={review.image}
              alt="image"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </Row>
        )}
        <Row className="mt-2 p-0">
          <Col>{review.content}</Col>
        </Row>
      </Container>
      <ReviewItemDialog 
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        productId = {review.item.productId._id}
        reviewId = {review._id}
      />
    </>
  );
};

export default ReviewItem;
