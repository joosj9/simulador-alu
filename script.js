/* ================= PANTALLAS ================= */
function goToApp(){
    changeScreen("home","app");
}
function goHome(){
    changeScreen("app","home");
}
function showScreen(screen){
    changeScreen("app",screen);
}

function changeScreen(from,to){
    let a=document.getElementById(from);
    let b=document.getElementById(to);

    a.classList.add("fade-out");

    setTimeout(()=>{
        a.classList.remove("active","fade-out");
        b.classList.add("active","fade-in");
    },400);
}

/* ================= NAV SECCIONES ================= */
function show(id, btn){
    document.querySelectorAll('.section')
        .forEach(s=>s.classList.remove('active'));

    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.nav-btn')
        .forEach(b=>b.classList.remove('active'));

    btn.classList.add('active');
}

/* ================= CONVERSIÓN ================= */
function decToBin(){
    let n=parseInt(dec.value);

    if(isNaN(n)){
        resConv.innerText="❌ Ingresa un número válido";
        return;
    }
    if(n<-128||n>127){
        resConv.innerText="❌ Fuera de rango (-128 a 127)";
        return;
    }

    let bin=(n>>>0).toString(2).slice(-8).padStart(8,'0');

    resConv.innerText=
`Decimal: ${n}
Binario: ${bin}`;
}

function binToDec(){
    let b=bin.value;

    if(!/^[01]{8}$/.test(b)){
        resConv.innerText="❌ Debe ser binario de 8 bits";
        return;
    }

    let n=parseInt(b,2);
    if(b[0]=='1') n-=256;

    resConv.innerText=
`Binario: ${b}
Decimal: ${n}`;
}

/* ================= COMPLEMENTO A 2 ================= */
function calcC2(){
    let n=parseInt(numC2.value);

    if(isNaN(n)||n>=0||n<-128){
        resC2.innerText="❌ Ingresa negativo válido (-128 a -1)";
        return;
    }

    let bin=Math.abs(n).toString(2).padStart(8,'0');
    let inv=bin.split('').map(x=>x=='0'?'1':'0').join('');
    let c2=(parseInt(inv,2)+1).toString(2).slice(-8).padStart(8,'0');

    resC2.innerText=
`1) Binario positivo: ${bin}
2) Invertir bits:     ${inv}
3) +1:                ${c2}

Resultado final (C2): ${c2}`;
}

/* ================= SUMA PASO A PASO ================= */
function sumaBinariaPaso(a,b){
    let carry=0;
    let resultado="";
    let pasos="";

    for(let i=7;i>=0;i--){
        let bitA=parseInt(a[i]);
        let bitB=parseInt(b[i]);

        let suma=bitA+bitB+carry;
        let res=suma%2;
        carry=Math.floor(suma/2);

        resultado=res+resultado;

        pasos+=`Bit ${i}: ${bitA}+${bitB}+acarreo → ${res} (acarreo ${carry})\n`;
    }

    return {resultado, pasos, carry};
}

/* ================= ALU ================= */
function operate(){
    let aVal=a.value;
    let bVal=b.value;
    let op=document.getElementById("op").value;

    if(!/^[01]{8}$/.test(aVal) || (op!=="NOT" && !/^[01]{8}$/.test(bVal))){
        resALU.innerText="❌ Usa binarios de 8 bits";
        return;
    }

    let A=parseInt(aVal,2);
    let B=parseInt(bVal,2);

    let resultado, pasos="";

    switch(op){

        case 'AND':
            resultado=(A&B).toString(2).padStart(8,'0');
            pasos=`${aVal}\nAND\n${bVal}`;
        break;

        case 'OR':
            resultado=(A|B).toString(2).padStart(8,'0');
            pasos=`${aVal}\nOR\n${bVal}`;
        break;

        case 'XOR':
            resultado=(A^B).toString(2).padStart(8,'0');
            pasos=`${aVal}\nXOR\n${bVal}`;
        break;

        case 'NOT':
            resultado=((~A)&255).toString(2).padStart(8,'0');
            pasos=`NOT ${aVal}`;
        break;

        case 'SUM':
            let r=sumaBinariaPaso(aVal,bVal);
            resultado=r.resultado;
            pasos=r.pasos + `Carry final: ${r.carry}`;
        break;
    }

    let overflow=(A+B>255);

    resALU.innerText=
`${pasos}

Resultado: ${resultado}
${overflow?"⚠ OVERFLOW DETECTADO":""}`;

    led.style.background=overflow?"red":"lime";
}

/* ================= FONDO ÉPICO ================= */
const canvas=document.createElement("canvas");
document.body.appendChild(canvas);
const ctx=canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles=[];
for(let i=0;i<80;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        dx:(Math.random()-0.5)*1.2,
        dy:(Math.random()-0.5)*1.2
    });
}

function animate(){
    ctx.fillStyle="#05070f";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        p.x+=p.dx;
        p.y+=p.dy;

        if(p.x<0||p.x>canvas.width) p.dx*=-1;
        if(p.y<0||p.y>canvas.height) p.dy*=-1;

        ctx.fillStyle="#00f7ff";
        ctx.fillRect(p.x,p.y,2,2);

        particles.forEach(p2=>{
            let dist=Math.hypot(p.x-p2.x,p.y-p2.y);
            if(dist<100){
                ctx.strokeStyle="rgba(0,247,255,0.1)";
                ctx.beginPath();
                ctx.moveTo(p.x,p.y);
                ctx.lineTo(p2.x,p2.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}
animate();
