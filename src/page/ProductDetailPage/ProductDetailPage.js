import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import ReviewItemDialog from "./component/ReviewItemDialog";
import { getReviewList } from "../../features/review/reviewSlice";
import ReviewItem from "./component/ReviewItem";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading:productLoading } = useSelector((state) => state.product);
  const {reviewList, loading: reviewLoading} = useSelector((state)=>state.review);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("new");

  const addItemToCart = () => {
    // 사이즈를 아직 선택 안 했다면 에러
    if (size === "") {
      setSizeError(true);
      return;
    }
    // 아직 로그인을 안 한 유저라면 로그인 페이지로
    if (!user) navigate("/login");
    // 카트에 아이템 추가하기
    dispatch(addToCart({ id, size }));
  };

  const addReview = () => {
    if (!user) navigate("/login");
    setShowDialog(true);
  };

  const selectSize = (value) => {
    // 사이즈 추가하기
    if (sizeError) setSizeError(false);
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
    dispatch(getReviewList(id));
  }, [id, dispatch]);

  if (productLoading || !selectedProduct || reviewLoading)
    return (
      <div className="detail-ring">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  return (
    <>
      <Container className="product-detail-card">
        <Row>
          <Col lg={6} sm={12}>
            <img src={selectedProduct.image} className="w-100" alt="image" />
          </Col>
          <Col className="product-info-area mt-sm-3" lg={6} sm={12}>
            <div className="product-info">{selectedProduct.name}</div>
            <div className="product-info">
              ₩ {currencyFormat(selectedProduct.price)}
            </div>
            <div className="product-info">{selectedProduct.description}</div>

            <Dropdown
              className="drop-down size-drop-down"
              title={size}
              align="start"
              onSelect={(value) => selectSize(value)}
            >
              <Dropdown.Toggle
                className="size-drop-down"
                variant={sizeError ? "outline-danger" : "outline-dark"}
                id="dropdown-basic"
                align="start"
              >
                {size === "" ? "사이즈 선택" : size.toUpperCase()}
              </Dropdown.Toggle>

              <Dropdown.Menu className="size-drop-down">
                {Object.keys(selectedProduct.stock).length > 0 &&
                  Object.keys(selectedProduct.stock).map((item, index) =>
                    selectedProduct.stock[item] > 0 ? (
                      <Dropdown.Item eventKey={item} key={index}>
                        {item.toUpperCase()}
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item
                        eventKey={item}
                        disabled={true}
                        key={index}
                      >
                        {item.toUpperCase()}
                      </Dropdown.Item>
                    )
                  )}
              </Dropdown.Menu>
            </Dropdown>
            <div className="warning-message">
              {sizeError && "사이즈를 선택해주세요."}
            </div>
            <Button
              variant="dark"
              className="add-button"
              onClick={addItemToCart}
            >
              추가
            </Button>
          </Col>
        </Row>
        <Row className="review mt-4 pt-3">
          <Col lg={1} sm={2}>
            <h1>리뷰</h1>
          </Col>
          <Col lg={1} sm={2}>
            <Button variant="dark" onClick={addReview} ㅊ>
              작성
            </Button>
          </Col>
        </Row>
        <Row>
          {reviewList.length > 0 ? (
          reviewList.map((review) => (
            <Col key={review._id} lg={6} sm={12}>
              <ReviewItem review={review} />
            </Col>
          ))
        ) : (
          <div>
            <h2>등록된 리뷰가 없습니다!</h2>
          </div>
        )}
        </Row>
      </Container>

      <ReviewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedProduct = {selectedProduct}
        productId = {id}
      />
    </>
  );
};

export default ProductDetail;
