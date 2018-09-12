'use strict';

(function () {
    function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    document.body.addEventListener('click', function (event) {
        var howToPlay = document.getElementsByClassName('how-to-play')[0];
        if (event.target !== document.getElementsByClassName('instruction-toggle')[0] && event.target !== howToPlay && !isDescendant(howToPlay, event.target)) {
            document.getElementsByClassName('how-to-play-container')[0].style.display = 'none';
        }
    });
    document.getElementsByClassName('instruction-toggle')[0].addEventListener('click', function (event) {
        if (this === event.target) {
            document.getElementsByClassName('how-to-play-container')[0].style.display = 'flex';
        }
    });
    document.getElementsByClassName('play-button')[0].addEventListener('click', function (event) {
        if (this === event.target) {
            document.getElementsByClassName('how-to-play-container')[0].style.display = 'none';
        }
    });
    function Card(num) {
        var ele = document.createElement('div');
        ele.innerText = num;
        ele.classList.add('card');
        ele.dataset.data = num;
        return ele;
    }

    var score = 0;

    var validValues = [2, 4, 8, 16, 32, 64];
    var globalArr = {
        src: []
    };

    function putCard(ele) {
        var val = Math.floor(Math.random() * (5 - 0 + 1) + 0);
        var card = new Card(validValues[val]);
        var srcContainer = document.getElementById('card-' + ele + '-container');
        srcContainer.insertBefore(card, srcContainer.firstChild);
        globalArr[ele].unshift(card);
    }

    function addCard() {
        putCardInDest();
    }

    function setup() {
        var showInstruction = localStorage.getItem('instruction');
        if (!showInstruction) {
            document.getElementsByClassName('how-to-play-container')[0].style.display = 'flex';
        }
        var viewport = document.getElementById('myViewport');
        var scale = ((window.outerWidth / 452).toFixed(2) - 0.02).toFixed(2);
        var val = "width=device-width, initial-scale=" + scale + ", maximum-scale=1.0, user-scalable=no";
        viewport.setAttribute('content', val);
        putCard('src');
        putCard('src');
        document.getElementById('high-score').innerText = localStorage.getItem('high-score') ? localStorage.getItem('high-score') : 0;
        localStorage.setItem('instruction', true);
    }

    window.onload = function () {
        setup();
    };

    var topValues = Array(4).fill(-1);
    var fullFlag = Array(4).fill(false);
    var slot = document.getElementsByClassName('slot');
    for (var i = 0; i < slot.length; i++) {
        slot[i].addEventListener('click', handleClickOnSlot);
    }
    var normalizeFlag = false;

    function handleClickOnSlot() {

        if (normalizeFlag) {
            return;
        }
        var topCard = globalArr['src'][globalArr['src'].length - 1];

        var topCardBoundingRect = topCard.getBoundingClientRect();
        var lastChild = this.children.length > 1 && this.children[this.children.length - 1];
        if (!fullFlag[parseInt(this.dataset.index) - 1] || topCard.dataset.data === lastChild.dataset.data) {
            normalizeFlag = true;
            var card = globalArr['src'].pop();
            var cloneCard = card.cloneNode(true);
            var rect = card.getBoundingClientRect();
            var rectOfLastChild = lastChild ? lastChild.getBoundingClientRect() : this.getBoundingClientRect();
            card.classList.add('card-in-slot');
            card.style.top = topValues[parseInt(this.dataset.index) - 1] + 'px';
            topValues[parseInt(this.dataset.index) - 1] += 30;
            card.style.opacity = '0';
            animateIt(cloneCard, rect, rectOfLastChild, card, this);
            var firstCard = globalArr['src'][0];
            var firstCardClone = firstCard.cloneNode(true);
            animateIt(firstCardClone, firstCard.getBoundingClientRect(), topCardBoundingRect, firstCard, this, true);
            this.appendChild(card);
            var that = this;
            setTimeout(function () {
                normalizeSlot(that);
            }, 1200);
            putCard('src');
        } else {
            alert('Current slot is filled');
        }
    }

    document.getElementById('score').innerText = score;
    var firstHighScoreFlag = false;
    function normalizeSlot(slot) {
        var children = slot.children;
        var scoreMultiplier = 1;
        for (var _i = children.length - 1; _i > 0; _i--) {
            var child1 = children[_i],
                child2 = children[_i - 1];
            if (child1.dataset.data === child2.dataset.data) {

                child2.dataset.data = parseInt(child1.dataset.data) + parseInt(child2.dataset.data);
                score = !score ? parseInt(child2.dataset.data) : score + parseInt(child2.dataset.data) * scoreMultiplier;
                scoreMultiplier++;
                child2.innerText = child2.dataset.data;
                slot.removeChild(child1);
                topValues[parseInt(slot.dataset.index) - 1] -= 30;
                if (_i < slot.children.length - 1) {
                    _i++;
                }
                //document.getElementById('score').innerText = score;
                updateScore(document.getElementById('score'), score, 1000);
                var highScore = localStorage.getItem('high-score') ? localStorage.getItem('high-score') : 0;
                if (highScore < score) {
                    updateScore(document.getElementById('high-score'), score, 1000);
                    if (!firstHighScoreFlag) {
                        firstHighScoreFlag = true;
                        document.getElementsByClassName('high-score')[0].classList.add('high-score-animation');
                        document.getElementById('card-dest-container').classList.add('shadow');
                        document.getElementById('card-src-container').classList.add('shadow');
                        document.body.style.background = '#000';
                        document.getElementById('card-src-container').style.background = '#212121';
                        document.getElementById('card-dest-container').style.background = '#212121';
                        document.getElementById('score').style.color = '#fff';
                        document.getElementsByClassName('highest-score')[0].style.color = '#fff';
                        setTimeout(function () {
                            document.getElementById('card-dest-container').classList.remove('shadow');
                            document.getElementById('card-src-container').classList.remove('shadow');
                            document.body.style.background = '#eeeeee';
                            document.getElementById('card-src-container').style.background = '#ffffff';
                            document.getElementById('card-dest-container').style.background = '#ffffff';
                            document.getElementsByClassName('high-score')[0].classList.remove('high-score-animation');
                            document.getElementById('score').style.color = '#000';
                            document.getElementsByClassName('highest-score')[0].style.color = '#000';
                        }, 3000);
                    }
                    localStorage.setItem('high-score', score);
                }
            }
        }
        if (slot.children.length > 8) {
            fullFlag[parseInt(slot.dataset.index) - 1] = true;
        } else {
            fullFlag[parseInt(slot.dataset.index) - 1] = false;
        }
        if (gameOver()) {
            alert('Game Over');
            reloadGame();
            return;
        }
        normalizeFlag = false;
    }

    document.getElementById('discard').addEventListener('click', handleDiscard);

    var discardCount = 0;

    function handleDiscard() {
        if (discardCount < 2) {
            var card = globalArr['src'].pop();
            var color = window.getComputedStyle(card, null).getPropertyValue('background-color');
            var cloneCard = card.cloneNode(true);
            var discardNode = document.getElementById('discard');
            animateIt(cloneCard, card.getBoundingClientRect(), discardNode.getBoundingClientRect(), card, null, true);
            document.getElementById('card-src-container').removeChild(card);
            putCard('src');
            discardCount++;
            document.querySelector('.discard-count').innerHTML = discardCount;
            setTimeout(function () {
                document.getElementsByClassName('slot-' + discardCount)[0].style.background = color;
                document.getElementsByClassName('slot-' + discardCount)[0].style.color = 'white';
            }, 1500);
        } else {
            alert('No more cards can be discarded');
        }
    }

    function animateIt(node, rect, to, card, slot, srcCardFlag) {

        //let rect = realNode.getBoundingClientRect();
        node.classList.add('fake-node');
        document.body.appendChild(node);
        node.style.left = rect.x + 'px';
        node.style.top = rect.y + 'px';
        node.style.margin = '0';
        setTimeout(function () {
            node.style.left = to.x + 'px';
            if (srcCardFlag) {
                node.style.top = to.y + 'px';
                card.style.opacity = '0';
            } else if (slot.children.length < 3) {
                node.style.top = to.y + 1 + 'px';
                node.style.left = to.x + 2 + 'px';
            } else {
                node.style.top = to.y + 30 + 'px';
            }
        }, 10);

        setTimeout(function () {
            node.style.display = 'none';
            card.style.opacity = '1';
            if (!srcCardFlag) {
                card.style.left = '0px';
            }
        }, 1100);
    }

    function gameOver() {
        var flag = true;
        fullFlag.forEach(function (e) {
            flag = flag && e;
        });
        return flag;
    }

    function reloadGame() {
        var slots = document.getElementsByClassName('slot');
        for (var _i2 = 0; _i2 < slots.length; _i2++) {
            while (slots[_i2].firstChild) {
                slots[_i2].removeChild(slots[_i2].firstChild);
            }
            slots[_i2].innerHTML = '<div class="slot-inner">' + '<div id="art" class="hand"></div></div>';
        }
        discardCount = 0;
        normalizeFlag = false;
        fullFlag = Array(4).fill(false);
        topValues = Array(4).fill(-1);
        score = 0;
        document.getElementById('score').innerText = score;
        document.getElementsByClassName('slot-' + 1)[0].style.background = '#e0e0e0';
        document.getElementsByClassName('slot-' + 2)[0].style.background = '#e0e0e0';
        document.getElementsByClassName('slot-' + 1)[0].style.color = 'black';
        document.getElementsByClassName('slot-' + 2)[0].style.color = 'black';

        firstHighScoreFlag = false;
    }

    var updateScore = function updateScore(element, score, time) {
        var oldScore = parseInt(element.innerHTML);
        if (oldScore >= score) {
            return;
        };
        var stepTime = time / 50;
        var diff = score - oldScore;
        var stepSize = parseInt(diff / 50, 10) + 1;
        var timer = setInterval(function () {
            oldScore = oldScore + stepSize;
            if (oldScore >= score) {
                element.innerHTML = score;
                clearInterval(timer);
            } else {
                element.innerHTML = oldScore;
            }
        }, stepTime);
        setTimeout(function () {}, time);
    };

    document.getElementById('reload').addEventListener('click', reloadGame);
    //# sourceURL=userscript.js
})();