const userIP= document.getElementById("yourIp");
let ip_address = null;
function getIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ip_address = data.ip;
      console.log(data);
      console.log("Your public IP address is:", ip_address);
      userIP.innerHTML = ip_address;
    })
    .catch((error) => {
      console.error("Error fetching IP:", error);
    });
}

getIP();
var LocationData;

const container = document.querySelector(".container");
const post = document.getElementById("post");
const dataDiv = document.getElementById("dataDiv");
const infoDiv = document.getElementById("info-div");
var locationData;
var IPAdressData;
var postofficeData;

var postalCard;

async function ShowData() {

  container.style.display = "none";
  post.style.display = "block";

  var IPAddress;
  
  await $.getJSON("https://api.ipify.org?format=json", function (data) {
    IPAddress = data.ip;
  });

  console.log(IPAddress);

  await fetch(`https://ipinfo.io/${IPAddress}?token=c3a4be400e1f13`)
  .then((response) => response.json())
    .then((response) => (IPAdressData = response))
    .catch(() => {
      alert("Problem with fetching data");
    });

  console.log(IPAdressData);
  var latLong = IPAdressData.loc.split(",");
  var lat = latLong[0].trim();
  var long = latLong[1].trim();
  console.log(lat, long);

  await fetch(`http://api.ipstack.com/${IPAddress}?access_key=e7c237e6062bd6c622f381d13fd094af`)
    .then((response) => response.json())
    .then((response) => (locationData = response))
    .catch(() => {
      alert("Problem with fetching data");
    });
  console.log(locationData);

  // Fetching Data for UserIP
  dataDiv.innerHTML += `
   <nav>
        <div class="nav">
          <h1>IP Address : <span id="IpAdd">${IPAddress}</span></h1>

          <div class="information">
            <div class="lat">
              <h1>Lat:${"  " + lat}</h1>
              <h1>Long:${"  " + long}</h1>
            </div>
            <div id="city">
              <h1>City:${"  " + locationData.city}</h1>
              <h1>Region:${"  " + locationData.region_name}</h1>
            </div>
            <div id="organisation">
              <h1>Organisation:${"  " + IPAdressData.org}</h1>
              <h1>Hostname: Dinesh Reddy <img src="${locationData.location.country_flag}" id="flag"></h1>
            </div>
          </div>
        </div>
        <div class="map">
          <h1>Your Current Location</h1>
          <iframe width="100%" height="400px" 
          src="https://maps.google.com/maps?q=${locationData.latitude}, ${locationData.longitude}&z=15&output=embed"
          frameborder="0"
          style="border: 0"
          id="mapFrame"
        ></iframe>
        </div>
      </nav>
  `;

  // ------------Time and postal Adress-------
  let datetime_str = new Date().toLocaleString("en-US", {
    timeZone: `${IPAdressData.timezone}`,
  });

  await fetch(`https://api.postalpincode.in/pincode/${locationData.zip} `)
    .then((res) => res.json())
    .then((res) => res[0])
    .then((res) => {
      console.log("postal data" + res);

      infoDiv.innerHTML += `
      <h1 id="info">More Information About You</h1>
          <div class="about-info">
            <h1>Time Zone:${"  " + IPAdressData.timezone}</h1>
            <h1>Date And Time:${"  " + datetime_str}</h1>
            <h1>Pincode:${"  " + locationData.zip}</h1>
              <h1> Message:${"  " + res.Message}</h1>
          </div>
       <div class="postOffice">
          <h1>Post Offices Near You</h1>
          <div class="box">
            <input placeholder="Search Post Offices Near you" type="search" name="" id="searchBox" onkeyup="searchKey()"/>
            <img src="Vector.png" alt="" />
          </div>
        </div>
        <div id="postalCard"></div>
      `;
      postalCard = document.getElementById("postalCard");
      return res.PostOffice;
    })
    .then((data) => {
      console.log(data);

      postofficeData = data;

      data.forEach((element) => {
        console.log(element);
        postalCard.innerHTML += `
        <div class="card">
            <div class="name">Name:${" " + element.Name}</div>
            <div class="Type">Branch Type:${" " + element.BranchType}</div>
            <div class="status">Delivery Status:${
              " " + element.DeliveryStatus
            }</div>
            <div class="dis">District:${" " + element.District}</div>
            <div class="div">Division:${" " + element.Division}</div>
          </div>
        `;
      });
    })
    .catch(() => {
      alert("Problem with fetching data");
    });
}

function searchKey() {
  postalCard.innerHTML = "";
  var searchValue = document.getElementById("searchBox").value;
  // console.log(searchValue);
  var searchFilter = postofficeData.filter((item) => {
    var filterValue = JSON.stringify(item);
    return filterValue.toLowerCase().includes(searchValue.toLowerCase());
  });
  searchFilter.forEach((element) => {
    postalCard.innerHTML += `
        <div class="card">
            <div class="name">Name:${" " + element.Name}</div>
            <div class="Type">Branch Type:${" " + element.BranchType}</div>
            <div class="status">Delivery Status:${
              " " + element.DeliveryStatus
            }</div>
            <div class="dis">District:${" " + element.District}</div>
            <div class="div">Division:${" " + element.Division}</div>
          </div>
        `;
  });
}
