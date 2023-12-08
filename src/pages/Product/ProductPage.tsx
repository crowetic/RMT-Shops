import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Cart as CartInterface,
  setIsOpen,
  setProductToCart,
} from "../../state/features/cartSlice";
import { RootState } from "../../state/store";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import TabImageList from "../../components/common/TabImageList/TabImageList";
import { Product } from "../../state/features/storeSlice";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { CartIcon } from "../../components/layout/Navbar/Navbar-styles";
import {
  CartIconContainer,
  NotificationBadge,
} from "../Store/Store/Store-styles";
import { useFetchOrders } from "../../hooks/useFetchOrders";
import {
  AddToCartButton,
  BackToStoreButton,
  CartBox,
  ProductDescription,
  ProductDetailsContainer,
  ProductLayout,
  ProductNotFound,
  ProductPrice,
  ProductTitle,
  UnavailableButton,
} from "./ProductPage-styles";
import { QortalSVG } from "../../assets/svgs/QortalSVG";
import { setNotification } from "../../state/features/notificationsSlice";
import { BackArrowSVG } from "../../assets/svgs/BackArrowSVG";
import {
  NumericTextFieldQshop,
  NumericTextFieldRef,
  Variant,
} from "../../components/common/NumericTextFieldQshop";

export const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const ref = useRef<NumericTextFieldRef>(null);

  // Get params for when user refreshes page or receives url link
  const storeOwner: string = params.user || "";
  const productID: string = params.product || "";
  const catalogueID: string = params.catalogue || "";
  const storeId: string = params.store || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [cartAddAmount, setCartAddAmount] = useState<number>(0);

  const catalogueHashMap = useSelector(
    (state: RootState) => state.global.catalogueHashMap
  );
  const carts = useSelector((state: RootState) => state.cart.carts);
  const user = useSelector((state: RootState) => state.auth.user);

  const { checkAndUpdateResourceCatalogue, getCatalogue } = useFetchOrders();

  const minCart = 1;
  const maxCart = 99;

  // Set cart notifications when cart changes
  useEffect(() => {
    if (user?.name && storeId) {
      const shopCart: CartInterface = carts[storeId];
      // Get the orders of this cart
      const orders = shopCart?.orders || {};
      let totalQuantity = 0;
      Object.keys(orders).forEach(key => {
        const order = orders[key];
        const { quantity } = order;
        totalQuantity += quantity;
      });
      setCartAddAmount(totalQuantity);
    }
  }, [carts, user, storeId]);

  const getProductData = async () => {
    const productInRedux = catalogueHashMap[catalogueID]?.products[productID];
    const paramsLoaded = productID && catalogueID && storeOwner && storeId;
    if (productInRedux) {
      setProduct(productInRedux);
      return;
    } else if (!productInRedux && paramsLoaded) {
      checkAndUpdateResourceCatalogue({ id: catalogueID });
      await getCatalogue(storeOwner, catalogueID);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const awaitProductData = async () => {
      await getProductData();
    };
    awaitProductData();
  }, [catalogueHashMap]);

  const price = product?.price?.find(item => item?.currency === "qort")?.value;

  const addToCart = () => {
    if (user?.name === storeOwner) {
      dispatch(
        setNotification({
          alertType: "error",
          msg: "You own this store! You cannot add your own products to your cart!",
        })
      );
      return;
    }
    if (product && ref?.current?.getTextFieldValue() !== "") {
      for (let i = 0; i < Number(ref?.current?.getTextFieldValue() || 0); i++) {
        dispatch(
          setProductToCart({
            productId: product.id,
            catalogueId: product.catalogueId,
            storeId,
            storeOwner,
          })
        );
      }
    }
  };
  const status = product?.status;
  const available = status === "AVAILABLE";
  const availableJSX = (
    <>
      <NumericTextFieldQshop
        name="Quantity"
        label="Quantity"
        variant={Variant.filled}
        required={true}
        style={{ width: "300px" }}
        initialValue={"1"}
        addIconButtons
        allowDecimals={false}
        minValue={minCart}
        maxValue={maxCart}
        ref={ref}
      />
      <AddToCartButton variant={"contained"} onClick={addToCart}>
        <CartIcon color={"#ffffff"} height={"25"} width={"25"} />
        <span style={{ marginLeft: "5px" }}>Add to Cart</span>
      </AddToCartButton>
    </>
  );

  const unavailableJSX = (
    <UnavailableButton
      variant={"contained"}
      onClick={() => {
        if (user?.name === storeOwner) {
          dispatch(
            setNotification({
              alertType: "error",
              msg: "You own this store! You cannot add your own products to your cart!",
            })
          );
          return;
        }
        dispatch(
          setNotification({
            alertType: "error",
            msg: "This product is out of stock!",
          })
        );
      }}
    >
      <DangerousIcon height={"25"} width={"25"} />
      Out of Stock
    </UnavailableButton>
  );

  return product ? (
    <ProductLayout>
      <BackToStoreButton
        onClick={() => {
          navigate(`/${storeOwner}/${storeId}`);
        }}
      >
        <BackArrowSVG height={"20"} width={"20"} color={"#ffffff"} />
        Shop
      </BackToStoreButton>
      <TabImageList images={product.images} />
      <ProductDetailsContainer>
        <ProductTitle variant="h2">{product.title}</ProductTitle>
        <ProductDescription variant="h3">
          {product.description}
        </ProductDescription>
        <ProductPrice variant="h4">
          RMT-
          <b>{price}</b>
        </ProductPrice>
        {available ? availableJSX : unavailableJSX}
      </ProductDetailsContainer>
      {user?.name && user?.name !== storeOwner ? (
        <CartBox>
          <CartIconContainer fixedCartPosition={false}>
            <CartIcon
              color={theme.palette.text.primary}
              height={"32"}
              width={"32"}
              onClickFunc={() => {
                dispatch(setIsOpen(true));
              }}
            />
            {cartAddAmount > 0 && (
              <NotificationBadge fixedCartPosition={false}>
                {cartAddAmount}
              </NotificationBadge>
            )}
          </CartIconContainer>
        </CartBox>
      ) : null}
    </ProductLayout>
  ) : (
    <ProductNotFound>Product ID ${productID} Not Found</ProductNotFound>
  );
};
