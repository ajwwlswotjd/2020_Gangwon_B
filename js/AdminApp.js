const local = window.localStorage;
class AdminApp {
    constructor(){
        this.canvas = document.querySelector("#graph_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.soldList = [];

        this.init();
    }

    init(){
        this.loadFromLocal();
        this.drawCanvas();
        this.drawTable();
        this.addEvent();
        // addEvent 함수가 제일 나중에 호출되어야 한다.
    }

    loadFromLocal(){
        if(local.soldList !== undefined) this.soldList = JSON.parse(local.soldList);
    }

    drawTable(){
        this.soldList.sort((a,b)=>{
            return new Date(b.today) - new Date(a.today);
        }).forEach(sellData=>{
            
            sellData.basket.forEach(item=>{
                let tr = this.makeDom(sellData,item);
                $("#sold-table > tbody").append(tr);
            });    
        });   
    }

    makeDom(sellData,item){
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${sellData.name}</td>
            <td>${item.name}</td>
            <td>${item.cnt}</td>
            <td>${new Date(sellData.today).toLocaleString()}</td>
        `;

        return tr;
    }



    drawCanvas(){

        // 화면 하얀색 칠하기
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0,0,this.width,this.height);
        // 화면 하얀색 칠하기

        // 
        let size = this.height/15;
        let today = new Date();
        let totalArr = [];
        let maxIndex = 0;
        for(let i = 0; i < 7; i++){
            let day = today - (1000 * 24 * 60 * 60 * (i+1));
            day = new Date(day);
            let total = 0;
            this.soldList.filter(x=>{
                return new Date(x.today).toDateString() === new Date(day).toDateString();
            }).forEach(y=>{
                let totalTemp = 0;
                y.basket.forEach(z=> totalTemp += z.total);
                total += totalTemp;
            });
            totalArr.push(total);
            if(totalArr[maxIndex] < total) maxIndex = i;

            //this.soldList[i].today = day.toGMTString();
            //this.soldList[7].today = day.toGMTString();
            let drawX = size + i * size * 2;
        }
        this.ctx.font = "15px Arial";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        for(let i = 0; i < 7; i++){
            let day = today - (1000 * 24 * 60 * 60 * (i+1));
            day = new Date(day);
            let drawY = size + i * size * 2;

            this.ctx.fillStyle = "#333030";
            this.ctx.fillText(day.toLocaleDateString(),10,drawY+size/2);

            let percent = totalArr[i] / totalArr[maxIndex];
            this.ctx.strokeStyle = "#000";
            let width = (this.width - 150) * percent;
            this.ctx.strokeRect(100,drawY, width ,size);
            
            this.ctx.fillStyle = "#333030";
            this.ctx.fillText(totalArr[i].toLocaleString(), 105,drawY+size/2);            
        }
    }

    addEvent(){
        // addEvent Comment     
    }
}

window.addEventListener("load",(e)=>{
    let adminApp = new AdminApp();
});