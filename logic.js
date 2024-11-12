let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let audioPlayer = document.querySelector("#audioPlayer"); // Select the audio player

let isAwake = true; // Variable to track if the assistant is awake
let isListeningForWakeUp = false; // Variable to track if listening only for "wake up" command

// Array of music tracks
const musicTracks = [
    "assets/01 Kaabil Hoon (Jubin Nautiyal) 190Kbps.mp3", // Replace with your track URLs
    "assets/01 Mere Rashke Qamar - Baadshaho.mp3",
    "assets/Tainu Khabar Nahi Munjya 320 Kbps.mp3",
    "assets/05 Tenu Na Bol Pawaan (Yasser Desai) 320Kbps.mp3",
    "assets/Heer Aasmani_320(PagalWorld.com.sb).mp3",
    "assets/128-Loveyatri Mashup - Loveyatri - A Journey Of Love 128 Kbps.mp3",
    "assets/Genius 2018 - Tera Fitoor.mp3", 
    "assets/Dekhha Tenu_320(PagalWorld.com.sb).mp3",
    "assets/Tere Sang Ishq Hua_320(PagalWorld.com.sb).mp3",
    "assets/Kabir_Singh__Bekhayali___Shahid_Kapoor%2CKiara_Advani__Sandeep_Reddy_Vanga___Sachet-Parampara___Irshad(128k).mp3"
];

let currentTrackIndex = 0; // Index to keep track of the current track

// for listing the languages that support my browser
window.speechSynthesis.onvoiceschanged = function() {
    let voices = window.speechSynthesis.getVoices();
    voices.forEach(voice => {
        console.log(`${voice.name} (${voice.lang})`);
    });
};

function speakMarathi(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "mr-IN";
    window.speechSynthesis.speak(text_speak);
}

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-IN";  
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon sir");
    } else if (hours >= 16 && hours <= 20) {
        speak("Good Evening sir");
    } else {
        speak("Good Night Sir");
    }
}

// function for dark mode
function togglelightmode() {
    document.body.classList.toggle("light-mode");
    let mode = document.body.classList.contains("light-mode") ? "Light mode" : "Dark mode";

    // Change the logo based on the mode
    const logo = document.getElementById("logo");
    if (document.body.classList.contains("light-mode")) {
        logo.src = "logo-white.png"; // light mode logo
    } else {
        logo.src = "logo-black.png"; // Dark mode logo
    }

    speak(`${mode} activated`);
}

function toggledarkmode(){
    document.body.classList.remove("light-mode");
    let mode = document.body.classList.contains("light-mode") ? "Light mode" : "Dark mode";

     // Change the logo based on the mode
    const logo = document.getElementById("logo");
    if (document.body.classList.contains("light-mode")) {
        logo.src = "logo-white.png"; // light mode logo
    } else {
        logo.src = "logo-black.png"; // Dark mode logo
    }

    speak(`${mode} activated`);
}

// Greet when the page is loaded
window.addEventListener('load', () => {
    wishMe();
    startRecognition(); // Start recognition on page load
});

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onstart = () => {
    // Simulate the visual changes as if the button was clicked
    btn.innerText = "Listening for your command..."; // Change text to reflect active listening
    btn.style.display = "none"; // Hide the button
    voice.style.display = "block"; // Show the voice GIF
};

recognition.onresult = (event) => {
    console.log(event); // Log speech recognition event for debugging
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    btn.innerText = transcript; // Update button text with the command
    
    if(isAwake){
        takeCommand(transcript.toLowerCase());
    } else if (isListeningForWakeUp && transcript.includes("Wake up")) {
        speak("Waking up...");
        isAwake = true;
        isListeningForWakeUp = false; // Disable listening for wake-up only
        startRecognition(); // Start full recognition
    }
     // Once the command is processed, stop recognition temporarily to show the button
     recognition.stop();
};

// Automatically starts listening for commands if awake
function startRecognition() {
    if (isAwake) {
        recognition.start();
    }
}

// Restart recognition on end or error if awake
recognition.onend = () => {
    // Update the button text based on assistant's state
    btn.innerText = isAwake ? "Listening for your command..." : "Assistant is sleeping. Say 'Wake up' to start.";
    btn.style.display = "flex"; // Show the button again
    voice.style.display = "none"; // Hide the voice GIF

    // Restart recognition depending on whether the assistant is awake or asleep
    setTimeout(() => {
        if (isAwake) {
            recognition.start(); // Restart recognition for full command listening
        } else if (isListeningForWakeUp) {
            recognition.start(); // Restart recognition to listen for "wake up" only
        }
    }, 2000); // Adjust delay as needed
};


recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    if (isAwake) {
        startRecognition(); // Restart recognition on error if awake
    }
};

