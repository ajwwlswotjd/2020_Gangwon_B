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
        this.addEvent();
        this.drawCanvas();
    }

    loadFromLocal(){
        if(local.soldList !== undefined) this.soldList = JSON.parse(local.soldList);
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

        log(totalArr);


    }

    sum(){
        let sum = 0;
        for(let i = 0; i < arguments.length; i++) sum += arguments[i];
        return sum;
    }

    addEvent(){
        
    }
}

window.addEventListener("load",(e)=>{
    let adminApp = new AdminApp();
});