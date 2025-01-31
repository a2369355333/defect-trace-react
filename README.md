[點擊這裡查看網站_Wafer-Defect-Trace](https://a2369355333.github.io/defect-trace-react/)

<h3>專案名稱: Wafer Defect Trace</h3> 
追蹤目的: <br>
1.為了改善良率，利用沒生產的控片從每台機台拿到不良點分布再去對照原本的不良品不良點分布 <br>
2.從分佈點中找出相似的，就能得知這個不良品是從這台機台生產出來<br> 
3.再從這台機台調整參數，從而改善良率<br> 
<br>
<h4>初始畫面:</h4>
<img width="1280" alt="image" src="https://github.com/user-attachments/assets/b4b7c12d-5684-4563-a2d4-36e7745ef926" />
<br><br><br> 
<h4>STEP1: 選取機台後:</h4>
1. 左圖為X軸:日期&nbsp; Y軸:不良率數量<br> 
2. 右圖分為三個TAB:<br> 
&nbsp;&nbsp;&nbsp; Box_Plot_Summary: 這台機台這段時間總共 defect 數量分佈 <br>
&nbsp;&nbsp;&nbsp; Box_Plot_Date: 可以切時間找出該日期數量不良點分佈的盒鬚圖 <br>
&nbsp;&nbsp;&nbsp; Wafer_Map_Date: 可以切時間找出該日期不良點分佈的晶圓圖 <br>
<img width="1258" alt="image" src="https://github.com/user-attachments/assets/c035b58c-060b-4e96-ab02-e05552c6606b" />
<br><br><br> 
<h4>STEP2: 如圖中箭頭，點選不良點數量會同時產生盒鬚圖跟晶圓圖(Defect Count 等於0不會產生圖)</h4>
<img width="1250" alt="image" src="https://github.com/user-attachments/assets/0d79224c-4a17-4a5d-88e4-2c261181a8e8" />
<img width="1255" alt="image" src="https://github.com/user-attachments/assets/a0f1f67a-5f5e-4b96-84d2-5c15015549ff" />
<br><br><br> 
<h4>STEP3: 點選圖中眼睛可以放大圖，以便觀察點的分佈</h4>
<img width="1265" alt="image" src="https://github.com/user-attachments/assets/61aed290-0c28-4925-989c-41dd7f13be5c" />
<img width="1258" alt="image" src="https://github.com/user-attachments/assets/2609c398-933e-4bb9-846a-9fa529e1075d" />
<br><br><br> 
<h4>STEP4: 點選圖中右上角可以刪除該日期圖示，Box plot與 Wafer map兩個圖刪掉彼此不影響</h4>
下圖中盒鬚圖刪掉兩個: 只有一個圖 => 晶圓圖依舊是三個圖 (點選重複日期後盒鬚圖會再新增回來，晶圓圖則不會重複出現) <br>
<img width="1256" alt="image" src="https://github.com/user-attachments/assets/f2e9710b-b021-44b8-a38b-b592ca5b44e5" />
<img width="1250" alt="image" src="https://github.com/user-attachments/assets/4ae2a54e-384c-4840-91d3-5bbad8269f0a" />
<br><br><br> 
<h4>STEP5: 為了節省效率，垂直紫色線可以拖曳假設拖曳到兩點之間，則會出現兩個晶圓圖跟盒鬚圖</h4>
<img width="1258" alt="image" src="https://github.com/user-attachments/assets/c42d1b0b-d7c5-4dff-a773-51f8e00a91fd" />
<img width="1256" alt="image" src="https://github.com/user-attachments/assets/20b10188-7951-41de-b54e-f97571be1cc5" />
<br><br><br> 
<h4>**備註: 可以點選晶圓圖或是盒鬚圖，就能在左邊chart圖中顯示紅色箭頭找到對應日期**</h4>
<img width="1252" alt="image" src="https://github.com/user-attachments/assets/ef0dc59f-9770-4519-964c-0a30e1a1754f" />
<img width="1244" alt="image" src="https://github.com/user-attachments/assets/1ffe9d37-d085-4622-9b79-787f146d1f45" />
