const local = window.localStorage;
class App { // class App
	constructor(list){ // constrcutor of App
		this.productList = list;
		this.basket = [];
		this.init(); // initialize
	}

	init(){
		this.addEvent(); // addEvent
		this.loadFromLocal();
		this.showProductList();
	}

	addEvent(){
		$("#purchase_btn_1").on('click', this.purchaseStep1);
		
	}

	purchaseStep1 = e => {
		if(this.basket.length <= 0){
			alert("상품을 담아주세요.");
			return;
		}

		
	}

	async loadFromLocal(){
		if(local.basket !== undefined) this.basket = await JSON.parse(local.basket);
		this.basket.forEach(x=>{
			let tr = this.basketTemp(x);
			$("#basket-table > tbody").append(tr);
		});
	}

	showProductList(){
		this.productList.forEach(x=> this.productShow(x));
	}

	saveOnLocal(){
		let json = JSON.stringify(this.basket,null,0);
		local.basket = json;
	}

	productShow(product){
		let tr = this.productTemp(product);
		$(tr).find("div.item-cnt-box > button").on("click", (e)=>{this.productBtnClick(e,product,tr)});
		$(tr).find("button.btn.btn-primary").on("click",(e)=>{
			let cnt = $(tr).find(".item-cnt-input").val()*1;
			this.pushBasket(cnt,product);
		});
		$("#screen-table").append(tr);
	}

	pushBasket(cnt,product){
		let find = this.basket.find(x=> {return x.id == product.id});
		if(isNaN(parseInt(cnt)) || cnt <= 0){
			alert("잘못된 값");
			return;
		}
		if(find === undefined){
			product.cnt = cnt;
			let assignedObject = Object.assign({},product);
			this.basket.push(assignedObject);
			let tr = this.basketTemp(assignedObject);
			$("#basket-table > tbody").append(tr);
			this.toast("장바구니에 담겼습니다.");
		} else {
			find.cnt += cnt;
			find.total = find.cnt * find.priceNum;
			$(`tr[data-id=${find.id}]`).find(".basket-cnt").html(find.cnt);
			$(`tr[data-id=${find.id}]`).find(".basket-total").html(find.total.toLocaleString()+"원");
			this.toast("추가 상품이 담겼습니다.");
		}
		this.saveOnLocal();
	}

	basketTemp(product){
		let tr = document.createElement("tr");
		tr.dataset.id = product.id;
		product.total = product.priceNum * product.cnt;
		tr.innerHTML = `
		<td>${product.name}</td>
		<td class="basket-cnt">${product.cnt}</td>
		<td>${product.price}원</td>
		<td>${product.price}원</td>
		<td class="basket-cnt">${product.cnt}</td>
		<td class="basket-total">${product.total.toLocaleString()}원</td>
		`;
		return tr;
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
		setTimeout(() => {$(toast).remove()},3000);
		toast.classList.add("toast-box");
		toast.innerHTML = `
			<div>${msg}</div>
			<div class="toast-close">&times;</div>
		`;
		$(toast).find(".toast-close").on("click",()=>{$(toast).fadeOut()});
		$(".toast-container").append(toast);
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
			<input type="number" value="${product.cnt}" class="item-cnt-input">
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

	// $(asdf).on("input",(e)=>{
	// 	let value = e.currentTarget.value;
	// 	value = value.replace(/[^\d]/g,"");
	// 	value = value.replace(/([0-9]{3})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
	// 	e.currentTarget.value = value;
	// });
}); 


//function sum(){
//	let sum = 0;
//	for(let i = 0; i < arguments.length; i++) sum += arguments[i];
//	return sum;
//}
