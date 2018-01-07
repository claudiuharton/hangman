async function readTextFile(file) {
    let data = await  axios.get(file);
    return data.data.split('\n');

}


function playSound(soundID) {
    createjs.Sound.play(soundID);
}


readTextFile('words.txt').then((words) => {

    let target = document.getElementsByTagName("input")[0];

    if (Event.currentTarget !== target) {
        target.focus();
        target.click();
    }


    const MAX = 5;

    createjs.Sound.registerSound("sounds/success.wav", 'success');
    createjs.Sound.registerSound("sounds/fail.wav", 'fail');
    createjs.Sound.registerSound("sounds/win.wav", 'win');
    createjs.Sound.registerSound("sounds/error.wav", 'error');
    createjs.Sound.registerSound("sounds/again.wav", 'again');


    let reset = document.getElementById("reset");
    let word;
    let placeholder;
    let currentLives;
    let flag_isValidPress;
    let remaining;
    let image;
    let memory = [];
    let status = {
        level: 1,
        points: 0,

    };
    let remainingTime;
    let endTime;
    let initialTime = 120 * 1000;
    let initialPoints = 5;
    let levelPoints;
    let currentTime = initialTime;

    function validate(strValue) {
        let objRegExp = /^[A-Z]+$/;
        return objRegExp.test(strValue) && strValue.length === 1;
    }


    reset.onclick = () => {
        document.getElementById("hiddenInput").focus();
        document.getElementById("hiddenInput").click();
        if (!document.getElementById("final").firstChild) {
            status.points = 0;
            status.level = 1;
        }

        if (status.level === 1) {
            levelPoints = initialPoints * 2;
            currentTime = initialTime;
            endTime = Date.now() + initialTime;
        } else {
            levelPoints *= 2;
            currentTime /= 1.25;
            endTime = Date.now() + currentTime;
        }
        memory = [];
        remainingTime = endTime - Date.now();
        document.getElementById("level").innerHTML = `LEVEL: ${status.level}`;
        document.getElementById("points").innerHTML = `POINTS: ${status.points}`;
        document.getElementById("time").innerHTML = `TIME: ${Math.floor(remainingTime / 1000)} seconds`;


        setInterval(() => {
            if (!document.getElementById("final").firstChild) {
                remainingTime = endTime - Date.now();
            }
            if (remainingTime > 0) {

                document.getElementById("time").innerHTML = `TIME: ${Math.floor(remainingTime / 1000)} seconds`;

                if (Math.floor(remainingTime / 1000) < 6) {
                    document.getElementById("time").setAttribute('style', 'color:red');
                } else {
                    document.getElementById("time").setAttribute('style', 'color:inherit');
                }

            }

            if (remainingTime < 0 && !document.getElementById("final").firstChild) {
                document.getElementById("time").innerHTML = 'TIME: 0 seconds';
                playSound('fail');
                let final = document.getElementById("final");
                let newParagraph = document.createElement("p");
                newParagraph.setAttribute('id', 'message');
                newParagraph.setAttribute('style', 'color:red');
                newParagraph.innerHTML = `OUT OF TIME! The word was <b>"${word.toUpperCase()}"</b>.<br>
                                          Check out the definition on <a target="_blank" href="https://dexonline.ro/definitie/${word}">DEX</a>.`;
                final.appendChild(newParagraph);


                status.points = 0;
                status.level = 1;
            }
        }, 1000);


        //reset.innerHTML = "RESET";
        let myNode = document.getElementById("placeholder");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        myNode = document.getElementById("life");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        myNode = document.getElementById("all_letters");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        myNode = document.getElementById("final");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        myNode = document.getElementById("image");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }


        let all_letters = document.getElementById("all_letters");
        for (let i = 0, len = 26; i < len; i++) {
            let newParagraph = document.createElement("p");
            newParagraph.innerHTML = String.fromCharCode(i + 65);
            all_letters.appendChild(newParagraph);
        }


        let final = document.getElementById("life");
        let remainingText = document.createElement("p");
        remainingText.setAttribute('id', 'remaining-text');
        remainingText.innerHTML = "Remaining lives:&nbsp;";
        final.appendChild(remainingText);

        let img = document.getElementById("image");
        image = document.createElement("img");
        image.setAttribute('src', 'images/hang0.gif');
        img.appendChild(image);

        currentLives = 0;
        remaining = document.createElement("p");
        remaining.setAttribute('id', 'remaining');
        remaining.innerHTML = (MAX).toString();
        final.appendChild(remaining);


        let position = Math.floor(words.length * Math.random());
        word = words[position];
        console.log('The word is: ' + word);
        placeholder = document.getElementById("placeholder");

        for (let i = 0, len = word.length; i < len; i++) {
            let newParagraph = document.createElement("p");
            newParagraph.innerHTML = "_";
            placeholder.appendChild(newParagraph);
        }


    };

    function onKeypress(event) {


        if (!document.getElementById('message')) {
            flag_isValidPress = true;
            let flag_noUnderLineRemaining = true;
            let flag_firstPress = null;
            event.preventDefault();
            let all_letters = document.getElementById("all_letters");
            for (let i = 0, len = word.length; i < len; i++) {
                let newParagraph = placeholder.querySelector(`p:nth-child(${ i + 1 })`);

                if (event.key.toUpperCase() === word.charAt(i).toUpperCase()) {


                    if (newParagraph.innerHTML !== '_') {
                        playSound('again');
                        flag_firstPress = newParagraph.innerHTML;

                    } else {
                        playSound('success');
                        newParagraph.innerHTML = event.key.toUpperCase();
                        let letterParagraph = all_letters.querySelector(`p:nth-child(${ word.charAt(i).toUpperCase().charCodeAt(0) - 64 })`);
                        letterParagraph.setAttribute("style", "color:green; font-weight: bold");

                    }

                    flag_isValidPress = false;

                }
                if (newParagraph.innerHTML === '_') {

                    flag_noUnderLineRemaining = false;
                }


            }

            if (!flag_isValidPress) {
                memory.push(event.key.toUpperCase());
            }
            if (flag_noUnderLineRemaining && remainingTime > 0) {
                status.points += levelPoints + (Math.floor(remainingTime / (6 * 1000) * levelPoints));
                status.level++;
                playSound('win');
                document.getElementById("level").innerHTML = `LEVEL: ${status.level}`;
                document.getElementById("points").innerHTML = `POINTS: ${status.points}`;

                let final = document.getElementById("final");
                let newParagraph = document.createElement("p");
                newParagraph.setAttribute('id', 'message');
                newParagraph.setAttribute('style', 'color:green');
                newParagraph.innerHTML = `YOU WIN! The word was <b>"${word.toUpperCase()}"</b>.<br>                   
                                           Check out the definition on <a target="_blank" href="https://dexonline.ro/definitie/${word}">DEX</a>.`;
                final.appendChild(newParagraph);


            }


            if (!validate(event.key.toUpperCase())) {
                playSound('again');
            }
            else if (flag_isValidPress) {
                let select = all_letters.querySelector(`p:nth-child(${event.key.toUpperCase().charCodeAt(0) - 64 })`);
                if (select.style.color !== 'red') {

                    currentLives++;
                    playSound('error');
                    let letterParagraph = all_letters.querySelector(`p:nth-child(${event.key.toUpperCase().charCodeAt(0) - 64 })`);
                    letterParagraph.setAttribute("style", "color:red; font-weight: bold");
                    remaining.innerHTML = (MAX - currentLives).toString();

                    switch (currentLives) {
                        case 1:
                            image.setAttribute('src', 'images/hang0.gif');
                            break;
                        case 2:
                            image.setAttribute('src', 'images/hang2.gif');
                            break;
                        case 3:
                            image.setAttribute('src', 'images/hang3.gif');
                            break;
                        case 4:
                            image.setAttribute('src', 'images/hang4.gif');
                            break;
                        case 5:
                            image.setAttribute('src', 'images/hang5.gif');
                            break;

                        default:
                            break;
                    }


                    if (MAX - currentLives === 0) {
                        playSound('fail');


                        let final = document.getElementById("final");
                        let newParagraph = document.createElement("p");
                        newParagraph.setAttribute('id', 'message');
                        newParagraph.setAttribute('style', 'color:red');
                        newParagraph.innerHTML = `YOU LOOSED! The word was <b>"${word.toUpperCase()}"</b>.<br> 
                                              Check out the definition on <a target="_blank" href="https://dexonline.ro/definitie/${word}">DEX</a>.`;
                        final.appendChild(newParagraph);
                        status.points = 0;
                        status.level = 1;
                    }
                } else {
                    playSound('again');
                }


                event.stopPropagation();
            }
        }
    }

    document.addEventListener("keydown", (event) => {
        onKeypress(event);
    }, false);

 document.getElementById(`hiddenInput`).addEventListener("input", (event) => {
        onKeypress(event);
    }, false);



});