function takeCommand(message) {
    console.log("Command received: " + message);  // Debugging log
    btn.style.display = "flex";
    voice.style.display = "none";

    if (message.includes("hello")) {
        speak("Hello sir, what can I help you with?");
    } 
    else if (message.includes("नमस्कार")) {
        speakMarathi("नमस्कार साहेब, मी तुम्हाला कशात मदत करू शकतो?");
    }  
    else if (message.includes("तू कोण आहे") || message.includes("कोण आहे तू")) {
        speakMarathi("मी तुमचा virtual assistant आहे, लोकेश सरांनी बनवलंय मला.");
    }   
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Lokesh Sir.");
    } 
    else if (message.includes("switch to marathi")) {
        recognition.lang = "mr-IN"; // Set recognition language to Marathi
        speak("language has been changed from english to marathi")
        speakMarathi("आता तुम्ही मराठीत बोलू शकता")
    }
    else if (message.includes("इंग्रजीत बोला") || message.includes("इंग्रजीत बोल")){
        recognition.lang = "en-IN"; // set recognition language to english 
        speakMarathi("भाषा मराठीतून इंग्रजीत बदलली आहे")
        speak("you can now talk in english")
    }
    else if(message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com"); // Store the reference to the tab
    }
    else if (message.includes("refresh the page")) {
        window.location.reload();
        speak("Refreshing the page.");
    }
    else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    }
    else if (message.includes("close calculator")) {
        speak("closing calculator...");
        window.close("calculator://");
    }
    else if (message.includes("open e-mail")) {
        // Note: This usually requires a custom URL scheme for the application
        window.open("mailto://");
        speak("Opening Gmail...");
    }
    else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } else if (message.includes("open telegram")) {
        speak("Opening Telegram...");
        window.open("tg://");
    }
    else if (message.includes("my github profile")) {
        speak("Opening your Github Profile...");
        window.open("https://github.com/Lcode08");
    }
    else if (message.includes("open linkedin")) {
        speak("Opening linkedin...");
        window.open("https://linkedin.com");
    }
    else if (message.includes("open my linkedin profile")) {
        speak("Opening your linkedin profile...");
        window.open("https://www.linkedin.com/in/lokesh-patil-a998aa262");
    }
    else if (message.includes("open spotify")) {
        speak("Opening spotify...");
        window.open("https://open.spotify.com");
    }
    else if (message.includes("open drive")) {
        speak("Opening drive...");
        window.open("https://drive.google.com/drive/u/0/home");
    }

    else if (message.includes("गुगल चालू करा") || message.includes("गुगल चालू कर")) {
        speakMarathi("गुगल उघडत आहे...");
        window.open("https://google.com");
    } else if (message.includes("इंस्टाग्राम चालू कर") || message.includes("इंस्टाग्राम चालू करा")) {
        speakMarathi("इंस्टाग्राम उघडत आहे...");
        window.open("https://instagram.com");   
    } else if ( message.includes("कॅल्क्युलेटर चालू कर")|| message.includes("कॅल्क्युलेटर चालू करा")) {
        speakMarathi("कॅल्क्युलेटर उघडत आहे...");
        window.open("calculator://");
    } else if (message.includes("व्हॉट्सअॅप चालू कर") || message.includes("वॉट्स अॅप चालू करा")) {
        speakMarathi("व्हॉट्सअॅप उघडत आहे...");
        window.open("whatsapp://");
    } else if (message.includes("माझी लिंक्डइन प्रोफाइल उघडा")) {
        speakMarathi("तुमची लिंक्डइन प्रोफाईल उघडत आहे...");
        window.open("https://www.linkedin.com/in/lokesh-patil-a998aa262");
    }



    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The time is " + time);
    } 
    else if (message.includes("टाईम") || message.includes("टाइम")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speakMarathi( time + "झाले आहेत");
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString('en-US', { day: "numeric", month: "long", year: "numeric"});
        speak("Today's date is " + date);
    } 
    else if (message.includes("तारीख")) {
        let date = new Date().toLocaleString('en-US', { day: "numeric", month: "long", year: "numeric"});
        speakMarathi("आजची तारीख " + date + "आहे");
    } 
    else if (message.includes("play music")) {
        speak("Playing music...");
        playMusic();
        playNextTrack(); // Call to play the next track
    } else if (message.includes("pause music")) {
        speak("Pausing music...");
        pauseMusic();                                               
    } else if (message.includes("stop music")) {
        speak("Stopping music...");
        stopMusic();
    } 
    else if (message.includes("change music")) {
        speak("changing music")
        playNextTrack(); // Call to play the next track
    }
    else if (message.includes("increase volume")) {
        speak("Increasing volume...");
        increaseVolume();
    } else if (message.includes("decrease volume")) {
        speak("Decreasing volume...");
        decreaseVolume();
    } else if (message.includes("go to sleep")) {
        speak("Going to sleep...");
        isAwake = false;
        isListeningForWakeUp = true; // Enable wake-up listening
        voice.style.display = "none";
        recognition.stop(); // Stop recognition until wake-up   
        btn.innerText = "Assistant is sleeping. Say 'Wake up' to start.";
    }
    else if (message.includes("light mode")) {
        togglelightmode();
    } 
    else if (message.includes("dark mode")){
        toggledarkmode();
    }
    else if (message.toLowerCase().startsWith("shifra") || message.toLowerCase().startsWith("shipra")) {

        let query = message.replace(/^shifra\s*,?\s*|^shipra\s*,?\s*/i, "").trim();
        if (query) { // Ensure there is a query to search
            let finalText = "This is what I found on the internet regarding " + query;
            speak(finalText);
        
            // Redirect to Google search with the query
            let googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(googleSearchUrl, "_blank");
        }
    }

    else if (message.includes("i want to make task list")) {
        if (tasks.length === 0) {
            speak("Okay sir, go ahead and add your first task.");
        } else {
            speak("Sir, you already have a task list for today. Do you want to add one more task?");
        }
    } else if (message.includes("add this task") || message.includes("at this task")) {
        let taskToAdd = message.replace("add this task", "").trim();
         taskToAdd = message.replace("at this task", "").trim();

        // Remove specific symbols: ., ,, !, ", '
         taskToAdd = taskToAdd.replace(/[.,!\"']/g, "");
         
        if (taskToAdd) {
            addTask(taskToAdd);
        } else {
            speak("Please say the task you want to add after or before the command 'add this task'.");
        }
    } else if (message.includes("show my task list")) {
        showTasks();
    } 
    else if (message.includes("hide task list")){
        hideTaskList();
    }
    else if (message.includes("clear all tasks") || message.includes("clear all task")) {
        clearTasks();
    } else if (message.includes("delete task")) {
        let taskToDelete = message.replace("delete task", "").trim();

        taskToDelete = taskToDelete.replace(/[.,!\"']/g, "");

        if (taskToDelete) { 
            deleteTask(taskToDelete);
        } else {
            speak("Please say the name of the task you want to delete after or before the command 'delete task'.");
        }
    }

}

function playNextTrack() {
    audioPlayer.src = musicTracks[currentTrackIndex];
    audioPlayer.play();

    // Increment the index for the next track
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length; // Loop back to start
}

function playMusic() {
    audioPlayer.play();
}

function pauseMusic() {
    audioPlayer.pause();   
}

function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0; // Reset to the start of the track
}

function increaseVolume() {
    audioPlayer.volume = Math.min(audioPlayer.volume + 0.4, 1); // Cap volume at 1
}

function decreaseVolume() {
    audioPlayer.volume = Math.max(audioPlayer.volume - 0.4, 0); // Prevent volume from going below 0
}


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];  // Load tasks from localStorage, or initialize an empty array


// Function to add a task to the list
function addTask(task) {
    tasks.push(task);
    saveTasks();
    speak("Task added.");
    console.log("Tasks:", tasks);
}

// Function to show all tasks
function showTasks() {
    if (tasks.length === 0) {
        speak("You have no tasks for today.");
    } else {
        speak("Here are your tasks for today.");
        updateTaskList();
        tasks.forEach((task, index) => {
            speak(`Task ${index + 1}: ${task}`);
        });
    }
}

// Function to clear all tasks
function clearTasks() {
    tasks = [];
    saveTasks();
    speak("All tasks cleared.");
    console.log("Tasks have been cleared.");
}

// Function to delete a specific task by name
function deleteTask(taskName) {
    console.log(tasks);
    console.log(taskName);
    const index = tasks.findIndex(task => task.trim().toLowerCase() === taskName.trim().toLowerCase());

    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks();
        speak(`Deleted the task: ${taskName}`);
    } else {
        speak(`Task ${taskName} not found.`);
    }
}


// Function to display the task list
function updateTaskList() {
    const taskListContainer = document.getElementById("taskListContainer");
    const taskList = document.getElementById("taskList");

    // Clear existing list items
    taskList.innerHTML = "";

    // Populate task list
    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.innerText = task;
        listItem.style.marginBottom = "5px"; // Styling for each task item
        taskList.appendChild(listItem);
    });

    // Show the task list container if there are tasks
    taskListContainer.style.display = tasks.length > 0 ? "block" : "none";
}


// Function to hide the task list
function hideTaskList() {
    document.getElementById("taskListContainer").style.display = "none";
    speak("Task list has been closed.");
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}