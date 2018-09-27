/* Note Taker (18.2.6)
 * front-end
 * ==================== */
 var iteration = 0;
 var current = []; // fill with 4 at a time

// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current articles
  $.getJSON("/all", function(data) {
    for (var i = 0; i < data.length-1; i++) {     
      if(data[i].headline.length > 40){ 
        data[i].headline.slice(40)
        data[i].headline += '...';
      }
    $("#results").append( 
                    " <div id='wrapper' class='row rounded my-auto mx-1 px-1 text-center bg-warning'>"+
                     "<div class='data-entry card text-left p-2 m-2' data-id=" + data[i]._id+">"+
                      "<h4 class='dataTitle text-left' data-id="+data[i]._id+">"+data[i].headline+"</h4>"+
                      "<hr class='my-2'>"+

                     "<div class='card-body my-1'><img id='article'class=' p-3 float-right col-md-5 ' src="+data[i].image+"></img><div>"+
                     "<p class='text-left mb-2 p-relative' id='summary'>"+ data[i].shortsum +
                     "<br><a class='full mx-3 pt-1' target='_blank' href=" + data[i].anchor +
                    "><small>Read Full Story</small></a>"+
                     "</div></p></div>")
    // 
    }
  });
}

$(document).on("mouseleave","#fav",function(btn){
  // update the article as a user favorite
  $(btn).val('star')
})
$(document).on("click","#scraper",function(){
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/scrape",
    success: function(response){
      getResults()
    }
  })
});
getResults()
// When user clicks the delete button for a note
$(document).on("click", ".delete", function(event) {
  // Save the p tag that encloses the button
  console.log($(this).attr('data-id'))
  var selected = ($(this).attr('data-id'))
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "delete",
    url: "/delete/" + selected.attr("data-id"),
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
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
