var numberOfDiscs = 2;
var maxWidth = parseInt(window.document.documentElement.clientWidth);
var maxHeight = parseInt(window.document.documentElement.clientHeight);
var levelUp = false;
var towerWidth = parseInt(window.document.documentElement.clientWidth) * 0.1;

$(function () {

    $(".meteor").height((maxHeight * 0.8) + "px");
    $(".towers").height((maxHeight * 0.1) + "px");

    levelUp = true;
    setInterval(function () { Init(); }, 1000);

});

function Init() {
    if (levelUp) {
        levelUp = false;
        numberOfDiscs += 1;

        $("#theBullet, #theMeteor, .tower, .disc-real, .disc-fake, .weapon").remove();
        setup(numberOfDiscs, maxWidth, maxHeight);
        refreshUI(maxWidth, maxHeight);

        //playSatellite(maxWidth, maxHeight);
    }
}

function myDrop(event, ui) {
    var $this = $(this);
    var $disc = $this.find(".disc-real:first");
    var $newDisc = $(event.srcElement);

    $(".disc-fake").remove();
    $newDisc.attr("style", "");
    $this.prepend($newDisc);
    refreshUI(maxWidth, maxHeight);
    verifyShot($this, maxWidth, maxHeight, numberOfDiscs);
}

function refreshUI(maxWidth, maxHeight) {
    $(".disc-fake, .disc-real").draggable("destroy");

    $(".disc-fake").remove();

    $(".tower").each(function (index, element) {
        var $tower = $(element);
        var $firstDisc = $tower.find(".disc-real:first");
        
        $firstDisc.draggable({ revert: 'invalid' });

        var value = $firstDisc.data("value");
        var acceptSelector = '';

        var aditionalDisks = numberOfDiscs - $tower.find("div").length;
        for (var i = 0; i < aditionalDisks; i++) {
            var $discFake = $("<div class='disc-fake ui-widget-content' />");
            $discFake.css({ width: towerWidth + "px" });
            $tower.prepend($discFake);

        }

        if ($firstDisc.length == 0) { //empty tower
            value = 100;
        }

        $(".disc-real").each(function (index, item) {
            var $item = $(item);
            var itemValue = parseInt($item.data("value"));
            $item.addClass(itemValue);

            if (itemValue < value)
                acceptSelector = (acceptSelector + '.' + itemValue + ', ');
        });

        var lastComma = acceptSelector.lastIndexOf(",");
        acceptSelector = acceptSelector.substring(0, acceptSelector.length - 2);

        $tower.droppable("destroy");
        $tower.droppable({ drop: myDrop, tolerance: "touch" }, "option", "accept", acceptSelector);

    });

    $(".disc-fake, .disc-real").height((maxHeight * 0.03) + "px")
                                .width((maxWidth * 0.03) + "px");
}

function playSatellite(maxWidth, maxHeight) {
    var $img = $("<img/>");
    
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
        var speed = 70 / numberOfDiscs;
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

    var width = maxHeight * 0.05;
    var top = maxHeight * 0.8;
    var left = maxWidth * 0.37;

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
        var speed = 400;

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

        if (y <= yMeteor + meteorSize || y <= 0) {
            $meteor.remove();
            $bullet.remove();
            levelUp = true;
        }

    }, intervalSpeed);
}

function setup(numberOfDiscs, maxWidth, maxHeight) {
    var $towers = $(".towers");
    
    var towerTop = maxHeight * 0.8;
    var xOffSet = $towers.offset().left;
    var numbers = [];

    for (var i = 0; i < numberOfDiscs; i++) {
        var value = random(numberOfDiscs, numbers);

        var $tower = $("<div class='tower'/>");
        var $disc = $("<div class='disc-real ui-widget-content'/>");
        var discWidth = towerWidth * ((i + 1) / towerWidth);

        $tower.css({ width: towerWidth + "px", top: towerTop + "px", left: i * towerWidth + xOffSet + "px", position: "absolute" });

        $disc.data("value", value);
        $disc.css({ width: discWidth + "px" });
        $disc.text(value);
        $disc.addClass(value);

        if (value == 1) { //the disc which is the fire
            $disc.addClass("fire");
        }

        $tower.prepend($disc);

        for (var j = 0; j < (numberOfDiscs - 1); j++) {
            var $discFake = $("<div class='disc-fake ui-widget-content' />");
            $discFake.css({ width: towerWidth + "px" });
            $tower.prepend($discFake);
        }

        $towers.prepend($tower);
    }

    var $weapon = $("<img class='weapon' src='./img/weapon.gif' />");
    $weapon.css({
        height: (maxHeight * 0.1) + "px",
        width: (maxWidth * 0.09) + "px",
        position: "absolute",
        left: towerWidth * numberOfDiscs + xOffSet + "px"
    });

    $towers.prepend($weapon);
}

function random(max, existing) {
    var number = 0;

    while (true) {
        number = 1 + Math.floor(Math.random() * max);
        if (!existing[number]) {
            existing[number] = number;
            return number;
        }
    }
}