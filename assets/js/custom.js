function toggleInterests(){
    let interests = document.getElementById('interests');
    let toggleButton = document.getElementById('toggleButton');
    if(interests.style.display === 'none'){
        interests.style.display = '';
        toggleButton.innerHTML = 'Read Less'
    }
    else{
        interests.style.display = 'none';
        toggleButton.innerHTML = 'Read More'
    }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}
