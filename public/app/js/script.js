import Shoes from "./Shoes.js";

$(function () {
  const cardItems = $(".card__left .card__items");
  const cartItems = $(".cart__items");
  const cardItemButton = ".card__item__button";
  const cartItemRightCountButton = ".cart__item__right__count__button";
  const cartItemRightRemove = ".cart__item__right__remove";
  const cartTitleRight = $(".card__right .card__title .card__title__amount");
  const queryDocument = $(document);
  const ShoesObj = new Shoes();

  ShoesObj.showShoesCardItem(cardItems, cartTitleRight);
  ShoesObj.showShoesCartItem(cartItems, cartTitleRight);

  queryDocument.on("click", cardItemButton, (event) =>
    ShoesObj.addCartItem(cartItems, cartTitleRight, event)
  );

  queryDocument.on("click", cartItemRightCountButton, (event) => {
    ShoesObj.changeAmountCartItem(cartItems, cartTitleRight, event);
  });

  queryDocument.on("click", cartItemRightRemove, (event) => {
    ShoesObj.removeCartItem(cartTitleRight, event);
  });
});
