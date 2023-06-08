import React, { useEffect, useState } from 'react' 
import axios from 'axios';

// önerilen başlangıç stateleri
const initialData = {
  message : '',
  email : '',
  steps : 0,
  index : 4,
} //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
   const [data,setData]=useState(initialData);
   
  
  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
  
    const coordObjects = {
      x : Math.floor(data.index/3),
      y : data.index%3,
      
    }

    return coordObjects;
  }
  
  

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return `(${getXY().x}, ${getXY().y})`
  }
  console.log("getXYMesaj",getXYMesaj());

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setData(initialData);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let newIndex=data.index;
    let messageString="";
    const x =Math.floor(data.index/3);
    const y = data.index%3;

    if(yon === "left") {
      if(y>0) newIndex = data.index -1;
      else messageString="Sola Gidemezsiniz."}
    if(yon === "right") {
      if(y<2) newIndex = data.index +1;
      else messageString="Sağa Gidemezsiniz."}
    if(yon === "down") {
      if(x<2) newIndex = data.index +3;
      else messageString="Aşağı Gidemezsiniz."}
    if(yon === "up") {
      if(x>0) newIndex = data.index -3;
      else messageString="Yukari Gidemezsiniz."}
    
    // yon === "right"&&y<2 ? newIndex = data.index +1 : messageString="Sağa Gidemezsiniz.";
    // yon === "down"&& x<2 ? newIndex = data.index +3 : messageString="Aşağı Gidemezsiniz.";
    // yon === "up"&& x>0 ? newIndex = data.index -3: messageString="Yukari Gidemezsiniz.";

   return {newIndex,messageString} ;
  }
  
  

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const fonksiyonData = sonrakiIndex(evt.target.id);    
    let newStepsValue = fonksiyonData.newIndex;
    let newStepsMessage= fonksiyonData.messageString;

    setData({
      ...data,
      ["steps"]: data.index === newStepsValue ? data.steps : data.steps + 1, //yön değiştiremiyorsa step artmamalı
      ["index"]: newStepsValue,
      ["message"]:newStepsMessage,
      }) 
  
   
  }

    console.log("data",data);
 



  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setData({...data,
      ["email"]:evt.target.value,
    })
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
      axios
        .post(
          "https://reqres.in/api/userss",data
        )
        .then((res) => {
          console.log("Yeni product kayıt res > ", res.data);
        });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXYMesaj()}</h3>
        <h3 id="steps">{data.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === data.index ? ' active' : ''}`}>
              {idx === data.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle} >SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange} ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
