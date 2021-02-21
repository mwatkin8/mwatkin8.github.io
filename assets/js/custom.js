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
