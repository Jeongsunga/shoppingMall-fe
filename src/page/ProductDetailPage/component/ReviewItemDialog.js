import React, { useEffect, useState } from "react";
import { Form, Modal, Row, Col, Button } from "react-bootstrap";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { useDispatch, useSelector } from "react-redux";
import { getPurchasedSizes } from "../../../features/order/orderSlice";
import {
  createReview,
  updateReview,
} from "../../../features/review/reviewSlice";

const InitialFormData = {
  content: "",
  image: "",
  size: "",
  rate: 0,
};

const ReviewItemDialog = ({
  mode,
  showDialog,
  setShowDialog,
  productId,
  reviewId,
}) => {
  const dispatch = useDispatch();
  const { success, selectedReview } = useSelector((state) => state.review);
  const { sizeList } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({ ...InitialFormData });

  const availableSizes = Object.values(sizeList).map((s) => s.toUpperCase());

  const handleClose = () => {
    //모든걸 초기화시키고;
    setFormData(InitialFormData);
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.rate < 0 || formData.rate > 5) {
      alert("평점은 0~5 사이여야 합니다.");
      return;
    }

    if (mode === "new") {
      //새 상품 만들기
      await dispatch(createReview({ id: productId, formData }));
      //   onSuccess();
    } else {
      // 상품 수정하기
      const { content, rate, image } = formData;
      await dispatch(
        updateReview({ reviewId: selectedReview._id, productId, formData })
      );
    }
  };

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  useEffect(() => {
    if (mode === "edit" && selectedReview) {
      setFormData({
        content: selectedReview.content,
        image: selectedReview.image,
        rate: selectedReview.rate,
        size: selectedReview.item?.size || "", // 고정
      });
    }
  }, [mode, selectedReview]);

  useEffect(() => {
    if (mode === "new") {
      dispatch(getPurchasedSizes(productId));
    }
  }, [dispatch, productId, mode]);

  useEffect(() => {
    if (mode === "new" && sizeList.length > 0) {
      setFormData((prev) => ({ ...prev, size: sizeList[0].toLowerCase() }));
    }
  }, [sizeList, mode]);

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "Add New Review" : "Edit Review"}
        </Modal.Title>
      </Modal.Header>

      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="size">
            <Form.Label>Size</Form.Label>
            {mode === "new" ? (
              <Form.Select
                id="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                {availableSizes.length > 0 ? (
                  availableSizes.map((item, idx) => (
                    <option key={idx} value={item.toLowerCase()}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option disabled>구매한 사이즈가 없습니다</option>
                )}
              </Form.Select>
            ) : (
              <Form.Control
                type="text"
                value={formData.size.toUpperCase()}
                disabled
              />
            )}
          </Form.Group>

          <Form.Group as={Col} controlId="rate">
            <Form.Label>Rate(0 to 5)</Form.Label>
            <Form.Control
              value={formData.rate}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
              min={0}
              max={5}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            type="string"
            placeholder="Content"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.content}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />

          <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
            alt="uploadedimage"
          />
        </Form.Group>

        {mode === "new" ? (
          <Button style={{ width: "100%" }} variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default ReviewItemDialog;
