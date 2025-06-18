$(document).ready(function(){
    $("#openModalBtn").click(function(){
        $("#playlistModal").css("display", "block");
        fetchPlaylists(); 
    });

    $(".close").click(function(){
        $("#playlistModal").css("display", "none");
    });

    function fetchPlaylists() {
        $.ajax({
            url: 'fetch_playlists.php',
            type: 'GET',
            success: function(response){
                var playlists = JSON.parse(response);
                var playlistList = $("#playlistList");
                playlistList.empty(); 
                
                playlists.forEach(function(playlist){
                    var listItem = $("<li>").text(playlist.listName);
                    playlistList.append(listItem);
                });
            },
            error: function(xhr, status, error){
                console.error("Failed to fetch playlists:", error);
            }
        });
    }
});
