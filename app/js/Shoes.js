/* It will get data json once  at a time  page reload. Good for performance */ 
const shoesData =
  (async () => {
    const { shoes } = await $.getJSON("data/shoes.json");
    return shoes;
  })();

class Shoes {
  async getAllShoes() {
    const shoes = await shoesData;
    return shoes;
  }
  getAllShoesFromLocalStorage() {
    if (!localStorage.getItem("shoes")) {
      return [];
    }
    const shoes = JSON.parse(localStorage.getItem("shoes"));
    return shoes;
  }
  setShoesInLocalStorage(shoesList) {
    localStorage.setItem("shoes", JSON.stringify(shoesList));
  }
  async getShoes(id) {
    const shoesList = await this.getAllShoes();
    const shoesItem = shoesList.find((shoes) => shoes.id === +id);
    return shoesItem;
  }
  getCartItemIndex(cartItem) {
    const shoesList = this.getAllShoesFromLocalStorage();
    const cartItemIndex = shoesList.findIndex(
      (shoes) => shoes.id === cartItem.id
    );
    return cartItemIndex;
  }
  checkCartTextShowOrHide() {
    if ($(".cart__items").children().length > 0) {
      $(".cart__empty__text").hide();
    } else {
      $(".cart__empty__text").show();
    }
  }
  getPriceCartItem = (that) => {
    return +$(that)
      .parents(".cart__item__right__actions")
      .siblings(".cart__item__right__price")
      .text()
      .split("$")
      .reverse()[0];
  };
  getAmountCartItem = (that) => {
    return +$(that)
      .parents(".cart__item__right__actions")
      .find(".cart__item__right__count__number")
      .text();
  };
  getCartItemCount = (that) => {
    return $(that).siblings(".cart__item__right__count__number");
  };
  getCardItemButton = (cartItemId) => {
    const cardItemButton = $(`.card__item#${+cartItemId}`).find(
      ".card__item__button"
    );
    return cardItemButton;
  };
  cartItemRemoveFromChild = (that) => {
    $(that)
      .parents(".cart__item")
      .removeClass("animate__fadeInRight")
      .addClass("animate__zoomOut")
      .on("animationend", (e) => {
        $(e.target).remove();
        this.checkCartTextShowOrHide();
      });
  };
  async showShoesCardItem(cardItems) {
    const shoesList = await this.getAllShoes();
    const cardItemButtonIcon = `<div class="card__item__button__cover__check__icon"> <img src="assets/check.png" alt="" /> </div>`;
    shoesList.forEach((shoes, index) => {
      const { id, image, name, description, price, color, count } = shoes;
      const template = ` <div class="card__item" id="${id}"> <div class="card__item__image" style="background-color: ${color}"> <img src="${image}" /> </div> <div class="card__item__name">${name}</div> <div class="card__item__description"> ${description} </div> <div class="card__item__bottom "> <div class="card__item__price">$${price}</div> <div class="card__item__button"> <p class="">ADD TO CART</p> </div> </div> </div>`;
      cardItems.append(template);
    });
    if (localStorage.getItem("shoes")) {
      const shoesListInLocalStorage = this.getAllShoesFromLocalStorage();
      shoesListInLocalStorage.forEach((shoesItem) => {
        const cardItemButton = $(`.card__item#${+shoesItem.id}`).find(
          ".card__item__button"
        );
        cardItemButton.addClass("inactive").get(0).innerHTML =
          cardItemButtonIcon;
      });
    }
  }
  showShoesCartItem(cartItems, cartTitleRight) {
    if (!localStorage.getItem("shoes")) return;
    const shoesList = JSON.parse(localStorage.getItem("shoes"));
    let sum = 0;
    shoesList.forEach((shoes, index) => {
      const { id, image, name, description, price, color, count } = shoes;
      sum += price * count;
      const template = ` <div class="cart__item animate__animated animate__fadeInRight" id="${id}"> <div class="cart__item__left"> <div class="cart__item__left__image" style="background-color: ${color}" > <div class="cart__item__image__block"> <img src="${image}" /> </div> </div> </div> <div class="cart__item__right "> <div class="cart__item__right__name">${name}</div> <div class="cart__item__right__price">$${price}</div> <div class="cart__item__right__actions"> <div class="cart__item__right__count"> <div class="cart__item__right__count__button">-</div> <div class="cart__item__right__count__number">${count}</div> <div class="cart__item__right__count__button">+</div> </div> <div class="cart__item__right__remove"> <img src="assets/trash.png" /> </div> </div> </div> </div>`;
      cartItems.append(template);
      this.checkCartTextShowOrHide(cartItems);
    });
    cartTitleRight.text(`$${sum.toFixed(2)}`);
  }
  async addCartItem(cartItems, cartTitleRight, event) {
    const shoesList = this.getAllShoesFromLocalStorage();
    const cardItemButton = $(event.currentTarget);
    const cardItemId = $(event.currentTarget).parents(".card__item").attr("id");
    const cardItemButtonIconContent = ` <div class="card__item__button__cover__check__icon"> <img src="assets/check.png" alt="" /> </div>`;
    const cartTitlePrice = +cartTitleRight.text().split("$").reverse()[0];
    const cartItem = await this.getShoes(cardItemId);
    const { id, image, name, description, price, color } = cartItem;
    const template = ` <div class="cart__item animate__animated animate__fadeInRight" id="${id}"> <div class="cart__item__left"> <div class="cart__item__left__image" style="background-color: ${color}" > <div class="cart__item__image__block"> <img src="${image}" /> </div> </div> </div> <div class="cart__item__right"> <div class="cart__item__right__name">${name}</div> <div class="cart__item__right__price">$${price}</div> <div class="cart__item__right__actions"> <div class="cart__item__right__count"> <div class="cart__item__right__count__button">-</div> <div class="cart__item__right__count__number">1</div> <div class="cart__item__right__count__button">+</div> </div> <div class="cart__item__right__remove"> <img src="assets/trash.png" /> </div> </div> </div> </div>`;
    cartItems.append(template);
    cartTitleRight.text(`$${(cartTitlePrice + price).toFixed(2)}`);
    cardItemButton
      .addClass("inactive animate__animated animate__fadeInDown")
      .get(0).innerHTML = cardItemButtonIconContent;
    cartItem.count = 1;
    shoesList.push(cartItem);
    this.setShoesInLocalStorage(shoesList);
    this.checkCartTextShowOrHide(cartItems);
  }
  async changeAmountCartItem(cartItems, cartTitleRight, event) {
    const cartItemButtonContent = event.currentTarget.innerText;
    const cardItemId = $(event.currentTarget).parents(".cart__item").attr("id");
    const cartTitleRightPrice = +cartTitleRight.text().split("$").reverse()[0];
    const priceCartItem = this.getPriceCartItem(event.currentTarget);
    const cartItemCountNumber = this.getCartItemCount(event.currentTarget);
    const cardItemButton = this.getCardItemButton(cardItemId);
    const cartItem = await this.getShoes(cardItemId);
    const shoesList = this.getAllShoesFromLocalStorage();
    const cartItemIndex = this.getCartItemIndex(cartItem);
    if (
      cartItemButtonContent === "-" &&
      cartTitleRight.text(
        `$${(cartTitleRightPrice - priceCartItem).toFixed(2)}`
      ) &&
      cartItemCountNumber.text(`${+cartItemCountNumber.text() - 1}`)
    ) {
      if (+cartItemCountNumber.text() === 0) {
        cardItemButton
          .removeClass("inactive animate__animated animate__fadeInDown")
          .get(0).innerHTML =
          "<p class='animate__animated animate__zoomIn'>ADD TO CART</p>";
        shoesList.splice(cartItemIndex, 1);
        this.cartItemRemoveFromChild(event.currentTarget);
        this.checkCartTextShowOrHide(cartItems);
        this.setShoesInLocalStorage(shoesList);
        return;
      }
      cartItem.count = +cartItemCountNumber.text();
      shoesList[cartItemIndex] = cartItem;
      this.setShoesInLocalStorage(shoesList);
      return;
    }
    if (
      cartItemButtonContent === "+" &&
      cartTitleRight.text(
        `$${(cartTitleRightPrice + priceCartItem).toFixed(2)}`
      ) &&
      cartItemCountNumber.text(`${+cartItemCountNumber.text() + 1}`)
    ) {
      cartItem.count = +cartItemCountNumber.text();
      shoesList[cartItemIndex] = cartItem;
      this.setShoesInLocalStorage(shoesList);
      return;
    }
  }
  async removeCartItem(cartTitleRight, event) {
    const cartTitleRightPrice = +cartTitleRight.text().split("$").reverse()[0];
    const cardItemId = $(event.currentTarget).parents(".cart__item").attr("id");
    const priceCartItem = this.getPriceCartItem(event.currentTarget);
    const amountCartItem = this.getAmountCartItem(event.currentTarget);
    const cardItemButton = this.getCardItemButton(cardItemId);
    const cartItem = await this.getShoes(cardItemId);
    const shoesList = this.getAllShoesFromLocalStorage();
    const cartItemIndex = this.getCartItemIndex(cartItem);
    shoesList.splice(cartItemIndex, 1);
    cardItemButton.removeClass(
      "inactive animate__animated animate__fadeInDown"
    );
    cardItemButton.get(0).innerHTML =
      "<p class='animate__animated animate__zoomIn'>ADD TO CART</p>";
    cartTitleRight.text(
      `$${(cartTitleRightPrice - priceCartItem * amountCartItem).toFixed(2)}`
    );
    this.cartItemRemoveFromChild(event.currentTarget);
    this.setShoesInLocalStorage(shoesList);
  }
}
export default Shoes;
