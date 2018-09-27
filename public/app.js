getResults();
// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current articles
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length-1; i++) {     
    $("#results").prepend( 


                   " <div id='wrapper' class=' rounded my-auto mx-1 px-1 text-center border bg-secondary rounded-3'>"+
                   "<button data-id="+data[i]._id+" class='btn float-left m-3 rounded-circle btn-outline-success text-success  save'>&#9829;</button>"+
                   "<button data-id="+data[i]._id+" class=' delete float-right m-4 px-2 py-0 btn btn-outline-danger'>&times;</button>"+ 
                   "<div class='bg-white rounded p-1 mt-1 w-80'><img class='my-3 mx-auto' src='https://www.thoughtco.com/thmb/g6QxWI4GWet9HeUT4NEqTIJ7B_g=/3325x664/filters:fill(auto,1)/The-Onion-581247455f9b58564cb87f03.jpg' width=250 height=50 /></div>"+
                    "<div class='data-entry card text-left p-2 m-2 mx-4' data-id=" + data[i]._id+">"+
                      "<h4 class='dataTitle text-left' data-id="+data[i]._id+">"+data[i].headline+"</h4>"+
                      "<hr class='my-2'>"+
                     "<div class='card-body my-1'><img id='article'class=' p-3 float-right col-md-5 ' src="+data[i].image+"></img><div>"+
                     "<p class='text-left mb-2 p-relative' id='summary'>"+ data[i].shortsum +
                     "<br><a class='full mx-3 pt-1' target='_blank' href=" + data[i].anchor +
                    "><small>Read Full Story</small></a>"+
                     "</div></p></div>")
    }
  });
}
$(document).on("click","#scraper",function(){
  try{$.ajax({
    type: "GET",
    dataType: "json",
    url: "/scrape",
  }).then(function(){
    getResults()
  })}
  catch{ console.log('ran into problem')}
});
// When user clicks the delete button for a note
$(document).on("click", ".delete", function(event) {
  // Save the p tag that encloses the button
  console.log($(this).attr('data-id'))
  var selected = ($(this).attr('data-id'))
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "delete",
    url: "/delete/" + selected,
    success: function(response) {
      $(this).parent().remove();
      getResults()
    }
  });
});

// When user click's on note title, show the note, and allow for updates
$(document).on("click", ".dataTitle", function() {
  var selected = $(this);

  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      // Fill the inputs with the data that the ajax call collected
      $("#shortsum").val(data[0].shortsum);
      $("#headline").val(data[0].headline);
    }
  });
});
