var songsArray = [];
var arrayShuffled;
var currentPosition = 0;
var correctAnswers = 0;
var loaded = true;

var checkCircle = `<svg viewBox="0 0 235 235" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="117.5" cy="117.5" r="117.5" fill="#1ED760"/>
                    <path d="M174 81L101.125 154L68 120.818" stroke="white" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;

var wrongCircle = `<svg viewBox="0 0 235 235" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="117.5" cy="117.5" r="117.5" fill="#DF313C"/>
                    <path d="M159 75L75 159" stroke="white" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M75 75L159 159" stroke="white" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`;

$(document).ready(function () {

  var params = getHashParams();

  var access_token = params.access_token;
  var error = params.error;

  if (error) {
    alert('There was an error during the authentication');

  } else {
    if (access_token) {
      $('#login').hide();
      $('#logged').css("display", "block");

      $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          var position = 1;

          response.items.forEach(song => {
            songsArray.push({
              'position': position,
              'name': song.name.replace('&','&amp').replace('<','&lt').replace('>','&gt'),
              'artist': song.artists[0].name.replace('&','&amp').replace('<','&lt').replace('>','&gt'),
              'cover': song.album.images[0].url.replace('&','&amp').replace('<','&lt').replace('>','&gt')
            });
            position++;
          });

          arrayShuffled = [...songsArray];
          shuffleArray(arrayShuffled);

          console.log(songsArray);

          displaySongs();

        },
        error: function (error) {
          console.log(error);
        }
      });
    } else {
      $('#login').show();
      $('#logged').hide();
    }
  }
});

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displaySongs() {
  $('#songsContainer').append('<div id=1 class=song onclick=checkAnswer(1)><img src="' + arrayShuffled[currentPosition].cover + '"/><div>' + arrayShuffled[currentPosition].name + ' - ' + arrayShuffled[currentPosition].artist + '</div></div>');
  $('#songsContainer').append('<div id=2 class=song onclick=checkAnswer(2)><img src="' + arrayShuffled[currentPosition+1].cover + '"/><div>' + arrayShuffled[currentPosition+1].name + ' - ' + arrayShuffled[currentPosition+1].artist + '</div></div>');
}

function changeSongs() {
  $('svg').remove();

  $('#1 img').attr("src", arrayShuffled[currentPosition].cover).stop(true,true).hide().fadeIn();
  $('#1 div').html(arrayShuffled[currentPosition].name + ' - ' + arrayShuffled[currentPosition].artist);

  $('#2 img').attr("src", arrayShuffled[currentPosition+1].cover).stop(true,true).hide().fadeIn();
  $('#2 div').html(arrayShuffled[currentPosition+1].name + ' - ' + arrayShuffled[currentPosition+1].artist);

  loaded = true;
}

function displayResults() {
  $('.result h3').after('<div>' + correctAnswers + '/10</div>');
  $('.result').css("display", "block");
  $('#logged').css("display", "none");
}

function checkAnswer(choice) {

  if (loaded) {
    loaded = false;

    if (choice == 1) {
      if(arrayShuffled[currentPosition].position < arrayShuffled[currentPosition+1].position) {
        correctAnswers++;
        $(checkCircle).appendTo('#1').hide().fadeIn(500);
      } else {
        $(wrongCircle).appendTo('#1').hide().fadeIn(500);
      }
      
    } else {
      if(arrayShuffled[currentPosition].position > arrayShuffled[currentPosition+1].position) {
        correctAnswers++;
        $(checkCircle).appendTo('#2').hide().fadeIn(500);
      } else {
        $(wrongCircle).appendTo('#2').hide().fadeIn(500);
      }
    }

    setTimeout(function() {
      if (currentPosition >= 18) {
        displayResults();
      } else {
        currentPosition = currentPosition + 2;
        changeSongs();
      }
    }, 2000);

  }
}