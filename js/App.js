class App { // class App
	constructor(list){ // constrcutor of App
		this.productList = list;
		this.basket = [];
		this.init(); // initialize
	}

	init(){
		this.addEvent(); // addEvent
		this.showProductList();
	}

	addEvent(){

	}

	showProductList(){
		this.productList.forEach(x=> this.productShow(x));
	}

	productShow(product){
		let tr = this.productTemp(product);
		$(tr).find("div.item-cnt-box > button").on("click", (e)=>{this.productBtnClick(e,product,tr)});
		$(tr).find("button.btn.btn-primary").on("click",(e)=>{this.pushBasket(product)});
		$("#screen-table").append(tr);
	}

	pushBasket(product){
		let find = this.basket.find(x=> {return x.id == product_name.id});
		if(find === undefined){
			this.basket.push(product);
			this.toast("장바구니에 담겼습니다.");
		} else {

		}
	}

	productBtnClick(e,product,tr){
		let num = e.currentTarget.dataset.num;
		product.cnt += num*1;
		if(product.cnt <= 0){
			product.cnt = 1;
			this.toast('최소 구매 수량은 1개 입니다');
		}
		$(tr).find(".item-cnt-input").val(product.cnt);
	}

	toast(msg){
		let toast = document.createElement("div");
		toast.classList.add("toast-box");
		toast.innerHTML = `
			<div>${msg}</div>
			<div class="toast-close">&times;</div>
		`;
		$(toast).find(".toast-close").on("click",()=>{$(toast).fadeOut()});
		$(".toast-container").prepend(toast);
	}

	productTemp(product){
		let tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${product.id}</td>
			<td>${product.name}</td>
			<td>${product.price}원</td>
			<td>
			<div class="item-cnt-box">
			<button class="item-cnt-minus" data-num="-1">
			<i class="fa fa-minus"></i>
			</button>
			<input type="text" value="${product.cnt}" class="item-cnt-input">
			<button class="item-cnt-plus" data-num="1">
			<i class="fa fa-plus"></i>
			</button>
			</div>
			</td>
			<td>
			<button class="btn btn-primary">
 			장바구니
			</button>
			</td>
		`;
		return tr;
	}
}

class Item {
	constructor(id,name,price){
		this.id = id;
		this.name = name;
		this.price = price;
		this.priceNum = this.price.split(",").join('')*1;
		this.cnt = 1;
		this.total = this.priceNum*this.cnt;
	}
}

window.addEventListener("load",()=>{ // addEventListener
	$.getJSON("js/item.json",(json)=>{
		let list = json.map(x=>{return new Item(x.id,x.product_name,x.price)});
		let app = new App(list); // make App
	});
}); 