
$(function () {
    var maxWidth = parseInt(window.document.documentElement.clientWidth);
    var maxHeight = parseInt(window.document.documentElement.clientHeight);
    var numberOfDiscs = 3;

    $(".meteor").height((maxHeight * 0.8) + "px");
    $(".towers").height((maxHeight * 0.1) + "px");

    $(".1").data("value", 1);
    $(".2").data("value", 2);
    $(".3").data("value", 3);

    refreshUI(maxWidth, maxHeight);
    $(".weapon").height((maxHeight * 0.1) + "px").width((maxWidth * 0.09) + "px");

    $(".tower").droppable({
        drop: function (event, ui) {
            var $this = $(this);
            var $disc = $this.find(".disc-real:first");
            var $newDisc = $(event.srcElement);

            var currentValue = parseInt($disc.data("value"));
            var newValue = parseInt($newDisc.data("value"));

            $this.find(".disc-fake").remove();

            $newDisc.attr("style", "");

            $this.prepend($newDisc);

            $(".tower").each(function (index, element) {
                var $tower = $(element);

                for (var i = 0; i < 3 - $tower.find("img").length; i++) {
                    $tower.prepend('<img class="disc-fake ui-widget-content" src="img/disk-fake.gif" alt="" />');
                }
            });

            refreshUI(maxWidth, maxHeight);

            verifyShot($this, maxWidth, maxHeight, numberOfDiscs);
        }
    });

    playSatellite(maxWidth, maxHeight);

});

function refreshUI(maxWidth, maxHeight) {
    $(".disc-fake, .disc-real")
        .height((maxHeight * 0.03) + "px")
        .width((maxWidth * 0.03) + "px")
        .draggable("destroy");

    $(".tower").each(function (index, element) {
        var $tower = $(element);
        var $firstDisc = $tower.find(".disc-real:first");
        $firstDisc.draggable({ revert: 'invalid' });

        var val = parseInt($firstDisc.data("value")) - 1;

        $tower.droppable("option", "accept", '.' + val);

    });
}

function playSatellite(maxWidth, maxHeight) {
    var $img = $("<img/>");
    console.log("Creando");

    var width = maxHeight * 0.5
    var top = -1 * width;
    var left = maxHeight + width;

    $img.attr("id", "theMeteor")
        .attr("src", "./img/satellite.gif")
        .css({
            position: "absolute",
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: width + "px"
        })
        .data("x", left)
        .data("y", top)
        .data("size", width);


    $(".meteor").append($img);


    var intervalSpeed = 10; //milliseconds
    return setInterval(function () {
        var speed = 100;
        console.log("moviendo");
        var $meteor = $("#theMeteor");

        var x = parseFloat($meteor.data("x"));
        var y = parseFloat($meteor.data("y"));

        var delta = (speed * (intervalSpeed / 1000));
        x += -1 * delta;
        y += delta;

        $meteor.css({
            top: y + "px",
            left: x + "px"
        })
        .data("x", x)
        .data("y", y);

        if (y + width >= maxHeight * 0.8) {
            $("#main *").remove();
            alert("Game over");
        }

    }, intervalSpeed);
}

function verifyShot($tower, maxWidth, maxHeight, numberOfDiscs) {
    if ($tower.find(".disc-real").length == numberOfDiscs) {
        shot(maxWidth, maxHeight);
    }
}

function shot(maxWidth, maxHeight) {
    var $img = $("<img/>");

    var width = maxHeight * 0.02;
    var top = maxHeight * 0.8;
    var left = maxWidth * 0.4;

    $img.attr("id", "theBullet")
        .attr("src", "./img/bullet.gif")
        .css({
            position: "absolute",
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: width + "px"
        })
        .data("x", left)
        .data("y", top);


    $(".meteor").append($img);


    var intervalSpeed = 10; //milliseconds
    return setInterval(function () {
        var speed = 200;

        var $bullet = $("#theBullet");
        var $meteor = $("#theMeteor");

        var x = parseFloat($bullet.data("x"));
        var y = parseFloat($bullet.data("y"));

        var xMeteor = $meteor.data("x");
        var yMeteor = $meteor.data("y");
        var meteorSize = $meteor.data("size");

        var delta = (speed * (intervalSpeed / 1000));
        x += delta;
        y += -1 * delta;

        $bullet.css({
            top: y + "px",
            left: x + "px"
        })
        .data("x", x)
        .data("y", y);

        if (y <= yMeteor + meteorSize) {
            $meteor.remove();
            $bullet.remove();

        }

    }, intervalSpeed);
}