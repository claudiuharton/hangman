async function readTextFile(file) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.send(null);
    return rawFile.response.split('\n');

}


readTextFile('words.txt').then((words) => {
    console.log(words);
    const MAX = 5;

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
    let currentTime =initialTime;
    function validate(strValue) {
        let objRegExp = /^[A-Z]+$/;
        return objRegExp.test(strValue) && strValue.length === 1;
    }


    reset.onclick = () => {

        if (status.level ===1){
            levelPoints = initialPoints*2;
            currentTime =initialTime;
            endTime = Date.now() + initialTime/2;
        }else{
            levelPoints *=2;
            currentTime /=2;
            endTime = Date.now() + currentTime;
        }


        console.log('endtime: ' + endTime/60);
        memory = [];
        //reset.innerHTML = "RESET";
        let myNode = document.getElementById("placeholder");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        myNode = document.getElementById("life");
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


        let final = document.getElementById("life");
        let remainingText = document.createElement("p");
        remainingText.setAttribute('id', 'remaining-text');
        remainingText.innerHTML = "Remaining lives:&nbsp;";
        final.appendChild(remainingText);

        let img = document.getElementById("image");
        image = document.createElement("img");
        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang0.gif');
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


    document.addEventListener("keydown", (event) => {
        remainingTime = endTime - Date.now();
        console.log(`remainingTime: ${Math.floor(remainingTime/1000)} seconds `);


        if (!document.getElementById('message')) {
            flag_isValidPress = true;
            let flag_noUnderLineRemaining = true;
            let flag_firstPress = null;
            event.preventDefault();
            for (let i = 0, len = word.length; i < len; i++) {
                let newParagraph = placeholder.querySelector(`p:nth-child(${ i + 1 })`);
                if (event.key.toUpperCase() === word.charAt(i).toUpperCase()) {
                    if (newParagraph.innerHTML !== '_') {
                        flag_firstPress = newParagraph.innerHTML;
                    }
                    newParagraph.innerHTML = event.key.toUpperCase();
                    flag_isValidPress = false;

                }
                if (newParagraph.innerHTML === '_') {
                    flag_noUnderLineRemaining = false;
                }

                // if (flag_firstPress && memory.includes(event.key.toUpperCase())) {
                //     flag_isValidPress = true;
                // }


            }

            if (!flag_isValidPress) {
                memory.push(event.key.toUpperCase());
            }
            if (flag_noUnderLineRemaining && remainingTime>0) {
                status.points+=levelPoints+(Math.floor(remainingTime/6000*levelPoints)  );
                status.level++;

                let final = document.getElementById("final");
                let newParagraph = document.createElement("p");
                newParagraph.setAttribute('id', 'message');
                newParagraph.setAttribute('style', 'color:green');
                newParagraph.innerHTML = `You win! The word was <b>"${word.toUpperCase()}"</b>..<br> You reached level ${status.level} and obtained ${status.points} points.<br> You can proceed to next level.`;
                final.appendChild(newParagraph);

                console.log(status);
            }

            if (remainingTime < 0){

                let final = document.getElementById("final");
                let newParagraph = document.createElement("p");
                newParagraph.setAttribute('id', 'message');
                newParagraph.setAttribute('style', 'color:red');
                newParagraph.innerHTML = `You were out of time! The word was <b>"${word.toUpperCase()}"</b>.<br> You reached level ${status.level} and obtained ${status.points} points.`;
                final.appendChild(newParagraph);

                console.log(status);
                status.points=0;
                status.level=1;
            }


            if (flag_isValidPress && validate(event.key.toUpperCase())) {
                currentLives++;
                remaining.innerHTML = (MAX - currentLives).toString();

                switch (currentLives) {
                    case 1:
                        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang1.gif');
                        break;
                    case 2:
                        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang2.gif');
                        break;
                    case 3:
                        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang3.gif');
                        break;
                    case 4:
                        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang4.gif');
                        break;
                    case 5:
                        image.setAttribute('src', 'https://raw.githubusercontent.com/mikenorthorp/Hangman/master/images/hang5.gif');
                        break;

                    default:
                        break;
                }


                if (MAX - currentLives === 0) {
                    let final = document.getElementById("final");
                    let newParagraph = document.createElement("p");
                    newParagraph.setAttribute('id', 'message');
                    newParagraph.setAttribute('style', 'color:red');
                    newParagraph.innerHTML = `You loosed! The word was <b>"${word.toUpperCase()}"</b>.<br> You reached level ${status.level} and obtained ${status.points} points.`;
                    final.appendChild(newParagraph);
                    status.points=0;
                    status.level=1;
                }
            }


            event.stopPropagation();
        }
    }, true);

});